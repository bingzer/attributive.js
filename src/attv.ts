
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Constants ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const ATTV_DEBUG: boolean = true;
const ATTV_VERBOSE_LOGGING: boolean = true;
const ATTV_VERSION: string = '0.0.1';

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Attv ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    export const version = ATTV_VERSION;

    export type BooleanOrVoid = boolean | void;
    export type CreateAttributeFn = (() => Attv.Attribute);
    export type CreatedAttributeFn = (attribute: Attribute) => void;
    export type StringOrCreateAttributeFn = string | CreateAttributeFn;
    export type ValueFnOrString = string | ValueFn;
    export type ValueFnOrLoadElementFn = LoadElementFn | ValueFn;
    export type LoadElementFn = (value: Attv.AttributeValue, element: HTMLElement, option?: LoadElementOptions) => BooleanOrVoid;
    export type WildcardType = "*" | "<number>" | "<boolean>" | "<querySelector>" | "<jsExpression>" | "<json>" | "none";
    export type HTMLElementOrString = HTMLElement | string;

    /**
     * Priority: [0, 1, 2, 3, undefined]. The higher is the more priority.
     * undefined is always last. Undefined is less of a priority than 0.
     * By default it's always undefined.
     */
    export type PriorityType =  undefined | 0 | 1 | 2 | 3 | number;

    /**
     * Options when loading an element
     */
    export interface LoadElementOptions {
        /**
         * Force reload
         */
        forceReload?: boolean;

        /**
         * Include self when querying against attribute's selector
         */
        includeSelf?: boolean;
        
        /**
         * A context/scope object (optional).
         * If specified, you need to also generate a contextId
         */
        context?: any;

        /**
         * Context reference id.
         * IF null is a global context.
         * 
         * This property is used by other attribute to compare context when loading elements.
         */
        contextId?: string;
    }

    /**
     * Dependency object used by Attv.Attribute and Attv.AttributeValue
     */
    export interface Dependency {

        /**
         * List of attribute Ids that we require
         */
        requires?: string[];

        /**
         * List of attribute Id that we use
         */
        uses?: string[];

        /**
         * List of attribute Id that we internvally use
         */
        internals?: string[];
    }

    /**
     * A callback function to create an AttributeValue given by its Attribute
     */
    export interface ValueFn {

        /**
         * Attribute In, AttributeValue out
         */
        (attribute: Attv.Attribute): Attv.AttributeValue;

    }
    
    
    ////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// Attv.Attribute ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    /**
    * Base class for data-attributes
    */
   export class Attribute {

        /**
         * The attribute values
         */
        public readonly values: AttributeValue[] = [];

        /**
         * The dependencies
         */
        public readonly deps: Dependency = {};

        /**
         * This attribute name. Most of the time,
         * this should be that same as the key
         */
        public name: string;

        /**
         * When set to 'none' means no wildcard. All attribute values needs to be registered. 
         * Default to 'none'.
         */
        public wildcard: Attv.WildcardType = "*";

        /**
         * Is Auto load? (default is true)
         */
        public isAutoLoad: boolean = true;
        
        /**
         * Priority Type by default is undefined
         */
        public priority: PriorityType = undefined;

        /**
         * 
         * @param key the unique key for this attribute
         * @param isAutoLoad 
         */
        constructor (public key: string) {
            this.name = key;
        }

        loadedName() {
            return this.name + '-loaded';
        }

        settingsName() {
            return this.name + "-settings";
        }

        /**
         * Returns true when the wildcard is anything but 'none'
         */
        allowsWildcard(): boolean {
            return !this.wildcard.equalsIgnoreCase('none');
        }

        /**
         * Checks to see if this attribute exists in this element
         * @param element the element
         */
        exists(element: HTMLElement): boolean {
            return !!element?.attvAttr(this.name);
        }

        /**
         * Returns raw string. If empty it will return 'undefined'
         * @param element the element
         */
        raw(element: HTMLElement): string {
            return element?.getAttribute(this.name) || undefined;
        }

        /**
         * Returns the parsed object from raw()
         * @param element the element
         */
        parseRaw<TAny>(element: HTMLElement, context?: any): TAny {
            let raw = this.raw(element);

            switch (this.wildcard) {
                case "<querySelector>": {
                    if (raw === 'this') {
                        return element as any;
                    }
                    
                    return Attv.select(raw) as any;
                }
                case "<jsExpression>":
                    return Attv.eval$(raw, context) as any;
                default:
                    return Attv.parseJsonOrElse(raw, undefined, context) as TAny;
            }
        }

        /**
         * Returns the current attribute value
         * @param element the element
         */
        getValue<TValue extends AttributeValue>(element: HTMLElement): TValue {
            let hasThisAttribute = element?.hasAttribute(this.name);
            let value = element?.getAttribute(this.name);
            let allowsWildcard = this.allowsWildcard();

            // has to be in this order:

            // #1. Find an attribute value with the exact match
            let attributeValue = this.values.filter(val => Attv.isDefined(val) && val.value?.equalsIgnoreCase(value))[0] as TValue;

            // #2. Find the 'default' value if this attribute
            if ((allowsWildcard || !hasThisAttribute) && !attributeValue) {
                attributeValue = this.values.filter(val => val.value?.equalsIgnoreCase(Attv.configuration.defaultTag))[0] as TValue
            }

            // #4. Find the first 'any' value if this attribute allows wildcard
            if ((allowsWildcard || !hasThisAttribute) && !attributeValue) {
                attributeValue = this.values.filter(val => Attv.isUndefined(val.value))[0] as TValue
            }

            // #3. if this attribute does not allow wildcard throws an error
            if (!allowsWildcard && !attributeValue) {
                Attv.log('fatal', `${this}='${value || ''}' is not valid.`, element);
            }
                
            // #5. find the first if this attribute allows wildcard
            if (allowsWildcard && !attributeValue) {
                attributeValue = new AttributeValue() as TValue;
                attributeValue.attribute = this;
                this.values.push(attributeValue);
            }

            return attributeValue;
        }

        /**
         * Returns undefined if settings attribute does not exists
         * @param element the element
         * @param orDefault (optional) default settings
         * @see Attv.Attribute.settingsName()
         */
        getSettings<TAny>(element: HTMLElement): TAny {
            let attribute = element?.getAttribute(this.settingsName()) || undefined;
            let setting = Attv.parseJsonOrElse<TAny>(attribute);

            return setting || undefined;
        }

        /**
         * Checks to see if element is loaded
         * @param element element to check
         */
        isLoaded(element: HTMLElement): boolean {
            let isLoaded = element.attvAttr(this.loadedName());
            return isLoaded === 'true' || !!isLoaded; 
        }

        /**
         * Mark element as loaded or not loaded
         * @param element the element to mark
         * @param isLoaded is loaded?
         */
        markLoaded(element: HTMLElement, isLoaded: boolean): boolean {
            element.attvAttr(this.loadedName(), isLoaded);

            return isLoaded;
        }

        /**
         * Maps an attribute value
         * @param attributeValue the attribute value
         * @param loadElementFnOrOptions either LoadElementFn or ValueOptions
         */
        map(value: Attv.ValueFnOrString, loadElementFn?: Attv.LoadElementFn) {
            let attributeValue: Attv.AttributeValue;

            if (Attv.isString(value)) {
                attributeValue = new Attv.AttributeValue(value as string, loadElementFn); 
            } else if (Attv.isType(value, 'function')) {
                attributeValue = (value as Attv.ValueFn)(this);
            }

            attributeValue.attribute = this;
            this.deps.internals = Attv.concatArrays(this.deps.internals, attributeValue.deps.internals);
            this.deps.requires = Attv.concatArrays(this.deps.requires, attributeValue.deps.requires);
            this.deps.uses = Attv.concatArrays(this.deps.uses, attributeValue.deps.uses);
            
            if (this.values.indexOf(attributeValue) > 0 || this.values.filter(v => v.value === attributeValue.value).length > 0) {
                Attv.log('warning', `${attributeValue} has been registered previously`);
                return;
            } 

            this.values.push(attributeValue);

            Attv.log('debug', attributeValue.toString());
        }

        /**
         * Try to resolve an attribute
         * @param attributeKey the key of the attribute
         */
        resolve<TAttribute extends Attribute>(attributeKey: string): TAttribute {
            return Attv.resolveAttribute(this, attributeKey);
        }

        /**
         * Try to resolve an attribute value
         * @param attributeKey the key of the attribute
         * @param element the element to inspect with
         */
        resolveValue<TAttributeValue extends AttributeValue>(attributeKey: string, element: HTMLElement): TAttributeValue {
            return Attv.resolveAttributeValue(this, attributeKey, element);
        }

        /**
         * String representation
         */
        toString(): string {
            return `[${this.name}]`;
        }

        /**
         * Selector
         */
        selector(): string {
            return this.toString();
        }

        public static compareFn = (a: Attribute, b: Attribute) => {
            let priorityA = Attv.isUndefined(a.priority) ? -1 : a.priority;
            let priorityB = Attv.isUndefined(b.priority) ? -1 : b.priority;
            
            return priorityA > priorityB ? -1 : 0;
        }
    }

    
    ////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Attv.AttributeValue //////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////

    /**
     * Base class for attribute-value
     */
    export class AttributeValue {
        
        public readonly deps: Dependency = {};

        public validators: Validators.ValidatingType[];
        public attribute: Attribute;
        
        constructor (public value: string = Attv.configuration.defaultTag, private fn?: LoadElementFn) {
        }
    
        /**
         * Load element
         * @param element the Element
         */
        load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
            if (this.fn) {
                return this.fn(this, element, options) || true;
            }

            return true;
        }

        /**
         * To string
         */
        toString(): string {
            return `[${this.attribute.name}="${this.value || this.attribute.wildcard }"]`;
        }
    }    

    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Attv.Configuration///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////

    export class Configuration {

        isDebug: boolean = false;
        isVerboseLogging: boolean = false;
        
        constructor() {
            if (ATTV_DEBUG) {
                this.isDebug = true;
            }

            if (ATTV_VERBOSE_LOGGING) {
                this.isVerboseLogging = true;
            }
        }

        get defaultTag(): string {
            return "default";
        }

        get logLevels(): string[] {
            return ['log', 'warning', 'error', 'debug', 'fatal'];
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////// Attv.Registrar////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////

    export namespace Registrar {

        export type AttributeRegistrationOptionsOrCreatedAttributeFn = AttributeRegistrationOptions | CreatedAttributeFn;

        export interface AttributeRegistrationOptions {
            /**
             * The attribute name
             */
            attributeName?: string;

            /**
             * Auto load? Default is true
             */
            isAutoLoad?: boolean;

            /**
             * Wildcard type
             */
            wildcard?: Attv.WildcardType;

            /**
             * Priority
             */
            priority?: PriorityType;

            /**
             * Overide existing value
             */
            override?: boolean;
        }
    
        let registrations: AttributeRegistration[] = [];
        let isInitialized = false;
        let init: (() => void)[] = [];
        let pre: (() => void)[] = [];
        let post: (() => void)[] = [];
    
        function initialize() {
            if (!Attv.configuration) {
                Attv.configuration = new Configuration();
            }
            Attv.log('Attv v.' + Attv.version);
    
            isInitialized = true;
        }
    
        function registerAllAttributes() {
            //for (let i = registrations.length - 1; i >= 0; i--) {
            for (let i = 0; i < registrations.length; i++) {
                let attribute = registrations[i].register();
    
                if (attributes.indexOf(attribute) < 0) {
                    attributes.push(attribute);
                }
            }
        }
    
        function cleanup() {
            registrations = [];
        }
    
        export function run() {
            if (!isInitialized) {
                init.push(initialize);
            }
    
            post.push(registerAllAttributes, cleanup, loadElements);
    
            Attv.whenReady(() => {
                init.forEach(run => run());
                pre.forEach(run => run());
                post.forEach(run => run());
            
                init = [];
                pre = [];
                post = [];
            });
        }
    
        class AttributeRegistration {
    
            constructor (public attributeKey: StringOrCreateAttributeFn, public options: AttributeRegistrationOptions = {}, public valuesFn?: CreatedAttributeFn) {
            }
    
            register(): Attribute {
                let shouldOverride = Attv.isUndefined(this.options.override) ? true : this.options.override;
                let attribute: Attv.Attribute;

                if (Attv.isString(this.attributeKey)) {
                    // see if there's an existing attribute
                    attribute = Attv.getAttribute(this.attributeKey as string);
        
                    if (!attribute) {
                        shouldOverride = true;
                        let fn = (attKey) => new Attribute(attKey);
                        attribute = fn(this.attributeKey);
                    }
                } else if (Attv.isType(this.attributeKey, 'function')) {
                    attribute = (this.attributeKey as CreateAttributeFn)();
                }

                // setup attribute from the options
                if (shouldOverride) {
                    attribute.name = this.options.attributeName || attribute.name || attribute.key;
                    attribute.wildcard =  this.options.wildcard || attribute.wildcard;
                    attribute.priority = this.options.priority || attribute.priority;
                    if (Attv.isDefined(this.options.isAutoLoad)) {
                        attribute.isAutoLoad = this.options.isAutoLoad;
                    } else {
                        attribute.isAutoLoad = Attv.isUndefined(attribute.isAutoLoad) ? true : attribute.isAutoLoad;
                    }
                }
    
                if (this.valuesFn) {
                    this.valuesFn(attribute);
                }
    
                if (attribute.values.length == 0) {
                    // wild card
                    Attv.log('debug', `${attribute.toString()}='${attribute.wildcard}'`);
                }
    
                return attribute;
            }
        }
    
        export function registerAttribute(attributeKeyOrFunction: StringOrCreateAttributeFn, options? : AttributeRegistrationOptionsOrCreatedAttributeFn, valuesFn?: CreatedAttributeFn ): void {
            pre.push(() => {
                let attOptions = options as AttributeRegistrationOptions;
                if (Attv.isType(attOptions, 'function')) {
                    valuesFn = attOptions as CreatedAttributeFn;
                }

                attOptions = attOptions || {} as AttributeRegistrationOptions;
                valuesFn = valuesFn || ((att) => new Attv.AttributeValue());

                let registration = new AttributeRegistration(attributeKeyOrFunction, attOptions, valuesFn);
                
                registrations.push(registration);
            });

            // If it's already initialized
            // run the this right away
            if (isInitialized) {
                // run it right away
                run();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Validators //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    export namespace Validators {
        export type ValidatingObj = { name: string, options?: any };
        export type ValidatingFn = (value: AttributeValue, element: HTMLElement, options?: any) => boolean;
        export type ValidatingType = ValidatingObj | ValidatingFn;

        export const NeedAttrKeys = "NeedAttrKeys";
        export const NeedAttrWithValue = "NeedAttrWithValue";
        export const NeedElements = "NeedElements";

        let builtIns: { name: string, fn: ValidatingFn}[] = [
            {
                name: Validators.NeedAttrKeys,
                fn: (value, element, options) => {
                    let isValidated = true;
            
                    let attributes: Attribute[] = options.map(key => Attv.getAttribute(key));
            
                    // check for other require attributes
                    for (let i = 0; i < attributes.length; i++) {
                        let attribute = attributes[i];
                        let exists = attribute.exists(element);

                        if (!exists) {
                            Attv.log('error', `${value} needs ${attribute}`, element)
                        }

                        isValidated = isValidated && exists;
                    }
            
                    return isValidated;
                }
            }, {
                name: Validators.NeedAttrWithValue,
                fn: (value, element, options) => {
                    let isValidated = true;
            
                    // check for other require attributes
                    for (let i = 0; i < options.length; i++) {
                        let attribute = options[i];
                        let requiredAttribute = element.attvAttr(attribute.name);
                        if (!requiredAttribute.equalsIgnoreCase(attribute.value)) {
                            Attv.log('error', `${value} needs [${attribute.name}]='${attribute.value}'`, element)
                        }
            
                        isValidated = isValidated && !!requiredAttribute;
                    }
            
                    return isValidated;
                }
            }, {
                name: Validators.NeedElements,
                fn: (value, element, options) => {
                    let isValidated = false;

                    // check for element that this attribute belongs to
                    for (let i = 0; i < options.length; i++) {
                        let elementName = options[i];
                        if (element.tagName.equalsIgnoreCase(elementName)) {
                            isValidated = true;
                            break;
                        }
                    }

                    if (!isValidated) {
                        Attv.log('error', `${value} requires [${options.elementTagNames}]`, element)
                    }

                    return isValidated;
                }
            }
        ];

        export function validate(value: AttributeValue, element: HTMLElement): boolean {
            if (!value.validators || value.validators.length === 0)
                return true;

            let isValidated = true;

            value.validators.forEach(v => {
                let validatorFn: ValidatingFn;
                let validatorOptions: any;

                if (Attv.isObject(v)) {
                    let vObj = v as ValidatingObj;
                    validatorFn = builtIns.filter(v => v.name === vObj.name)[0].fn;  // no workies
                    validatorOptions = vObj.options;
                } else {
                    validatorFn = v as ValidatingFn;
                }

                isValidated = isValidated && validatorFn(value, element, validatorOptions);
            });

            return isValidated;
        }

        export function registerValidator(name: string, fn: ValidatingFn) {
            builtIns[name] = fn;
        }
        
    }

    
    ////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Attv.Dom //////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////

    export namespace Dom {

        export var domParser: DOMParser;
        export const tags: { tag: string, parent: string }[] = [
            { tag: 'tbody', parent: 'table' },
            { tag: 'thead', parent: 'table' },
            { tag: 'tr', parent: 'tbody' },
            { tag: 'th', parent: 'tr' },
            { tag: 'td', parent: 'tr' },
            { tag: 'li', parent: 'ul' },
            { tag: 'option', parent: 'select'}
            // TODO: more
        ];

        export function getParentTag(elementOrTag: HTMLElement | string) {
            let tagName: string = (elementOrTag as HTMLElement)?.tagName || elementOrTag as string;
            let parentTag = Attv.Dom.tags.filter(tag => tag.tag.equalsIgnoreCase(tagName))[0]?.parent;
            if (!parentTag) {
                parentTag = 'div';
            }

            return parentTag;
        }

        function createHTMLElement(tagName: string, innerHtml: string): HTMLElement {
            let parentTag = getParentTag(tagName);
            
            let htmlElement = document.createElement(parentTag);
            htmlElement.innerHTML = innerHtml;

            return htmlElement;
        }

        /**
         * Returns the PARENT of element. This is by design so that we can parse multiple elements without a container.
         * For example:
         * <div>First</div>
         * <div>Second</div>
         * 
         * Returns 
         * <div>
         *  <div>First</div>
         *  <div>Second</div>
         * </div>
         * @param any any string
         */
        export function parseDom(any: string | HTMLElement): HTMLElement {
            if (isString(any)) {
                let text = any as string;
                let htmlElement: HTMLElement;
                let tag: string = text.toString();

                if (tag.startsWith('<') && tag.endsWith('>')) {
                    let tempTag = tag.substring(1, tag.length - 1);
                    try {
                        htmlElement = document.createElement(tempTag);
                    } catch (e) {
                        // ignore
                    }
                }

                if (!htmlElement) {
                    try {
                        if (!Attv.Dom.domParser) {
                            Attv.Dom.domParser = new DOMParser();
                        }
        
                        let domDocument = Attv.Dom.domParser.parseFromString(text, 'text/xml');
                        tag = (domDocument.firstChild as Element).tagName;
                        if (domDocument.querySelector('parsererror')) {
                            tag = 'div';
                        }
                    } catch (e) {
                        // ignore
                    }

                    htmlElement = createHTMLElement(tag, text);
                }

                any = htmlElement;
            }

            return any as HTMLElement;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Attv.Ajax ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    
    export namespace Ajax {
        export type AjaxMethod = 'post' | 'put' | 'delete' | 'patch' | 'get' | 'option';

        export interface AjaxOptions extends LoadElementOptions {
            url: string;
            method?: AjaxMethod;
            data?: any;
            callback?: (ajaxOptions: AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest) => void;
            headers?: {name: string, value: string}[];
            createHttpRequest?: () => XMLHttpRequest;
        }
            
        export function sendAjax(options: AjaxOptions) {
            options.method = options.method || 'get';
    
            let xhr = options.createHttpRequest ? options.createHttpRequest() : new XMLHttpRequest();
            xhr.onreadystatechange = (e: Event) => {
                let request = e.target as XMLHttpRequest;
                if (request.readyState == 4) {
                    let wasSuccessful = request.status >= 200 && request.status < 400;
    
                    if (options?.callback) {
                        options?.callback(options, wasSuccessful, request);
                    }
                }
            };
            xhr.onerror = (e: ProgressEvent<EventTarget>) => {
                let request = e.target as XMLHttpRequest;
                if (options?.callback) {
                    options?.callback(options, false, request);
                }
            }
    
            // last check
            if (Attv.isUndefined(options.url))
                throw new Error('No url');
    
            xhr.open(options.method, options.url, true);

            // headers must be set after open()
            options.headers?.forEach(header => xhr.setRequestHeader(header.name, header.value));

            xhr.send();
        }
    
        export function buildUrl(option: AjaxOptions): string {
            if (Attv.isUndefined(option.url))
                return undefined;
    
            let url = option.url;
            if (option.data && (!option.method || option.method === 'get')) {
                url += `?${objectToQuerystring(option.data)}`;
            } 
            
            return url;
        }
    
        export function objectToQuerystring(any: any): string {
            if (!any)
                return '';
    
            if (isString(any)) {
                any = Attv.parseJsonOrElse(any);
                if (isString(any)) {
                    return any;
                }
            }
    
            return Object.keys(any)
                    .sort()
                    .map(key => {
                        return window.encodeURIComponent(key)
                            + '='
                            + window.encodeURIComponent(any[key]);
                    })
                    .join('&');
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Helper functions ////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////

    let idCounter = 0;

    export var configuration: Configuration;
    export const attributes: Attribute[] = [];
    
    export function isUndefined(any: any): boolean {
        return isType(any, 'undefined');
    }

    export function isDefined(any: any): boolean {
        return !isType(any, 'undefined');
    }

    export function isString(any: any) {
        return isType(any, 'string');
    }

    export function isObject(any: any) {
        return isType(any, 'object');
    }

    export function isType(any: any, expectedType: 'undefined' | 'string' | 'boolean' | 'number' | 'object' | 'function'): boolean {
        return typeof(any) === expectedType;
    }

    export function concatArrays(...arrays: any[][]): any[] {
        let target = [];
        for (let i = 0; i < arrays.length; i++) {
            let array = arrays[i];
            if (Attv.isDefined(array) && array.length > 0) {
                target.push(...array);
            }
        }

        return target;
    }

    export function isEvaluatable(any: string) {
        return any?.startsWith('(') && any?.endsWith(')');
    }

    export function eval$(any: string, context?: any) {
        context = context || {};

        // credit to: https://gist.github.com/softwarespot/76252a838efdcace2df1f9c724e37351
        // Call is used to define where "this" within the evaluated code should reference.
        // eval does not accept the likes of eval.call(...) or eval.apply(...) and cannot
        // be an arrow function
        let evaluateEval = () => {
            try {
                // Create an args definition list e.g. "arg1 = this.arg1, arg2 = this.arg2"
                const argsStr = Object.keys(context)
                    .map(key => `${key} = this.${key}`)
                    .join(',');
                const argsDef = argsStr ? `let ${argsStr};` : '';
    
                return eval(`${argsDef}${any}`);   
            } catch {
                return undefined;  // return undefined whatever happened
            }
        };
        
        return evaluateEval.call(context);
    }

    export function globalThis$() {
        if (typeof globalThis !== 'undefined') {
            return globalThis;
        }

        return window || document;
    }

    export function select(elementOrSelector: HTMLElement | string): HTMLElement {
        let element = elementOrSelector as HTMLElement;
        if (Attv.isString(elementOrSelector)) {
            element = document.querySelector(elementOrSelector as string) as HTMLElement;
        }

        return element;
    }

    export function selectAll(selector: string): HTMLElement[] {
        return Attv.toArray<HTMLElement>(document.querySelectorAll(selector as string));
    }

    export function selectMany(rootElements: HTMLElement[], selector: string, includeSelf?: boolean): HTMLElement[] {
        let elements: HTMLElement[] = [];
        
        rootElements.forEach(rootElement => {
            let elems = Attv.toArray<HTMLElement>(rootElement.querySelectorAll(selector));
            elements.push(...elems);

            if (includeSelf && rootElement.matches(selector)) {
                elements.push(rootElement);
            }
        });

        return elements;
    }

    export function toArray<TAny>(any: any): TAny[] {
        return [].slice.call(any) as TAny[];
    }

    export function parseJsonOrElse<TAny extends any>(any: any, orDefault?: any, context?: any): TAny {  
        // Fixed boolean attribute names
        if (any === 'false' || any === 'true') {
            return (any === 'true') as any;
        }
        // Fixed boolean actual type
        if (any === false || any === true) {
            return (any === true) as any;
        }

        // if string
        if (Attv.isString(any)) {
            let text = any as string;
            // does it look like json object?
            if (text?.startsWith('{') && text?.endsWith('}')) {
                text = `(${text})`;
            }
            // does it look like json array?
            if (text?.startsWith('[') && text?.endsWith(']')) {
                text = `(${text})`;
            }
    
            // json ex: ({ name: 'value' }). so we just 
            if (Attv.isEvaluatable(text)) {
                //do eval
                any = Attv.eval$(text, context);
            }
        }

        if (Attv.isUndefined(any))
            return orDefault;

        return any as TAny;
    }

    export function generateElementId(attributeId: string) {
        attributeId = attributeId.camelCaseToDash();
        idCounter++;
        return attributeId + '-' + idCounter;
    }

    export function log(...data: any[]) {
        let level = data[0];
        if (!Attv.configuration.isVerboseLogging) {
            if (['debug', 'warning', 'error'].indexOf(level) !== -1) {
                return;
            }
        }

        if (Attv.configuration.logLevels?.indexOf(level) >= 0) {
            data = data.splice(1);
        }
        
        if (level === 'warning') {
            console.warn(...data);
        } else if (level === 'error') {
            console.error(...data);
        } else if (level === 'fatal') {
            throw new Error(...data);
        } else if (level === 'debug') {
            console.debug(...data);
        } else {
            console.log(...data);
        }
    }

    export function whenReady(fn: () => void): void {
        if (document.readyState == 'loading') {
            // without jQuery (doesn't work in older IEs)
            document.addEventListener('DOMContentLoaded', fn, false);
        } else {
            fn();
        }
    }

    export function loadElements(root?: HTMLElementOrString, options: LoadElementOptions = {}): void {
        let rootElements: HTMLElement[];

        Attv.log('debug', `loadElements()`);

        if (Attv.isUndefined(options.includeSelf)) {
            options.includeSelf = true;
        }

        if (isUndefined(root)) {
            rootElements = [Attv.select('html')];
            options.includeSelf = false;
        } else if (Attv.isString(root)) {
            rootElements = Attv.selectAll(root as string);
        } else if (root instanceof HTMLElement) {
            rootElements = [root as HTMLElement];
        }
        
        // auto load all attvs that are marked auto load
        attributes.filter(attribute => attribute.isAutoLoad).sort(Attv.Attribute.compareFn).forEach((attribute, index) => {
            let elements = Attv.selectMany(rootElements, attribute.selector(), options.includeSelf);

            elements.forEach((element: HTMLElement, index) => {
                try {
                    // #1. If it's already loaded return
                    if (!options.forceReload && attribute.isLoaded(element))
                        return;

                    let attributeValue = attribute.getValue(element);

                    // #2. Check if the attribute value is supported
                    if (!attributeValue) {
                        let attributeValue = element.attvAttr(attribute.name);
                        Attv.log('warning', `${attribute} does not support ${attribute}='${attributeValue}'`, element);
                        return;
                    }

                    // #3. Validate
                    let isValidated = Attv.Validators.validate(attributeValue, element);
                    if (!isValidated) {
                        return;
                    }

                    // #4. Load the stuff!
                    let isLoaded = attributeValue.load(element, options);
                    if (Attv.isUndefined(isLoaded) || isLoaded) {
                        attribute.markLoaded(element, true);
                    }
                }
                catch (error) {
                    Attv.log('error', `Unexpected error on ${attribute}`, error, element);
                }
            });
        });
    }

    /**
     * Returns an attribute by its attribute key
     * @param attributeKey An attribute key
     */
    export function getAttribute<TAttribute extends Attribute>(attributeKey: string): TAttribute {
        return Attv.attributes.filter(att => att.key == attributeKey)[0] as TAttribute;
    }

    /**
     * Registers an attribute 
     * @param attributeKey An attribute key or a function that returns an attribute
     * @param options The options or a callback function to setup an attribute
     * @param callback A callback function to setup an attribute
     */
    export function register(attributeKey: StringOrCreateAttributeFn, options? : Attv.Registrar.AttributeRegistrationOptionsOrCreatedAttributeFn, callback?: CreatedAttributeFn ): void {
        Attv.Registrar.registerAttribute(attributeKey, options, callback);
    }

    /**
     * Unregister an attribute and return the attribute
     * @param attributeKey the key to remove
     */
    export function unregister<TAttribute extends Attv.Attribute>(attributeKeyOrAttribute: string | Attv.Attribute): TAttribute {
        let attribute: Attv.Attribute;

        if (Attv.isString(attributeKeyOrAttribute)) {
            attribute = Attv.attributes.filter(att => att.key.equalsIgnoreCase(attributeKeyOrAttribute as string))[0];
        } else {
            attribute = attributeKeyOrAttribute as Attv.Attribute;
        }

        if (attribute) {
            return Attv.attributes.splice(Attv.attributes.indexOf(attribute), 1)[0] as TAttribute;
        }

        return undefined;
    }
    
    /**
     * Returns the data attribute
     * @param attributeKey id
     */
    export function resolveAttribute<TAttribute extends Attribute>(caller: Attribute, attributeKey: string): TAttribute {
        let attribute = Attv.getAttribute<TAttribute>(attributeKey);

        if (attributeKey && !attribute) {
            Attv.log('fatal', `No [${attributeKey}]. Did you register ${attributeKey}?`);
        }

        if (caller) {
            let deps = Attv.concatArrays(caller.deps?.requires, caller.deps?.uses, caller.deps?.internals) || [];
            let isMissingDepedencies = Attv.isDefined(deps) && !deps.some(dep => dep === attributeKey)
    
            if (isMissingDepedencies) {
                Attv.log('warning', `${attribute} is the dependant of ${caller}. (for documentation)`);
            }
        }

        return attribute;
    }
    
    /**
     * Returns the data attribute
     * @param attributeKey id
     */
    export function resolveAttributeValue<TValue extends AttributeValue>(caller: Attribute, attributeKey: string, element: HTMLElement): TValue {
        let attribute = resolveAttribute(caller, attributeKey);

        return attribute.getValue<TValue>(element);
    }
}

Attv.Registrar.run();