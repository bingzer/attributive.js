
namespace Attv {
    /**
     * Version. This should be replaced and updated by the CI/CD process
     */
    export const version: string = '0.0.1';
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// PROTOTYPES //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

interface HTMLElement  {
    /**
     * Attribute helper.
     * value can be an object
     */
    attr: (name?: string | Attv.Attribute, value?: any) => HTMLElement | any;
}

HTMLElement.prototype.attr = function (name: string, value?: any): HTMLElement | any {
    name = name?.toString()?.replace('[', '')?.replace(']', '');

    let element = this as HTMLElement;
    let datasetName = name?.startsWith('data-') && name.replace(/^data\-/, '').dashToCamelCase();

    // element.attr()
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
    // element.attr('data')
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
    // element.attr('name')
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
    // element.attr('name', 'value')
    else {
        value = element.dataset[datasetName];
        if (!value) {
            // get from the attrbitue
            value = element.getAttribute(name) || undefined;
        }

        return Attv.parseJsonOrElse(value);
    }
}

interface String {
    contains: (text: string) => boolean;
    startsWith: (text: string) => boolean;
    endsWith: (text: string) => boolean;
    equalsIgnoreCase: (other: string) => boolean;
    camelCaseToDash: () => string;
    dashToCamelCase: () => string;
}

String.prototype.contains = function (text: string): boolean {
    let obj: String = this as String;

    return obj.indexOf(text) >= 0;
}

String.prototype.startsWith = function (text: string): boolean {
    let obj: String = this as String;

    return obj.indexOf(text) == 0;
}

String.prototype.endsWith = function (text: string): boolean {
    let obj: String = this as String;

    return obj.indexOf(text, this.length - text.length) !== -1;
}

String.prototype.camelCaseToDash = function (): string {
    let text: String = this as String;

    return text.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

String.prototype.dashToCamelCase = function (): string {
    let text: String = this as String;

    return text.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

String.prototype.equalsIgnoreCase = function (other: string): boolean {
    let text: String = this as String;

    return text?.toLowerCase() === other?.toLowerCase();
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
        callback?: (wasSuccessful: boolean, xhr: XMLHttpRequest) => void;
        headers?: {name: string, value: string}[];

        _internalCallback?: (ajaxOptions: AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest) => void;
    }
        
    export function sendAjax(options: AjaxOptions) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e: Event) {
            let xhr = this as XMLHttpRequest;
            if (xhr.readyState == 4) {
                let wasSuccessful = this.status >= 200 && this.status < 400;

                options?._internalCallback(options, wasSuccessful, xhr);
            }
        };
        xhr.onerror = function (e: ProgressEvent<EventTarget>) {
            options?._internalCallback(options, false, xhr);
        }

        // header
        options.headers?.forEach(header => xhr.setRequestHeader(header.name, header.value));

        xhr.open(options.method, options.url, true);
        xhr.send();
    }

