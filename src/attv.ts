


////////////////////////////////// PROTOTYPES //////////////////////////////////////

interface HTMLElement  {
    /**
     * Attribute helper.
     * value can be an object
     */
    attr: (name?: string, value?: any) => HTMLElement | any;
}

HTMLElement.prototype.attr = function (name: string, value?: any): HTMLElement | any {
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
            value = element.getAttribute(name);
        }

        return Attv.parseJsonOrElse(value);
    }
}

interface String {
    startsWith: (text: string) => boolean;
    equalsIgnoreCase: (other: string) => boolean;
    camelCaseToDash: () => string;
    dashToCamelCase: () => string;
}

String.prototype.startsWith = function (text: string): boolean {
    let obj: String = this as String;

    return obj.indexOf(text) >= 0;
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

////////////////////////////////// Attv.DataAttv //////////////////////////////////////

namespace Attv {
    
    /**
    * Base class for data-attributes
    */
    export abstract class DataAttribute {
        
        get attributeLoadedName(): string {
            return this.attributeName + "-loaded";
        }
    
        /**
         * 
         * @param attributeName suffix name
         */
        constructor (public attributeName: string, public isAutoLoad: boolean = true) {
            if (!attributeName.startsWith('data-'))
                attributeName = 'data-' + attributeName;
        }

        /**
         * Checks to see if element is loaded
         * @param element element to check
         */
        isElementLoaded(element: HTMLElement): boolean {
            let isLoaded = element.attr(this.attributeLoadedName);
            return isLoaded === 'true';
        }

        toString(): string {
            return `[${this.attributeName}]`;
        }
    }

    /**
     * Base class for DataAttribute-value
     */
    export abstract class DataAttributeValue {
        
        constructor (public attributeValue: string, 
            public dataAttribute: DataAttribute, 
            public validators: Validators.DataAttributeValueValidator[] = []) {
            // do nothing
        }
    
        /**
         * Find all element and construct
         * @param root the root
         */
        abstract loadElement(element: HTMLElement): boolean;

        toString(): string {
            return `[${this.dataAttribute.attributeName}]='${this.attributeValue}'`;
        }
    }

    ////////////////////////////////// Validators //////////////////////////////////////

    export namespace Validators {

        export interface DataAttributeValueValidator {
            validate(value: DataAttributeValue, element: Element): boolean;
        }

        export class RequiredAttributeValidator implements DataAttributeValueValidator {

            constructor (private requiredAttributes: string[]) {
                // do nothing
            }
        
            validate(value: DataAttributeValue, element: HTMLElement): boolean {
                let isValidated = true;

                // check for other require attributes
                for (let i = 0; i < this.requiredAttributes.length; i++) {
                    let requiredAttributeName = this.requiredAttributes[i];
                    let requiredAttribute = element.attr(requiredAttributeName);
                    if (!requiredAttribute) {
                        Attv.log('error', `${value} is requiring [${requiredAttributeName}] to be present in DOM`, element)
                    }

                    isValidated = isValidated && !!requiredAttribute;
                }

                return isValidated;
            }
        }

        export class RequiredAttributeValidatorWithValue implements DataAttributeValueValidator {

            constructor (private requiredAttributes: { name: string, value: string}[]) {
                // do nothing
            }
        
            validate(value: DataAttributeValue, element: HTMLElement): boolean {
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

        export class RequiredElementValidator implements DataAttributeValueValidator {

            constructor (private elementTagNames: string[]) {
                // do nothing
            }

            validate(value: DataAttributeValue, element: Element): boolean {
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

    }

}

////////////////////////////////// Config //////////////////////////////////////

namespace Attv {

    export class Configuration {

        isDebug: boolean = true;

        isLoggingEnabled: boolean = true;

        attributeValueMissingLogLevel: 'warning'|'ignore' = 'warning';

        get logLevels(): string[] {
            return ['log', 'warning', 'error'];
        }
    }
}

////////////////////////////////// Functions //////////////////////////////////////

namespace Attv {

    export const dataAttributes: DataAttribute[] = [];
    export const dataAttributeValues: DataAttributeValue[] = [];
    export const configuration: Configuration = new Configuration();

    export const loader: {
        pre: (() => void)[],
        post: (() => void)[]
    } = {
        pre: [],
        post: []
    };

    let dataAttributeFactory: DataAttributeFactory[] = [];
    let dataAttributeValueFactory: DataAttributeValueFactory[] = [];

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
        if (configuration.logLevels.indexOf(level) >= 0) {
            data = data.splice(1);
        }
        
        if (level === 'warning') {
            console.warn(...data);
        } else if (level === 'error') {
            console.error(...data);
        } else {
            console.log(...data);
        }
    }

    export function loadElements(root?: HTMLElement): void {
        if (isUndefined(root)) {
            root = document.querySelector('body');
        }

        // auto load all attvs that are marked auto load
        dataAttributes.filter(dataAttribute => dataAttribute.isAutoLoad).forEach((dataAttribute, index) => {
            root.querySelectorAll(`[${dataAttribute.attributeName}]`).forEach((element: HTMLElement, index) => {
                try {
                    // #1. If it's already loaded return
                    if (dataAttribute.isElementLoaded(element))
                        return;

                    let attributeValue = element.attr(dataAttribute.attributeName);
                    let dataAttributeValue = Attv.getDataAttributeValue(attributeValue, dataAttribute);

                    // #2. Check if the attribute value is supported
                    if (!dataAttributeValue) {
                        Attv.log(Attv.configuration.attributeValueMissingLogLevel, `${dataAttribute} does not support ${dataAttribute}='${attributeValue}'`, element);
                        return;
                    }

                    // #3. Validate
                    let isValidated = true;
                    for (var i = 0; i < dataAttributeValue.validators.length; i++) {
                        let validator = dataAttributeValue.validators[i];
                        isValidated = isValidated = validator.validate(dataAttributeValue, element);
                    }

                    if (!isValidated) {
                        return;
                    }

                    // #4. Load the stuff!
                    let isLoaded = dataAttributeValue.loadElement(element);
                    element.attr(dataAttribute.attributeLoadedName, isLoaded);
                }
                catch (error) {
                    Attv.log('error', `Unexpected error occurred when loading ${dataAttribute}`, error, element);
                }
            });
        });
    }
    
    export function registerDataAttribute(attributeName: string, fn: (attributeName: string) => DataAttribute, replace: boolean = false): void {
        let factory = new DataAttributeFactory(attributeName, fn);

        dataAttributeFactory.push(factory);
    }
    
    export function unregisterDataAttribute(attributeName: string): void {
        let attributes = dataAttributeFactory.filter(factory => factory.attributeName !== attributeName);
        dataAttributeFactory.splice(0, dataAttributeFactory.length);
        dataAttributeFactory.push(...attributes);

        let values = dataAttributeValueFactory.filter(factory=> factory.attributeName !== attributeName);
        dataAttributeValueFactory.splice(0, dataAttributeValueFactory.length);
        dataAttributeValueFactory.push(...values);
    }
    
    export function registerAttributeValue(attributeName: string, fn: (dataAttribute: DataAttribute) => DataAttributeValue): void {
        let factory = new DataAttributeValueFactory(attributeName, fn);

        dataAttributeValueFactory.push(factory);
    }

    export function getDataAttribute(attributeName: string): DataAttribute {
        return dataAttributes.filter(att => att.attributeName == attributeName)[0];
    }

    export function getDataAttributeValue(attributeValue: string, dataAttribute: DataAttribute): DataAttributeValue {
        return dataAttributeValues.filter(val => val.dataAttribute === dataAttribute && val.attributeValue === attributeValue)[0];
    }

    export function onDocumentReady(fn: () => void): void {
        // without jQuery (doesn't work in older IEs)
        document.addEventListener('DOMContentLoaded', fn, false);
    }


    // -- helper class 

    class DataAttributeFactory {
        constructor (public attributeName: string, private fn: (attributeName: string) => DataAttribute) {
            // do nothing
        }

        create(): DataAttribute {
            return this.fn(this.attributeName);
        }
    }

    class DataAttributeValueFactory {
        constructor (public attributeName: string, private fn: (dataAttribute: DataAttribute) => DataAttributeValue) {
            // do nothing
        }

        create(): DataAttributeValue {
            let attribute = Attv.getDataAttribute(this.attributeName);
            return this.fn(attribute);
        }
    }

    function initialize() {
        Attv.log('* DataAttributes');
        for (var i = 0; i < dataAttributeFactory.length; i++) {
            let dataAttribute = dataAttributeFactory[i].create();

            Attv.log(`Instantiating ${dataAttribute}`, dataAttribute);
            dataAttributes.push(dataAttribute);
        }
        
        Attv.log('* DataAttributeValues');
        for (var i = 0; i < dataAttributeValueFactory.length; i++) {
            let dataAttributeValue = dataAttributeValueFactory[i].create();

            Attv.log(`Registering attributeValue: ${dataAttributeValue}`, dataAttributeValue);
            dataAttributeValues.push(dataAttributeValue);
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