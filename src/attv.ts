const ATTV_DEBUG: boolean = true;
const ATTV_VERBOSE_LOGGING: boolean = true;

namespace Attv {
    /**
     * Version. This should be replaced and updated by the CI/CD process
     */
    export const version: string = '0.0.1';
}

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
        public readonly values: Attribute.Value[] = [];

        public readonly dependency: Attribute.Dependency = new Attribute.Dependency();
        public readonly loadedName: string;
        public readonly settingsName: string;

        /**
         * zero-index priority
         */
        public priority: number = 1;

        /**
         * When set to 'none' means no wildcard. All attribute values needs to be registered. 
         * Default to 'none'.
         */
        public wildcard:  "*" | "<number>" | "<boolean>" | "<querySelector>" | "<jsExpression>" | "<json>" | "none" = "*";

        /**
         * Returns true when the wildcard === 'none'
         */
        public get isStrict(): boolean {
            return this.wildcard.equalsIgnoreCase('none');
        }

        /**
         * 
         * @param uniqueId unique id
         * @param name  the attribute name
         * @param description description
         * @param isAutoLoad is auto-load
         */
        constructor (
            public uniqueId: string,
            public name: string, 
            public isAutoLoad: boolean = false) {
            this.loadedName = this.name + "-loaded";
            this.settingsName = this.name + "-settings";
            this.dependency.internals.push(DataSettings.UniqueId);
        }
        
        /**
         * Register attribute values
         * @param attributeValues attribute values
         */
        registerAttributeValues(attributeValues: Attribute.Value[]) {
            // add dependency
            for (let i = 0; i < attributeValues.length; i++) {
                // add dependency
                attributeValues[i].resolver.requires.push(...this.dependency.requires);
                attributeValues[i].resolver.uses.push(...this.dependency.uses);
                attributeValues[i].resolver.internals.push(...this.dependency.internals);
            }

            this.values.push(...attributeValues);
        }

        /**
         * Checks to see if this attribute exists in this element
         * @param element the element
         */
        exists(element: HTMLElement): boolean {
            return !!element?.attvAttr(this.name);
        }

        /**
         * Returns the current attribute value
         * @param element the element
         */
        getValue<TValue extends Attribute.Value>(element: HTMLElement): TValue {
            let value = element?.attvAttr(this.name);
            let attributeValue = this.values.filter(val => val.getRaw(element)?.equalsIgnoreCase(value))[0] as TValue;

            // Print/throw an error
            // when no 'attributeValue' found and there's 'element' to evaluate and isStrict is marked true
            if (!attributeValue && this.isStrict) {
                Attv.log('fatal', `${this}='${value || ''}' is not valid`, element);
            }
            
            // #1. if attribute is undefined
            // find the one with the default tag
            if (!attributeValue) {
                attributeValue = this.values.filter(val => val.getRaw(element)?.equalsIgnoreCase(Attv.configuration.defaultTag))[0] as TValue;
            }

            // #2. find the first attribute
            if (!attributeValue) {
                attributeValue = this.values[0] as TValue;
            }

            // #3. generic attribute
            if (!attributeValue) {
                let rawAttributeValue = element?.getAttribute(this.name);
                attributeValue = new Attribute.Value(rawAttributeValue, this) as TValue;
            }

            return attributeValue;
        }

        /**
         * Checks to see if element is loaded
         * @param element element to check
         */
        isElementLoaded(element: HTMLElement): boolean {
            let isLoaded = element.attvAttr(this.loadedName);
            return isLoaded === 'true' || !!isLoaded;
        }

        /**
         * Mark element as loaded or not loaded
         * @param element the element to mark
         * @param isLoaded is loaded?
         */
        markElementLoaded(element: HTMLElement, isLoaded: boolean): boolean {
            element.attvAttr(this.loadedName, isLoaded);

            return isLoaded;
        }

        /**
         * String representation
         */
        toString(): string {
            return `[${this.name}]`;
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
        public readonly resolver: Resolver = new Resolver(this);
        public settings: Settings;
        
        constructor (protected value: string, 
            public attribute: Attribute,
            public validators: Validators.AttributeValidator[] = []) {
        }

        /**
         * Returns raw string
         */
        getRaw(element: HTMLElement): string {
            return this.value?.toString() || element?.attvAttr(this.attribute.name);
        }
    
        /**
         * Load element
         * @param element the Element
         */
        loadElement(element: HTMLElement): boolean {
            return true;
        }

        /**
         * 
         * @param element the element
         * @param orDefault (optional) default settings
         */
        loadSettings<TSettings extends Settings>(element: HTMLElement, callback?: (settings: TSettings) => void): boolean {
            let dataSettings = this.resolver.resolve<DataSettings>(DataSettings.UniqueId);
            
            this.settings = dataSettings.getSettingsForValue<TSettings>(this, element);
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
        toString(prettyPrint?: boolean): string {
            if (prettyPrint) {
                return `[${this.attribute.name}]='${this.value || this.attribute.wildcard }'`;
            } else {
                return `[${this.attribute.name}]${this.value ? `=${this.value}`: ''}`;
            }
        }
    }

    export class Dependency {

        /**
         * List of attribute Ids that we require
         */
        readonly requires: string[] = [];

        /**
         * List of attribute Id that we use
         */
        readonly uses: string[] = [];

        /**
         * List of attribute Id that we internvally use
         */
        readonly internals: string[] = [];

        /**
         * List of all dependencies
         */
        allDependencies(): string[] {
            return this.requires.concat(this.uses).concat(this.internals);
        }
    }

    export class Resolver extends Dependency {
        
        constructor (private attributeValue: Attribute.Value) {
            super();
        }

        /**
         * Returns the data attribute
         * @param attributeId id
         */
        resolve<TAttribute extends Attribute>(attributeId: string) {
            let attribute = Attv.getAttribute(attributeId) as TAttribute;

            if (!this.allDependencies().some(dep => dep === attributeId)) {
                Attv.log('warning', `${attribute || attributeId} should be declared as the dependant in ${this.attributeValue.attribute}. This is for documentation purposes`);
            }

            if (!attribute) {
                throw new Error(`${attribute || attributeId} can not be found. Did you register ${attribute || attributeId}?`);
            }

            return attribute;
        }

        /**
         * Adds a dependency data attribute to the 'element'
         * @param element the element
         * @param value the value
         */
        addAttribute(uniqueId: string, element: HTMLElement, any: string) {
            let attribute = this.resolve(uniqueId);
            element.attvAttr(attribute.name, any);
        }
    }
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

            element.attvAttr(settings.attributeValue.attribute.settingsName, settingsObject);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////// 1st class attributes /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    /**
     * [data-settings]='*|json'
     */
    export class DataSettings extends Attv.Attribute {
        static readonly UniqueId = 'DataSettings';
    
        constructor (name: string) {
            super(DataSettings.UniqueId, name);
            this.wildcard = "<json>";
        }
        
        /**
         * Returns the option object (json)
         * @param element the element
         */
        getSettings<TSettings>(element: HTMLElement): TSettings {
            let rawValue = this.getValue(element).getRaw(element);
            let settings = parseJsonOrElse<TSettings>(rawValue, {});
    
            return settings;
        }

        getSettingsForValue<TSettings extends Attribute.Settings>(value: Attv.Attribute.Value, element: HTMLElement): TSettings {
            let rawValue = element.attvAttr(value.attribute.settingsName);
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
                let attributeValue = attribute.getValue(element);
                if (!attributeValue?.getRaw(element)) {
                    Attv.log('error', `${value.toString(true)} is requiring ${attribute} to be present in DOM`, element)
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
                    Attv.log('error', `${value.toString(true)} is requiring [${attribute.name}]='${attribute.value}' to be present in DOM`, element)
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
                Attv.log('error', `${value.toString(true)} can only be attached to elements [${this.elementTagNames}]`, element)
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

        get defaultTag(): string  {
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

    export function isType(any: any, expectedType: 'undefined' | 'string' | 'boolean' | 'number' | 'object'): boolean {
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
            console.error(...data);
            throw new Error(...data);
        } else if (level === 'debug') {
            console.debug(...data);
        } else {
            console.log(...data);
        }
    }

    export function onDocumentReady(fn: () => void): void {
        // without jQuery (doesn't work in older IEs)
        document.addEventListener('DOMContentLoaded', fn, false);
    }

}


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Attv Functions ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    export var configuration: Configuration;
    export const attributes: Attribute[] = [];

    export const loader: {
        /**
         * Initialization. Reserved for internal use
         */
        init: (() => void)[],

        /**
         * Before attribute registrations
         */
        pre: (() => void)[],

        /**
         * During attribute registrations
         */
        post: (() => void)[]
    } = {
        init: [],
        pre: [],
        post: []
    };

    export function loadElements(root?: HTMLElement): void {
        if (isUndefined(root)) {
            root = document.querySelector('html');
        }

        Attv.log('debug', 'Loading element', root);
        
        // auto load all attvs that are marked auto load
        attributes.filter(attribute => attribute.isAutoLoad).sort((a, b) => a.priority < b.priority ? -1 : 0).forEach((attribute, index) => {
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
                    let isLoaded = attributeValue.loadElement(element);
                    if (isLoaded) {
                        attribute.markElementLoaded(element, isLoaded);
                    }
                }
                catch (error) {
                    Attv.log('error', `Unexpected error occurred when loading ${attribute}`, error, element);
                }
            });
        });
    }

    export function getAttribute(id: string): Attribute {
        return attributes.filter(att => att.uniqueId == id)[0];
    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Attv Registrations ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {
    let attributeRegistrar: AttributeRegistration[] = [];
    let valueRegistrar: ValueRegistration[] = [];

    /**
     * Register an attribute
     * @param attributeName the attribute name (ie: data-partial, data-stuffs)
     * @param fn callback function to create the attribute
     * @param valuesFn callback function register attribute values to the attribute
     */
    export function registerAttribute(attributeName: string, 
        fn: (attributeName: string) => Attribute,
        valuesFn?: (attribute: Attribute, list: Attribute.Value[]) => void): void {
        let registry = new AttributeRegistration(attributeName, fn, valuesFn);

        attributeRegistrar.push(registry);
    }

    /**
     * Adds attribute value to an attribute
     * @param id Attribute's unique id
     * @param valuesFn callback function register attribute values to the attribute
     */
    export function registerAttributeValue(id: string, valuesFn?: (attribute: Attribute, list: Attribute.Value[]) => void): void {
        let registry = new ValueRegistration(id, valuesFn);

        valueRegistrar.push(registry);
    }
    
    /**
     * Unregister attribute. This only work during loader.pre
     * @param attributeName attribute name
     */
    export function unregisterAttribute(attributeName: string): void {
        let attributes = attributeRegistrar.filter(factory => factory.attributeName !== attributeName);
        attributeRegistrar.splice(0, attributeRegistrar.length);
        attributeRegistrar.push(...attributes);
    }

    class AttributeRegistration {
        constructor (public attributeName: string, 
            private fn: (attributeName: string) => Attribute,
            private valuesFn?: (attribute: Attribute, list: Attribute.Value[]) => void) {
            // do nothing
        }

        register(): Attribute {
            let attribute = this.fn(this.attributeName);
            
            //Attv.log('debug', `${attribute.toString()}`, attribute);

            let attributeValues: Attribute.Value[] = [];

            if (this.valuesFn) {
                this.valuesFn(attribute, attributeValues);
            }

            // from valueRegistrar
            valueRegistrar.filter(r => r.attributeUniqueId === attribute.uniqueId).forEach(r => {
                r.register(attribute, attributeValues);
            });
    
            let values = attributeValues.reverse();
            attribute.registerAttributeValues(values);

            if (attributeValues.length > 0) {
                attributeValues.forEach(v => {
                    Attv.log('debug', v.toString(true), attributeValues);
                })
            } else {
                // wild card
                Attv.log('debug', `${attribute.toString()}='${attribute.wildcard}'`);
            }

            return attribute;
        }
    }

    class ValueRegistration {
        constructor (public attributeUniqueId: string, 
            public register: (attribute: Attribute, list: Attribute.Value[]) => void) {
            // do nothing
        }
    }

    function initialize() {
        if (!Attv.configuration) {
            Attv.configuration = new DefaultConfiguration();
        }
    }

    function preRegister() {
        Attv.log('Attv v.' + Attv.version);
        Attv.registerAttribute('data-settings', (name: string) => new Attv.DataSettings(name));
    }

    function register() {
        for (var i = 0; i < attributeRegistrar.length; i++) {
            let attribute = attributeRegistrar[i].register();

            attributes.push(attribute);
        }
    }

    function cleanup() {
        attributeRegistrar = [];
        valueRegistrar = [];
    }

    Attv.loader.init.push(initialize);
    Attv.loader.pre.push(preRegister);
    Attv.loader.post.push(register, loadElements, cleanup);
}

Attv.onDocumentReady(() => {
    for (var i = 0; i < Attv.loader.init.length; i++) {
        Attv.loader.init[i]();
    }

    for (var i = 0; i < Attv.loader.pre.length; i++) {
        Attv.loader.pre[i]();
    }

    for (var i = 0; i < Attv.loader.post.length; i++) {
        Attv.loader.post[i]();
    }

    Attv.loader.init = [];
    Attv.loader.pre = [];
    Attv.loader.post = [];
});

if (typeof exports !== 'undefined') {
    module.exports = { 
        Attv,
        ATTV_DEBUG,
        ATTV_VERBOSE_LOGGING
    };
}