    export function buildUrl(option: AjaxOptions): string {
        let url = option.url;
        if (option.method === 'get') {
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

    export class AttributeDepenency {

        /**
         * List of attribute Ids that we require
         */
        requires: string[] = [];

        /**
         * List of attribute Id that we use
         */
        uses: string[] = [];

        /**
         * List of all dependencies
         */
        allDependencies(): string[] {
            return this.requires.concat(this.uses);
        }
    }

    export class AttributeResolver extends AttributeDepenency {
        
        constructor (private attributeValue: AttributeValue) {
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
            element.attr(attribute.name, any);
        }
    }
    
    /**
    * Base class for data-attributes
    */
    export class Attribute {
        public readonly attributeValues: AttributeValue[] = [];

        public readonly description: string;
        public readonly loadedName: string;
        public readonly dependency: AttributeDepenency = new AttributeDepenency();

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
            public isAutoLoad: boolean = true) {
            this.loadedName = this.name + "-loaded";
        }
        
        /**
         * Register attribute values
         * @param attributeValues attribute values
         */
        registerAttributeValues(attributeValues: AttributeValue[]) {
            // add dependency
            for (let i = 0; i < attributeValues.length; i++) {
                // add dependency
                attributeValues[i].resolver.requires.push(...this.dependency.requires);
                attributeValues[i].resolver.uses.push(...this.dependency.uses);
            }

            this.attributeValues.push(...attributeValues);
        }

        /**
         * Returns the current attribute value
         * @param element the element
         */
        getValue<TAttributeValue extends AttributeValue>(element: HTMLElement): TAttributeValue {
            let value = element?.attr(this.name);
            let attributeValue = this.attributeValues.filter(val => val.getRawValue(element) === value)[0] as TAttributeValue;

            // #1. if attribute is undefined
            // find the one with the default tag
            if (!attributeValue) {
                attributeValue = this.attributeValues.filter(val => val.getRawValue(element) === Attv.configuration.defaultTag)[0] as TAttributeValue;
            }

            // #2. find the first attribute
            if (!attributeValue) {
                attributeValue = this.attributeValues[0] as TAttributeValue;
            }

            // #3. generic attribute
            if (!attributeValue) {
                let rawAttributeValue = element?.attr(this.name) as string;
                attributeValue = new AttributeValue(rawAttributeValue, this) as TAttributeValue;
            }

            return attributeValue;
        }

        /**
         * Checks to see if element is loaded
         * @param element element to check
         */
        isElementLoaded(element: HTMLElement): boolean {
            let isLoaded = element.attr(this.loadedName);
            return isLoaded === 'true';
        }

        /**
         * String representation
         */
        toString(): string {
            return `[${this.name}]`;
        }
    }

    /**
     * Base class for attribute-value
     */
    export class AttributeValue {
        public readonly resolver: AttributeResolver = new AttributeResolver(this);
        
        constructor (private value: string, 
            public attribute: Attribute, 
            public validators: Validators.AttributeValidator[] = []) {
            // do nothing
        }

        /**
         * Returns raw string
         */
        getRawValue(element: HTMLElement): string {
            return this.value || element?.attr(this.attribute.name);
        }
    
        /**
         * Find all element and construct
         * @param root the root
         */
        loadElement(element: HTMLElement): boolean {
            return true;
        }

        /**
         * Equivalent to calling element.attr('data'). However, we use dependencies om this method
         * @param element element
         * @param uniqueId all unique ids
         */
        getData<TAny>(element: HTMLElement): TAny {
            let attributes = this.resolver.allDependencies().map(id => this.resolver.resolve(id));

            let obj = { };
            attributes.forEach((att) => {
                let name = att.name;
                let datasetName = name?.startsWith('data-') && name.replace(/^data\-/, '').dashToCamelCase();
                obj[datasetName] = att.getValue(element)?.getRawValue(element)
            });

            return obj as TAny;
        }

        /**
         * To string
         */
        toString(): string {
            return `[${this.attribute.name}]='${this.value || ''}'`;
        }
    }

}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Validators /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Validators {

    export interface AttributeValidator {
        validate(value: AttributeValue, element: Element): boolean;
    }

    export class RequiredRawAttributeValidator implements AttributeValidator {

        constructor (private requiredRawAttributes: string[]) {
            // do nothing
        }
    
        validate(value: AttributeValue, element: HTMLElement): boolean {
            let isValidated = true;

            // check for other require attributes
            for (let i = 0; i < this.requiredRawAttributes.length; i++) {
                let requiredAttributeName = this.requiredRawAttributes[i];
                let requiredAttribute = element.attr(requiredAttributeName);
                if (!requiredAttribute) {
                    Attv.log('error', `${value} is requiring [${requiredAttributeName}] to be present in DOM`, element)
                }

                isValidated = isValidated && !!requiredAttribute;
            }

            return isValidated;
        }
    }

    export class RequiredAttributeValidator implements AttributeValidator {

        constructor (private requiredAttributeIds: string[]) {
            // do nothing
        }
    
        validate(value: AttributeValue, element: HTMLElement): boolean {
            let isValidated = true;

            let attributes = this.requiredAttributeIds.map(attId => Attv.getAttribute(attId));

            // check for other require attributes
            for (let i = 0; i < attributes.length; i++) {
                let attribute = attributes[i];
                let attributeValue = attribute.getValue(element);
                if (!attributeValue?.getRawValue(element)) {
                    Attv.log('error', `${value} is requiring ${attribute} to be present in DOM`, element)
                }

                isValidated = isValidated && !!attribute;
            }

            return isValidated;
        }
    }

    export class RequiredAttributeValidatorWithValue implements AttributeValidator {

        constructor (private requiredAttributes: { name: string, value: string}[]) {
            // do nothing
        }
    
        validate(value: AttributeValue, element: HTMLElement): boolean {
            let isValidated = true;

            // check for other require attributes
            for (let i = 0; i < this.requiredAttributes.length; i++) {
                let attribute = this.requiredAttributes[i];
                let requiredAttribute = element.attr(attribute.name);
                if (!requiredAttribute.equalsIgnoreCase(attribute.value)) {
                    Attv.log('error', `${value} is requiring [${attribute.name}]='${attribute.value}' to be present in DOM`, element)
                }

                isValidated = isValidated && !!requiredAttribute;
            }

            return isValidated;
        }
    }

    export class RequiredElementValidator implements AttributeValidator {

        constructor (private elementTagNames: string[]) {
            // do nothing
        }

        validate(value: AttributeValue, element: Element): boolean {
            let isValidated = true;

            // check for element that this attribute belongs to
            for (let i = 0; i < this.elementTagNames.length; i++) {
                let elementName = this.elementTagNames[i];
                isValidated = isValidated && element.tagName.equalsIgnoreCase(elementName);
            }

            if (!isValidated) {
                Attv.log('error', `${value} can only be attached to elements [${this.elementTagNames}]`, element)
            }

            return isValidated;
        }
    }
    
    export class RequiredAnyElementsValidator implements AttributeValidator {

        constructor (private elementTagNames: string[]) {
            // do nothing
        }

        validate(value: AttributeValue, element: Element): boolean {
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

        isLoggingEnabled: boolean;

        readonly defaultTag: string;

        readonly logLevels: string[];
    }

    export class DefaultConfiguration implements Configuration {

        isDebug: boolean = true;

        isLoggingEnabled: boolean = true;

        get defaultTag(): string  {
            return "default";
        }

        get logLevels(): string[] {
            return ['log', 'warning', 'error', 'debug'];
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Helper functions ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

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

    export function createHTMLElement(any: string | HTMLElement): HTMLElement {
        if (isString(any)) {
            let htmlElement = document.createElement('div');
            htmlElement.innerHTML = any as string;

            any = htmlElement;
        }

        return any as HTMLElement;
    }

    export function parseJsonOrElse(any: any) {
        try {
            any = JSON.parse(any);
        } catch {
            // nothing
        }

        return any;
    }

    export function log(...data: any[]) {
        if (!Attv.configuration.isLoggingEnabled) {
            return;
        }

        let level = data[0];
        if (Attv.configuration.logLevels?.indexOf(level) >= 0) {
            data = data.splice(1);
        }
        
        if (level === 'warning') {
            console.warn(...data);
        } else if (level === 'error') {
            console.error(...data);
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
        pre: (() => void)[],
        post: (() => void)[]
    } = {
        pre: [],
        post: []
    };

    let attributeFactory: AttributeFactory[] = [];


    export function loadElements(root?: HTMLElement): void {
        if (isUndefined(root)) {
            root = document.querySelector('body');
        }

        // auto load all attvs that are marked auto load
        attributes.filter(attribute => attribute.isAutoLoad).forEach((attribute, index) => {
            root.querySelectorAll(`${attribute}`).forEach((element: HTMLElement, index) => {
                try {
                    // #1. If it's already loaded return
                    if (attribute.isElementLoaded(element))
                        return;

                    let attributeValue = attribute.getValue(element);

                    // #2. Check if the attribute value is supported
                    if (!attributeValue) {
                        let attributeValue = element.attr(attribute.name);
                        Attv.log('warning', `${attribute} does not support ${attribute}='${attributeValue}'`, element);
                        return;
                    }

                    // #3. Validate
                    let isValidated = true;
                    for (var i = 0; i < attributeValue.validators.length; i++) {
                        let validator = attributeValue.validators[i];
                        isValidated = isValidated = validator.validate(attributeValue, element);
                    }

                    if (!isValidated) {
                        return;
                    }

                    // #4. Load the stuff!
                    let isLoaded = attributeValue.loadElement(element);
                    element.attr(attribute.loadedName, isLoaded);
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
    
    export function registerAttribute(attributeName: string, 
        fn: (attributeName: string) => Attribute,
        valuesFn?: (attribute: Attribute, list: AttributeValue[]) => void): void {
        let factory = new AttributeFactory(attributeName, fn, valuesFn);

        attributeFactory.push(factory);
    }
    
    export function unregisterAttribute(attributeName: string): void {
        let attributes = attributeFactory.filter(factory => factory.attributeName !== attributeName);
        attributeFactory.splice(0, attributeFactory.length);
        attributeFactory.push(...attributes);
    }

    // -- helper class 

    class AttributeFactory {
        constructor (public attributeName: string, 
            private fn: (attributeName: string) => Attribute,
            private valuesFn?: (attribute: Attribute, list: AttributeValue[]) => void) {
            // do nothing
        }

        create(): Attribute {
            let attribute = this.fn(this.attributeName);
            
            Attv.log('debug', `* ${attribute}`, attribute);

            if (this.valuesFn) {
                let attributeValues = [];

                this.valuesFn(attribute, attributeValues);

                Attv.log('debug', `** ${attribute} adding ${attributeValues}`, attributeValues);
    
                attribute.registerAttributeValues(attributeValues);
            }

            return attribute;
        }
    }

    function initialize() {
        if (!Attv.configuration) {
            Attv.configuration = new DefaultConfiguration();
        }

        Attv.log('debug', 'Initialize...');
        for (var i = 0; i < attributeFactory.length; i++) {
            let attribute = attributeFactory[i].create();

            attributes.push(attribute);
        }
    }

    Attv.loader.post.push(initialize);
    Attv.loader.post.push(loadElements);
}

Attv.onDocumentReady(() => {
    for (var i = 0; i < Attv.loader.pre.length; i++) {
        Attv.loader.pre[i]();
    }

    for (var i = 0; i < Attv.loader.post.length; i++) {
        Attv.loader.post[i]();
    }
});