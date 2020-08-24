
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
    attr: (name?: string | Attv.DataAttribute, value?: any) => HTMLElement | any;
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

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Base classes ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    export class Dependency {

        /**
         * List of DataAttribute Ids that we require
         */
        requires: string[] = [];

        /**
         * List of DataAttribute Id that we use
         */
        uses: string[] = [];
        
        constructor (private dataAttribute: DataAttribute) {
            // do nothing
        }

        /**
         * List of all dependencies
         */
        allDependencies(): string[] {
            return this.requires.concat(this.uses).concat(this.dataAttribute.id);
        }

        /**
         * Returns the data attribute
         * @param dataAttributeId id
         */
        getDataAttribute<TDataAttribute extends DataAttribute>(dataAttributeId: string) {
            let dependencyDataAttribute = Attv.getDataAttribute(dataAttributeId) as TDataAttribute;

            if (!this.allDependencies().some(dep => dep === dataAttributeId)) {
                Attv.log('warning', `${dependencyDataAttribute || dataAttributeId} should be declared as the dependant in ${this.dataAttribute}. This is for documentation purposes`);
            }

            return dependencyDataAttribute;
        }
    }
    
    /**
    * Base class for data-attributes
    */
    export class DataAttribute {

        public readonly dependencies: Dependency = new Dependency(this);
        public readonly attributeValues: DataAttributeValue[] = [];

        /**
         * 
         * @param id unique id
         * @param attributeName  the attribute name
         * @param description description
         * @param isAutoLoad is auto-load
         */
        constructor (
            public id: string,
            public attributeName: string, 
            public description: string,
            public isAutoLoad: boolean = true) {
            if (!attributeName.startsWith('data-')) {
                attributeName = 'data-' + attributeName;
            }
        }
        
        /**
         * Attribute when it's loaded
         */
        get attributeLoadedName(): string {
            return this.attributeName + "-loaded";
        }
        
        /**
         * Register attribute values
         * @param attributeValues attribute values
         */
        registerAttributeValues(attributeValues: DataAttributeValue[]) {
            this.attributeValues.push(...attributeValues);
        }

        /**
         * Returns the current attribute value
         * @param element the element
         */
        getDataAttributeValue<TDataAttributeValue extends DataAttributeValue>(element: HTMLElement): TDataAttributeValue {
            let value = element?.attr(this.attributeName);
            let attributeValue = this.attributeValues.filter(val => val.attributeValue === value)[0] as TDataAttributeValue;

            // #1. if attribute is undefined
            // find the one with the .isDefault == true
            if (!attributeValue) {
                attributeValue = this.attributeValues.filter(val => val.attributeValue === Attv.configuration.defaultTag)[0] as TDataAttributeValue;
            }

            if (!attributeValue) {
                let rawAttributeValue = element?.attr(this.attributeName) as string;
                attributeValue = new DataAttributeValue(rawAttributeValue, this) as TDataAttributeValue;
            }

            return attributeValue;
        }

        /**
         * Adds a dependency data attribute to the 'element'
         * @param element the element
         * @param value the value
         */
        addDependencyDataAttribute(uniqueId: string, element: HTMLElement, any: string) {
            let depedencyDataAttribute = this.dependencies.getDataAttribute(uniqueId);
            element.attr(depedencyDataAttribute.attributeName, any);
        }

        /**
         * Adds a dependency data attribute to the 'element'
         * @param element the element
         * @param value the value
         */
        getDependencyDataAttribute(uniqueId: string, element: HTMLElement): string {
            let dependencyDataAttribute = this.dependencies.getDataAttribute(uniqueId);
            return dependencyDataAttribute.getDataAttributeValue(element).attributeValue;
        }

        /**
         * Equivalent to calling element.attr('data'). However, we use dependencies om this method
         * @param element element
         * @param uniqueId all unique ids
         */
        getData<TAny>(element: HTMLElement): TAny {
            let dataAttributes = this.dependencies.allDependencies().map(id => this.dependencies.getDataAttribute(id));

            let obj = { };
            dataAttributes.forEach((att) => {
                let name = att.attributeName;
                let datasetName = name?.startsWith('data-') && name.replace(/^data\-/, '').dashToCamelCase();
                obj[datasetName] = att.getDataAttributeValue(element)?.attributeValue
            });

            return obj as TAny;
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
    export class DataAttributeValue {
        
        constructor (public attributeValue: string, 
            public dataAttribute: DataAttribute, 
            public validators: Validators.DataAttributeValueValidator[] = []) {
            // do nothing
        }
    
        /**
         * Find all element and construct
         * @param root the root
         */
        loadElement(element: HTMLElement): boolean {
            return true;
        }

        /**
         * To string
         */
        toString(): string {
            return `[${this.dataAttribute.attributeName}]='${this.attributeValue}'`;
        }
    }

}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Validators /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Validators {

    export interface DataAttributeValueValidator {
        validate(value: DataAttributeValue, element: Element): boolean;
    }

    export class RequiredRawAttributeValidator implements DataAttributeValueValidator {

        constructor (private requiredRawAttributes: string[]) {
            // do nothing
        }
    
        validate(value: DataAttributeValue, element: HTMLElement): boolean {
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

    export class RequiredAttributeValidator implements DataAttributeValueValidator {

        constructor (private requiredAttributeIds: string[]) {
            // do nothing
        }
    
        validate(value: DataAttributeValue, element: HTMLElement): boolean {
            let isValidated = true;

            let dataAttributes = this.requiredAttributeIds.map(attId => Attv.getDataAttribute(attId));

            // check for other require attributes
            for (let i = 0; i < dataAttributes.length; i++) {
                let dataAttribute = dataAttributes[i];
                let dataAttributeValue = dataAttribute.getDataAttributeValue(element);
                if (!dataAttributeValue?.attributeValue) {
                    Attv.log('error', `${value} is requiring ${dataAttribute} to be present in DOM`, element)
                }

                isValidated = isValidated && !!dataAttribute;
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
    
    export class RequiredAnyElementsValidator implements DataAttributeValueValidator {

        constructor (private elementTagNames: string[]) {
            // do nothing
        }

        validate(value: DataAttributeValue, element: Element): boolean {
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
    export const dataAttributes: DataAttribute[] = [];

    export const loader: {
        pre: (() => void)[],
        post: (() => void)[]
    } = {
        pre: [],
        post: []
    };

    let dataAttributeFactory: DataAttributeFactory[] = [];


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

                    let dataAttributeValue = dataAttribute.getDataAttributeValue(element);

                    // #2. Check if the attribute value is supported
                    if (!dataAttributeValue) {
                        let attributeValue = element.attr(dataAttribute.attributeName);
                        Attv.log('warning', `${dataAttribute} does not support ${dataAttribute}='${attributeValue}'`, element);
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

    export function getDataAttribute(id: string): DataAttribute {
        return dataAttributes.filter(att => att.id == id)[0];
    }
    
    export function registerDataAttribute(attributeName: string, 
        fn: (attributeName: string) => DataAttribute,
        valuesFn?: (dataAttribute: DataAttribute, list: DataAttributeValue[]) => void): void {
        let factory = new DataAttributeFactory(attributeName, fn, valuesFn);

        dataAttributeFactory.push(factory);
    }
    
    export function unregisterDataAttribute(attributeName: string): void {
        let attributes = dataAttributeFactory.filter(factory => factory.attributeName !== attributeName);
        dataAttributeFactory.splice(0, dataAttributeFactory.length);
        dataAttributeFactory.push(...attributes);
    }

    // -- helper class 

    class DataAttributeFactory {
        constructor (public attributeName: string, 
            private fn: (attributeName: string) => DataAttribute,
            private valuesFn?: (dataAttribute: DataAttribute, list: DataAttributeValue[]) => void) {
            // do nothing
        }

        create(): DataAttribute {
            let dataAttribute = this.fn(this.attributeName);
            
            Attv.log('debug', `* ${dataAttribute}`, dataAttribute);

            if (this.valuesFn) {
                let attributeValues = [];

                this.valuesFn(dataAttribute, attributeValues);

                Attv.log('debug', `** ${dataAttribute} adding ${attributeValues}`, attributeValues);
    
                dataAttribute.registerAttributeValues(attributeValues);
            }

            return dataAttribute;
        }
    }

    function initialize() {
        if (!Attv.configuration) {
            Attv.configuration = new DefaultConfiguration();
        }

        Attv.log('debug', 'Initialize...');
        for (var i = 0; i < dataAttributeFactory.length; i++) {
            let dataAttribute = dataAttributeFactory[i].create();

            dataAttributes.push(dataAttribute);
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