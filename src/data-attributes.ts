namespace Attv {
    
    /**
    * Base class for data-attribute-values
    */
    export class RawDataAttributeValue extends DataAttributeValue {
        constructor (attributeValue: string, dataAttribute: DataAttribute) {
            super(attributeValue, dataAttribute);
        }
        
        loadElement(element: HTMLElement): boolean {
            return true;
        }
    }

    /**
    * Base class for raw-data-attributes
    */
    export class RawDataAttribute extends DataAttribute {

        /**
         * Returns the current attribute value
         * @param element the element
         */
        getDataAttributeValue<TDataAttributeValue extends DataAttributeValue>(element?: HTMLElement): TDataAttributeValue {
            let rawAttributeValue = element.attr(this.attributeName) as string;
            let attributeValue = new RawDataAttributeValue(rawAttributeValue, this) as TDataAttributeValue;

            return attributeValue;
        }
    }

    /**
    * data-url
    */
    export class DataUrl extends RawDataAttribute {
        static readonly UniqueId = 'DataUrl';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataUrl.UniqueId, attributeName, DataUrl.Description, false);
        }

    }

    /**
    * data-method
    */
    export class DataMethod extends RawDataAttribute {
        static readonly UniqueId = 'DataMethod';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataMethod.UniqueId, attributeName, DataMethod.Description, false);
        }

    }

    /**
    * data-callback
    */
    export class DataCallback extends RawDataAttribute {
        static readonly UniqueId = 'DataCallback';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataCallback.UniqueId, attributeName, DataCallback.Description, false);
        }

    }

    /**
    * data-loading
    */
    export class DataLoading extends RawDataAttribute {
        static readonly UniqueId = 'DataLoading';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataLoading.UniqueId, attributeName, DataLoading.Description, false);
        }

    }

    /**
    * data-message
    */
    export class DataMessage extends RawDataAttribute {
        static readonly UniqueId = 'DataMessage';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataMessage.UniqueId, attributeName, DataMessage.Description, false);
        }

    }

    /**
    * data-bind
    */
    export class DataBind extends RawDataAttribute {
        static readonly UniqueId = 'DataBind';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataBind.UniqueId, attributeName, DataBind.Description, false);
        }
    }

    /**
    * data-target
    */
    export class DataTarget extends RawDataAttribute {
        static readonly UniqueId = 'DataTarget';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataTarget.UniqueId, attributeName, DataTarget.Description, false);
        }
    }

    /**
    * data-timeout
    */
    export class DataTimeout extends RawDataAttribute {
        static readonly UniqueId = 'DataTimeout';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataTimeout.UniqueId, attributeName, DataTimeout.Description, false);
        }
    }

    /**
    * data-data
    */
    export class DataData extends RawDataAttribute {
        static readonly UniqueId = 'DataData';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataData.UniqueId, attributeName, DataData.Description, false);
        }
    }

    /**
    * data-bind-foreach
    */
    export class DataBindForEach extends RawDataAttribute {
        static readonly UniqueId = 'DataBindForEach';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataBindForEach.UniqueId, attributeName, DataBindForEach.Description, false);
        }
    }

}

