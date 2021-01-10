const ATTV_DEBUG: boolean = true;
const ATTV_VERBOSE_LOGGING: boolean = true;
const ATTV_VERSION: string = '0.0.1';

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// PROTOTYPES //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

interface Element {

    /**
     * Gets/Sets html.
     * Will execute javascript inside also
     */
    attvHtml: (html?: string) => string | any;
}

Element.prototype.attvHtml = function (html?: string): string | any {
    let element = this as HTMLElement;

    if (Attv.isUndefined(html)) {
        return element.innerHTML;
    } else {
        element.innerHTML = html;

        if (html) { 
            // look for scripts
            let innerHtmlElement = Attv.createHTMLElement(html);
            let scripts = innerHtmlElement.querySelectorAll('script');
            for (let i = 0; i < scripts.length; i++) {
                if(scripts[i].type?.toLowerCase()?.contains('javascript')) {
                    Attv.eval$(scripts[i].text);
                }
            }
        }
    }
}

interface HTMLElement  {
    /**
     * Attribute helper.
     * value can be an object
     */
    attvAttr: (name?: string | Attv.Attribute, value?: any) => HTMLElement | any;

    /**
     * Show
     */
    attvShow: () => any;

    /**
     * HIde
     */
    attvHide: () => any;
}

HTMLElement.prototype.attvShow = function () {
    let element = this as HTMLElement;
    
    let dataStyle = Attv.parseJsonOrElse<any>(element.attvAttr('data-style'), {});
    if (dataStyle.display) {
        element.style.display = dataStyle?.display;
    } else {
        element.style.display = 'block';
    }
}

HTMLElement.prototype.attvHide = function () {
    let element = this as HTMLElement;
    
    let dataStyle = Attv.parseJsonOrElse<any>(element.attvAttr('data-style'), {});
    if (element.style.display !== 'none') {
        dataStyle.display = element.style.display;
        element.attvAttr('data-style', dataStyle);
    }
    
    element.style.display = 'none'
}

HTMLElement.prototype.attvAttr = function (name: string, value?: any): HTMLElement | any {
    name = name?.toString()?.replace('[', '')?.replace(']', '');

    let element = this as HTMLElement;
    let datasetName = name?.startsWith('data-') && name.replace(/^data\-/, '').dashToCamelCase();

    // GETTER: element.attr()
    if (Attv.isUndefined(name)) {
        let atts = {};
        for (var i = 0; i < element.attributes.length; i++) {
            let attName = element.attributes[i].name;
            let value = Attv.parseJsonOrElse(element.attributes[i].value);

            atts[attName] = value;
        }
        // returns all attributes
        return atts;
    }
    // SETTER: element.attr('data-xxx', 'value')
    if (name === 'data') {
        if (Attv.isUndefined(value)) {
            // get all data 
            let keys = Object.keys(element.dataset);
            let data = {};
            keys.map(key => data[key] = element.dataset[key]);

            return data;
        }
        else if (Attv.isObject(value)){
            let keys = Object.keys(element.dataset);
            keys.forEach(key => delete element.dataset[key]);

            let newKeys = Object.keys(value);
            newKeys.forEach(key => element.dataset[key] = value[key]);
        } else {
            throw Error('Only object can be assigned to dataset');
        }
    }
    // SETTER: element.attr('name', 'value')
    else if (Attv.isDefined(value)) {
        if (datasetName) {
            if (Attv.isObject(value)) {
                value = JSON.stringify(value);
            }
    
            element.dataset[datasetName] = value;
            return this;
        } else {
            // just attribute
            element.setAttribute(name, value);
        }

        return element;
    } 
    // GETTER: element.attr('name')
    else {
        value = element.dataset[datasetName];

        if (Attv.isUndefined(value)) {
            // get from the attrbitue
            value = element.getAttribute(name) || undefined;
        }

        return Attv.parseJsonOrElse(value);
    }
}

interface String {
    contains: (text: string) => boolean;
    equalsIgnoreCase: (other: string) => boolean;
    camelCaseToDash: () => string;
    dashToCamelCase: () => string;
}