Attv.loader.pre.push(() => {
    Attv.registerDataAttribute('data-url', (attributeName: string) => new Attv.DataUrl(attributeName));
    Attv.registerDataAttribute('data-method', (attributeName: string) => new Attv.DataMethod(attributeName));
    Attv.registerDataAttribute('data-callback', (attributeName: string) => new Attv.DataCallback(attributeName));
    Attv.registerDataAttribute('data-loading', (attributeName: string) => new Attv.DataLoading(attributeName));
    Attv.registerDataAttribute('data-target', (attributeName: string) => new Attv.DataTarget(attributeName));
    Attv.registerDataAttribute('data-message', (attributeName: string) => new Attv.DataMethod(attributeName));
    Attv.registerDataAttribute('data-data', (attributeName: string) => new Attv.DataData(attributeName));
    Attv.registerDataAttribute('data-timeout', (attributeName: string) => new Attv.DataTimeout(attributeName));
    Attv.registerDataAttribute('data-bind', (attributeName: string) => new Attv.DataBind(attributeName));
    Attv.registerDataAttribute('data-bind-foreach', (attributeName: string) => new Attv.DataBindForEach(attributeName));
});

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// DataRenderer ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    /**
    * data-renderer
    */
    export class DataRenderer extends Attv.DataAttribute {
        static readonly UniqueId = 'DataRenderer';
        static readonly Description = 'For rendering stuffs';

        constructor (public attributeName: string) {
            super(DataRenderer.UniqueId, attributeName, DataRenderer.Description, false);

            this.dependencies.uses.push(DataBindForEach.UniqueId, DataBind.UniqueId);
        }

        getDefaultAttributeValue(): DataRenderer.DefaultAttributeValue {
            return this.attributeValues.filter(att => att.attributeValue === 'default')[0] as DataRenderer.DefaultAttributeValue;
        }

        render(content: string, model: any, element?: HTMLElement): string {       
            let dataRendererValue: DataRenderer.DefaultAttributeValue;
            if (element) {
                dataRendererValue = this.getDataAttributeValue<DataRenderer.DefaultAttributeValue>(element);
            }

            if (!dataRendererValue) {
                dataRendererValue = this.getDefaultAttributeValue();
            }

            return dataRendererValue.render(content, model);
        }
    }

    export namespace DataRenderer {
        export class DefaultAttributeValue extends Attv.DataAttributeValue  {
            
            constructor (attributeValue: string, dataAttribute: Attv.DataAttribute) {
                super(attributeValue, dataAttribute)
            }
    
            loadElement(element: HTMLElement): boolean {
                return true;
            }
    
            render(templatedContent: string, model?: any): string {
                return templatedContent;
            }
        }
        
        export class SimpleAttributeValue extends DefaultAttributeValue {
    
            private dataBind: DataBind;
            private dataBindForEach: DataBindForEach;
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('simple', dataAttribute);
    
                this.dataBind = this.dataAttribute.dependencies.getDataAttribute<DataBind>(DataBind.UniqueId);
                this.dataBindForEach = this.dataAttribute.dependencies.getDataAttribute<DataBindForEach>(DataBindForEach.UniqueId);
            }
    
            loadElement(element: HTMLElement): boolean {
                return true;
            }
            
            render(templatedContent: string, model?: any): string {
                let templateElement = Attv.createHTMLElement(templatedContent);
                let rootElement = Attv.createHTMLElement('');
    
                this.bind(rootElement, templateElement, model);
    
                return rootElement.innerHTML;
            }
    
            protected bind(element: HTMLElement, template: HTMLElement, model: any) {
                // -- Array
                if (model instanceof Array) {
                    element.innerHTML = '';
    
                    let array = model as [];
    
                    for (let i = 0; i < array.length; i++) {
                        let foreachElement = this.findByAttribute(template, this.dataBindForEach.attributeName, true)[0];
    
                        if (!foreachElement)
                            return;
                            
                        let forEachBind = foreachElement.cloneNode(true) as HTMLElement;
    
                        this.bind(element, forEachBind, array[i]);
                    }
                }
                // -- Object
                else {
                    let bindElements = this.findByAttribute(template, this.dataBind.attributeName);
                    for (let i = 0; i < bindElements.length; i++) {
                        let bindElement = bindElements[i];
    
                        // if the direct parent is the 'template'
                        if (bindElement.closest(`[${this.dataBindForEach.attributeName}]`) === template) {
                            // bind the value
                            let propName = bindElement.attr(this.dataBind.attributeName);
                            let propValue = this.getPropertyValue(propName, model);
    
                            bindElement.innerHTML = propValue; // TODO: sanitize
                        } else {
                            // another loop
                            let foreachChild = bindElement.closest(`[${this.dataBindForEach.attributeName}]`) as HTMLElement;
                            let foreachChildName = foreachChild.attr(this.dataBindForEach.attributeName);
                            let foreachChildValue = this.getPropertyValue(foreachChildName, model);
    
                            let foreachChildTemplate = foreachChild.cloneNode(true) as HTMLElement;
    
                            this.bind(element, foreachChildTemplate, foreachChildValue);
                        }
                    }
    
                    element.append(template);
                }
            }
    
            private findByAttribute(element: HTMLElement, attributeName: string, includeSelf: boolean = false): HTMLElement[] {
                let elements = element.querySelectorAll(`[${attributeName}]`) as any
                if (includeSelf && element.attr(attributeName)) {
                    elements.push(element);
                }
    
                return elements;
            }
    
            private getPropertyValue(propertyName: string, any: any) {
                let propertyValue = any;
    
                if (Attv.isUndefined(any))
                    return undefined;
    
                if (propertyName === '$' || propertyName === '$root') {
                    propertyValue = any;
                }
                else if (propertyName === '$json') {
                    propertyValue = JSON.stringify(propertyValue);
                    return propertyValue;
                }
                else {
                    let propertyChilds = propertyName.split('.');
                    for (var j = 0; j < propertyChilds.length; j++) {
                        propertyValue = propertyValue[propertyChilds[j]];
                    }
                }
    
                return parseJsonOrElse(propertyValue);
            }
        }
    }
   
}

Attv.loader.pre.push(() => {
    Attv.registerDataAttribute('data-renderer', 
        (attributeName: string) => new Attv.DataRenderer(attributeName),
        (dataAttribute: Attv.DataAttribute, list: Attv.DataAttributeValue[]) => {
            list.push(new Attv.DataRenderer.DefaultAttributeValue('default', dataAttribute));
            list.push(new Attv.DataRenderer.SimpleAttributeValue(dataAttribute));
        });
});