if (typeof String.prototype.contains !== 'function') {
    String.prototype.contains = function (text: string): boolean {
        let obj: String = this as String;
    
        return obj.indexOf(text) >= 0;
    }
}

if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (text: string): boolean {
        let obj: String = this as String;

        return obj.indexOf(text) == 0;
    }
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (text: string): boolean {
        let obj: String = this as String;

        return obj.indexOf(text, this.length - text.length) !== -1;
    }
}

if (typeof String.prototype.camelCaseToDash !== 'function') {
    String.prototype.camelCaseToDash = function (): string {
        let text: String = this as String;

        return text.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
    }
}

if (typeof String.prototype.dashToCamelCase !== 'function') {
    String.prototype.dashToCamelCase = function (): string {
        let text: String = this as String;

        return text.toLowerCase().replace(/-(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    }
}

if (typeof String.prototype.equalsIgnoreCase !== 'function') {
    String.prototype.equalsIgnoreCase = function (other: string): boolean {
        let text: String = this as String;

        return text?.toLowerCase() === other?.toLowerCase();
    }
}

namespace Attv {
    export type BooleanOrVoid = boolean | void;

    export const version = ATTV_VERSION;
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Attv.Ajax ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Ajax {

    export type AjaxMethod = 'post' | 'put' | 'delete' | 'patch' | 'get' | 'option';

    export interface AjaxOptions {
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
        xhr.onreadystatechange = function (e: Event) {
            let xhr = this as XMLHttpRequest;
            if (xhr.readyState == 4) {
                let wasSuccessful = this.status >= 200 && this.status < 400;

                if (options?.callback) {
                    options?.callback(options, wasSuccessful, xhr);
                }
            }
        };
        xhr.onerror = function (e: ProgressEvent<EventTarget>) {
            if (options?.callback) {
                options?.callback(options, false, xhr);
            }
        }

        // header
        options.headers?.forEach(header => xhr.setRequestHeader(header.name, header.value));

        // last check
        if (isUndefined(options.url))
            throw new Error('url is empty');

        xhr.open(options.method, options.url, true);
        xhr.send();
    }

    export function buildUrl(option: AjaxOptions): string {
        if (isUndefined(option.url))
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
            any = parseJsonOrElse(any);
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
////////////////////////////////// Base classes ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {
    
    /**
    * Base class for data-attributes
    */
    export class Attribute {

        /**
         * The attribute values
         */
        public readonly values: Attribute.Value[] = [];

        /**
         * The dependencies
         */
        public readonly dependency: Attribute.Dependency = {};

        /**
         * This attribute name. Most of the time,
         * this should be that same as the key
         */
        public name: string;

        /**
         * When set to 'none' means no wildcard. All attribute values needs to be registered. 
         * Default to 'none'.
         */
        public wildcard: Attv.Attribute.WildcardType = "*";

        /**
         * Is Auto load? (default is false)
         */
        public isAutoLoad: boolean = false;

        /**
         * 
         * @param key the unique key for this attribute
         * @param isAutoLoad 
         */
        constructor (public key: string) {
            this.name = key;
            this.dependency.internals = [DataSettings.Key];
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
         * Returns raw string 
         */
        raw(element: HTMLElement): string {
            return element.getAttribute(this.name) || undefined;
        }

        /**
         * Returns the current attribute value
         * @param element the element
         */
        getValue<TValue extends Attribute.Value>(element: HTMLElement): TValue {
            let value = element?.attvAttr(this.name);

            // #1. Find an attribute value with the exact match
            let attributeValue = this.values.filter(val => val.value?.equalsIgnoreCase(value))[0] as TValue;

            if (this.allowsWildcard()) {
                // #2. Find the 'default' value if this attribute allows wildcard
                if (!attributeValue) {
                    attributeValue = this.values.filter(val => val.value?.equalsIgnoreCase(Attv.configuration.defaultTag))[0] as TValue
                }

                // #2. Find the first 'default' value if this attribute allows wildcard
                if (!attributeValue) {
                    attributeValue = this.values.filter(val => Attv.isUndefined(val.value))[0] as TValue
                }
                
                // #3. find the first if this attribute allows wildcard
                if (!attributeValue) {
                    attributeValue = new Attribute.Value() as TValue;
                    attributeValue.attribute = this;
                    this.values.push(attributeValue);
                }
            }

            // #3. generic attribute
            if (!attributeValue) {
                Attv.log('fatal', `${this}='${value || ''}' is not valid`, element);
            }

            return attributeValue;
        }

        /**
         * Checks to see if element is loaded
         * @param element element to check
         */
        isElementLoaded(element: HTMLElement): boolean {
            let isLoaded = element.attvAttr(this.loadedName());
            return isLoaded === 'true' || !!isLoaded; 
        }

        /**
         * Mark element as loaded or not loaded
         * @param element the element to mark
         * @param isLoaded is loaded?
         */
        markElementLoaded(element: HTMLElement, isLoaded: boolean): boolean {
            element.attvAttr(this.loadedName(), isLoaded);

            return isLoaded;
        }

        /**
         * String representation
         */
        toString(): string {
            return `[${this.name}]`;
        }

        /**
         * Sets value
         * @param attributeValue the attribute value
         * @param loadElementFnOrOptions either LoadElementFn or ValueOptions
         */
        map(value: Attv.Attribute.ValueFnOrString, loadElementFn?: Attv.Attribute.LoadElementFn) {
            let attributeValue: Attv.Attribute.Value;

            if (Attv.isString(value)) {
                attributeValue = new Attv.Attribute.Value(value as string, loadElementFn); 
            } else if (Attv.isType(value, 'function')) {
                attributeValue = (value as Attv.Attribute.ValueFn)(this);
            }

            attributeValue.attribute = this;
            attributeValue.dependencies.internals = this.copyDependencies(this.dependency.internals, attributeValue.dependencies.internals);
            attributeValue.dependencies.requires = this.copyDependencies(this.dependency.requires, attributeValue.dependencies.requires);
            attributeValue.dependencies.uses = this.copyDependencies(this.dependency.uses, attributeValue.dependencies.uses);
            
            this.values.push(attributeValue);
        }

        private copyDependencies(source: string[], target: string[]) {
            if (source?.length > 0) {
                if (Attv.isUndefined(target)) {
                    target = [];
                }

                target.push(...source);
            }

            return target;
        }
    }

}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Attv.Attributes /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Attribute {

    /**
     * Base class for attribute-value
     */
    export class Value {
        
        public readonly dependencies: Attribute.Dependency = {};

        public readonly validators: Validators.AttributeValidator[] = [];
        public settings: Settings;
        public attribute: Attribute;
        
        constructor (public value: string = undefined, private loadElementFn?: LoadElementFn) {

        }
    
        /**
         * Load element
         * @param element the Element
         */
        load(element: HTMLElement): BooleanOrVoid {
            if (this.loadElementFn) {
                return this.loadElementFn(this, element) || true;
            }

            return true;
        }

        /**
         * 
         * @param element the element
         * @param orDefault (optional) default settings
         */
        loadSettings<TSettings extends Settings>(element: HTMLElement, callback?: (settings: TSettings) => void): boolean {
            let dataSetting = Attv.resolveValue<DataSettings.Value>(DataSettings.Key, element);
            
            this.settings = dataSetting.getSettingsForValue<TSettings>(this, element);
            if (this.settings) {
                if (callback) {
                    callback(this.settings as TSettings);
                }
    
                Attv.Attribute.Settings.commit(element, this.settings);
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

    export interface ValueFn {
        (attribute: Attv.Attribute): Attv.Attribute.Value;
    }


    export type ValueFnOrString = string | ValueFn;
    export type ValueFnOrLoadElementFn = LoadElementFn | ValueFn;
    export type LoadElementFn = (value: Attv.Attribute.Value, element: HTMLElement) => BooleanOrVoid;
    export type WildcardType = "*" | "<number>" | "<boolean>" | "<querySelector>" | "<jsExpression>" | "<json>" | "none";
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////// Attv.Attribute.Settings /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Attribute {
    
    /**
     * Attribute configuration
     */
    export interface Settings {

        /**
         * The attribute value
         * that this settings belongs to.
         * This is required.
         */
        attributeValue: Attv.Attribute.Value;

        /**
         * True to override existing style
         */
        override?: boolean;

        /**
         * Inside the <style></style>
         */
        style?: string;

        /**
         * Style urls
         */
        styleUrls?: {name: string, url: string, options?: any}[];

        /**
         * Javascript urls
         */
        jsUrls?: {name: string, url: string, options?: any}[];
    }

    export namespace Settings {
        let excludeProperties = ['attributeValue', 'override', 'style', 'styleUrls', 'jsUrls'];

        export function commit(element: HTMLElement, settings: Settings) {
            let apply = true;
    
            if (settings.style) {
                let elementId = 'style-' + settings.attributeValue.attribute.settingsName;
                let styleElement = document.querySelector(`style#${elementId}`) as HTMLStyleElement;
                apply = settings.override || !styleElement;
    
                if (!styleElement) {
                    styleElement = Attv.createHTMLElement('<style>') as HTMLStyleElement;
                    styleElement.id = elementId;
        
                    document.head.append(styleElement);
                }
        
                if (apply) {
                    styleElement.innerHTML = settings.style;
                }
            }
    
            if (settings.styleUrls) {
                settings.styleUrls.forEach(styleUrl => {
                    let elementId = `link-${styleUrl.name}-${settings.attributeValue.attribute.settingsName}`;
                    let linkElement = document.querySelector(`link#${elementId}`) as HTMLLinkElement;
                    apply = settings.override || !linkElement;
    
                    if (!linkElement) {
                        linkElement = Attv.createHTMLElement('<link>') as HTMLLinkElement;
                        document.head.append(linkElement);
                    }
    
                    if (apply) {
                        linkElement.id = elementId;
                        linkElement.rel = "stylesheet";
                        linkElement.href = styleUrl.url;
                        linkElement.integrity = styleUrl.options?.integrity;
                        linkElement.crossOrigin = styleUrl.options?.crossorigin;
                    }
                });
            }
    
            if (settings.jsUrls) {
                settings.jsUrls.forEach(jsUrl => {
                    let elementId = `script-${jsUrl.name}-${settings.attributeValue.attribute.settingsName}`;
                    let scriptElement = document.querySelector(`script#${elementId}`) as HTMLScriptElement;
                    apply = settings.override || !scriptElement;
    
                    if (!scriptElement) {
                        scriptElement = Attv.createHTMLElement('<script>') as HTMLScriptElement;
                        document.body.append(scriptElement);
                    }
    
                    if (apply) {
                        scriptElement.id = elementId;
                        scriptElement.src = jsUrl.url;
                        scriptElement.integrity = jsUrl.options?.integrity;
                        scriptElement.crossOrigin = jsUrl.options?.crossorigin;
                        scriptElement.onload = () => Attv.loadElements();
                    }
                });
            }

            let applicableKeys = Object.keys(settings).filter(key => !excludeProperties.some(prop => prop.equalsIgnoreCase(key)));
            let settingsObject = {};
            applicableKeys.forEach(r => settingsObject[r] = settings[r]);

            element.attvAttr(settings.attributeValue.attribute.settingsName(), settingsObject);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////// 1st class attributes /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataSettings {
    export const Key = 'data-settings';

    /**
     * [data-settings]='*|json'
     */
    export class Value extends Attv.Attribute.Value {
        
        /**
         * Returns the option object (json)
         * @param element the element
         */
        getSettings<TSettings>(element: HTMLElement): TSettings {
            let rawValue = this.attribute.raw(element);
            let settings = parseJsonOrElse<TSettings>(rawValue, {});
    
            return settings;
        }

        getSettingsForValue<TSettings extends Attribute.Settings>(value: Attv.Attribute.Value, element: HTMLElement): TSettings {
            let rawValue = element.attvAttr(value.attribute.settingsName());
            let settings = parseJsonOrElse<TSettings>(rawValue, {});
            settings.attributeValue = settings.attributeValue || value;
    
            return settings;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Validators //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Validators {

    export interface AttributeValidator {
        validate(value: Attribute.Value, element: Element): boolean;
    }

    /**
     * DOM is required to have an attribute specified by attribute ids
     */
    export class RequiredAttribute implements AttributeValidator {

        constructor (private requiredAttributeIds: string[]) {
            // do nothing
        }
    
        validate(value: Attribute.Value, element: HTMLElement): boolean {
            let isValidated = true;

            let attributes = this.requiredAttributeIds.map(attId => Attv.getAttribute(attId));

            // check for other require attributes
            for (let i = 0; i < attributes.length; i++) {
                let attribute = attributes[i];
                if (!attribute?.raw(element)) {
                    Attv.log('error', `${value} is requiring ${attribute} to be present in DOM`, element)
                }

                isValidated = isValidated && !!attribute;
            }

            return isValidated;
        }
    }

    /**
     * DOM is required to have an attribute of [name]=[value]
     */
    export class RequiredAttributeWithValue implements AttributeValidator {

        constructor (private requiredAttributes: { name: string, value: string}[]) {
            // do nothing
        }
    
        validate(value: Attribute.Value, element: HTMLElement): boolean {
            let isValidated = true;

            // check for other require attributes
            for (let i = 0; i < this.requiredAttributes.length; i++) {
                let attribute = this.requiredAttributes[i];
                let requiredAttribute = element.attvAttr(attribute.name);
                if (!requiredAttribute.equalsIgnoreCase(attribute.value)) {
                    Attv.log('error', `${value} is requiring [${attribute.name}]='${attribute.value}' to be present in DOM`, element)
                }

                isValidated = isValidated && !!requiredAttribute;
            }

            return isValidated;
        }
    }

    /**
     * Requirement Any element
     */
    export class RequiredElement implements AttributeValidator {

        constructor (private elementTagNames: string[]) {
            // do nothing
        }

        validate(value: Attribute.Value, element: Element): boolean {
            let isValidated = false;

            // check for element that this attribute belongs to
            for (let i = 0; i < this.elementTagNames.length; i++) {
                let elementName = this.elementTagNames[i];
                if (element.tagName.equalsIgnoreCase(elementName)) {
                    isValidated = true;
                    break;
                }
            }

            if (!isValidated) {
                Attv.log('error', `${value} can only be attached to elements [${this.elementTagNames}]`, element)
            }

            return isValidated;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Configuration ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    export interface Configuration {

        isDebug: boolean;

        isVerboseLogging: boolean;        
        
        readonly defaultTag: string;

        readonly logLevels: string[];
    }

    export class DefaultConfiguration implements Configuration {

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
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Attv.DomParser ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Dom {

    export var domParser: DOMParser;
    export const htmlTags: { tag: string, parentTag: string }[] = [
        { tag: 'tr', parentTag: 'tbody' },
        { tag: 'th', parentTag: 'thead' },
        { tag: 'td', parentTag: 'tr' },
    ];

    export function getParentTag(elementOrTag: HTMLElement | string) {
        let tagName: string = (elementOrTag as HTMLElement)?.tagName || elementOrTag as string;
        let parentTag = Attv.Dom.htmlTags.filter(tag => tag.tag.equalsIgnoreCase(tagName))[0]?.parentTag;
        if (!parentTag) {
            parentTag = 'div';
        }

        return parentTag;
    }

    export function createHTMLElement(tagName: string, innerHtml: string): HTMLElement {
        let parentTag = getParentTag(tagName);
        
        let htmlElement = document.createElement(parentTag);
        htmlElement.innerHTML = innerHtml;

        return htmlElement;
    }

    export function parseDom(any: string | HTMLElement): HTMLElement {
        if (isString(any)) {
            let text = any as string;
            let htmlElement: HTMLElement;
            let tag: string = text.toString();

            if (tag.startsWith('<') && tag.endsWith('>')) {
                let tempTag = tag.substring(1, tag.length - 1);
                try {
                    htmlElement = window.document.createElement(tempTag);
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
                    tag = domDocument.firstElementChild.tagName;
                    if (domDocument.querySelector('parsererror')) {
                        tag = 'div';
                    }
                } catch (e) {
                    // ignore
                }

                htmlElement = Attv.Dom.createHTMLElement(tag, text);
            }

            any = htmlElement;
        }

        return any as HTMLElement;
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Helper functions ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {
    let idCounter = 0;

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

    export function isEvaluatable(any: string) {
        return any?.startsWith('(') && any?.endsWith(')');
    }

    export function eval$(any: string) {
        return window.eval(any);
    }

    export function navigate(url: any, target?: string) {
        if (target) {
            window.open(url, target);
        } else {
            window.location.href = url;
        }
    }

    export function createHTMLElement(any: string | HTMLElement): HTMLElement {
        return Attv.Dom.parseDom(any);
    }

    export function parseJsonOrElse<TAny extends any>(any: any, orDefault?: any): TAny {  
        // Fixed boolean attribute names
        if (any === 'false' || any === 'true') {
            return (any === 'true') as any;
        }

        // if string
        if (Attv.isString(any)) {
            let text = any as string;
            // does it look like json?
            if (text?.startsWith('{') && text?.endsWith('}')) {
                text = `(${text})`;
            }
    
            // json ex: ({ name: 'value' }). so we just 
            if (Attv.isEvaluatable(text)) {
                //do eval
                any = Attv.eval$(text);
            } else {
                try {
                    any = JSON.parse(text);
                } catch {
                    // nothing
                }
            }
        }

        return (any || orDefault) as TAny;
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

    export function onDocumentReady(fn: () => void): void {
        if (document.readyState == 'loading') {
            // without jQuery (doesn't work in older IEs)
            document.addEventListener('DOMContentLoaded', fn, false);
        } else {
            fn();
        }
    }

}


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Attv Functions ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    export var configuration: Configuration;
    export const attributes: Attribute[] = [];

    export function loadElements(root?: HTMLElement): void {
        if (isUndefined(root)) {
            root = document.querySelector('html');
        }

        Attv.log('debug', 'Loading element', root);
        
        // auto load all attvs that are marked auto load
        attributes.filter(attribute => attribute.isAutoLoad).forEach((attribute, index) => {
            let elements = root.querySelectorAll(`${attribute}`);
            elements.forEach((element: HTMLElement, index) => {
                try {
                    // #1. If it's already loaded return
                    if (attribute.isElementLoaded(element))
                        return;

                    let attributeValue = attribute.getValue(element);

                    // #2. Check if the attribute value is supported
                    if (!attributeValue) {
                        let attributeValue = element.attvAttr(attribute.name);
                        Attv.log('warning', `${attribute} does not support ${attribute}='${attributeValue}'`, element);
                        return;
                    }

                    // #3. Validate
                    let isValidated = true;
                    for (var i = 0; i < attributeValue.validators.length; i++) {
                        let validator = attributeValue.validators[i];
                        isValidated = isValidated && validator.validate(attributeValue, element);
                    }

                    if (!isValidated) {
                        return;
                    }

                    // #4. Load the stuff!
                    let isLoaded = attributeValue.load(element);
                    if (Attv.isUndefined(isLoaded) || isLoaded) {
                        attribute.markElementLoaded(element, true);
                    }
                }
                catch (error) {
                    Attv.log('error', `Unexpected error occurred when loading ${attribute}`, error, element);
                }
            });
        });
    }

    export function getAttribute(attributeKey: string): Attribute {
        return Attv.attributes.filter(att => att.key == attributeKey)[0];
    }

    export function register(attributeKey: string, options? : Attv.Registrar.AttributeRegistrationOptions, valuesFn?: (attribute: Attribute) => void ): void {
        Attv.Registrar.registerAttribute(attributeKey, options, valuesFn);
    }
    
    /**
     * Returns the data attribute
     * @param attributeKey id
     */
    export function resolve(attributeKey: string): Attribute {
        let attribute = Attv.getAttribute(attributeKey);

        if (attribute) {
            let deps = attribute.dependency.requires?.concat(attribute.dependency.uses).concat(attribute.dependency.internals);
            let isMissingDepedencies = Attv.isDefined(deps) && deps.some(dep => dep === attributeKey)
    
            if (isMissingDepedencies) {
                Attv.log('warning', `${attribute} should be declared as the dependant in ${attribute}. This is for documentation purposes`);
            }
        }

        if (!attribute) {
            throw new Error(`Attribute [${attributeKey}] can not be found. Did you register ${attributeKey}?`);
        }

        return attribute;
    }
    
    /**
     * Returns the data attribute
     * @param attributeKey id
     */
    export function resolveValue<TValue extends Attribute.Value>(attributeKey: string, element: HTMLElement): TValue {
        let attribute = resolve(attributeKey);

        return attribute.getValue<TValue>(element);
    }

    /**
     * Adds a dependency data attribute to the 'element'
     * @param element the element
     * @param value the value
     */
    export function addAttribute(attributeKey: string, element: HTMLElement, any: string) {
        let attribute = this.resolve(attributeKey);
        element.attvAttr(attribute.name, any);
    }
 
}

namespace Attv.Registrar {

    export interface AttributeRegistrationOptions {
        attributeName?: string;
        isAutoLoad?: boolean;
        wildcard?: Attv.Attribute.WildcardType;
        override?: boolean;
        create?: (attributeKey: string) => Attribute;
    }

    let registrations: AttributeRegistration[] = [];
    let isInitialized = false;
    let init: (() => void)[] = [];
    let pre: (() => void)[] = [];
    let post: (() => void)[] = [];

    function initialize() {
        if (!Attv.configuration) {
            Attv.configuration = new DefaultConfiguration();
        }
        Attv.log('Attv v.' + Attv.version);

        isInitialized = true;
    }

    function registerBuiltinAttributes() {
        registerAttribute(DataSettings.Key, { wildcard: '<json>' }, attribute => {
            attribute.map(() => new DataSettings.Value());
        });
    }

    function registerAllAttributes() {
        for (var i = 0; i < registrations.length; i++) {
            let attribute = registrations[i].register();

            attributes.push(attribute);
        }
    }

    function cleanup() {
        registrations = [];
    }

    export function run() {
        if (!isInitialized) {
            init.push(initialize);
            pre.push(registerBuiltinAttributes);
        }

        post.push(registerAllAttributes, cleanup, loadElements);

        Attv.onDocumentReady(() => {
            for (var i = 0; i < init.length; i++) {
                init[i]();
            }
        
            for (var i = 0; i < pre.length; i++) {
                pre[i]();
            }
        
            for (var i = 0; i < post.length; i++) {
                post[i]();
            }
        
            init = [];
            pre = [];
            post = [];
        });
    }

    class AttributeRegistration {

        constructor (public attributeKey: string, public options: AttributeRegistrationOptions, public valuesFn?: (attribute: Attribute) => void) {
            options.create = options.create || ((key) => new Attribute(key));
        }

        register(): Attribute {
            let shouldOverride = false;

            // see if there's an existing attribute
            let attribute = Attv.getAttribute(this.attributeKey);

            if (!attribute) {
                shouldOverride = true;
                let fn = this.options.create || ((key) => new Attribute(key));
                attribute = fn(this.attributeKey);
            }

            if (shouldOverride) {
                attribute.isAutoLoad = Attv.isDefined(this.options.isAutoLoad) ? this.options.isAutoLoad : false;
                attribute.name = this.options.attributeName || this.attributeKey;
                attribute.wildcard = this.options.wildcard || '*';
            }

            if (this.valuesFn) {
                this.valuesFn(attribute);
            }

            if (attribute.values.length > 0) {
                attribute.values.forEach(v => {
                    Attv.log('debug', v.toString());
                })
            } else {
                // wild card
                Attv.log('debug', `${attribute.toString()}='${attribute.wildcard}'`);
            }

            return attribute;
        }
    }

    export function registerAttribute(attributeKey: string, options? : AttributeRegistrationOptions, valuesFn?: (attribute: Attribute) => void ): void {
        pre.push(() => {
            if (!options.attributeName)
                options.attributeName = attributeKey;
            
            let registration = new AttributeRegistration(attributeKey, options, valuesFn);
            
            registrations.push(registration);
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Attv Registrations ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.Registrar.run();

if (typeof exports !== 'undefined') {
    module.exports = { 
        Attv,
        ATTV_DEBUG,
        ATTV_VERBOSE_LOGGING,
        ATTV_VERSION
    };
}