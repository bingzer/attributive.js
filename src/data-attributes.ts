namespace Attv {

    /**
    * data-url
    */
    export class DataUrl extends DataAttribute {
        static readonly UniqueId = 'DataUrl';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataUrl.UniqueId, attributeName, DataUrl.Description, false);
        }

        /**
         * Returns the current attribute value
         * @param element the element
         */
        getDataAttributeValue<TDataAttributeValue extends DataAttributeValue>(element: HTMLElement): TDataAttributeValue {
            let attributeValue = super.getDataAttributeValue(element) as TDataAttributeValue;
            
            if (!attributeValue?.attributeValue && element?.tagName.equalsIgnoreCase('form')) {
                // get it from the 'action' attribute
                let actionAttributeValue = element.attr('action');
                attributeValue = new DataAttributeValue(actionAttributeValue, this) as TDataAttributeValue;
            }
            
            return attributeValue;
        }

    }

    /**
    * data-method
    */
    export class DataMethod extends DataAttribute {
        static readonly UniqueId = 'DataMethod';
        static readonly Description = '';
        static readonly DefaultMethod = 'get';

        constructor (public attributeName: string) {
            super(DataMethod.UniqueId, attributeName, DataMethod.Description, false);
        }

        /**
         * Returns the current attribute value
         * @param element the element
         */
        getDataAttributeValue<TDataAttributeValue extends DataAttributeValue>(element: HTMLElement): TDataAttributeValue {
            let attributeValue = super.getDataAttributeValue(element) as TDataAttributeValue;
            
            if (!attributeValue?.attributeValue && element?.tagName.equalsIgnoreCase('form')) {
                // get it from the 'method' attribute
                let actionAttributeValue = element.attr('method');
                attributeValue = new DataAttributeValue(actionAttributeValue, this) as TDataAttributeValue;
            }

            // otherwise
            if (!attributeValue?.attributeValue) {
                attributeValue = new DataAttributeValue(DataMethod.DefaultMethod, this) as TDataAttributeValue;
            }
            
            return attributeValue;
        }
    }

    /**
    * data-callback
    */
    export class DataCallback extends DataAttribute {
        static readonly UniqueId = 'DataCallback';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataCallback.UniqueId, attributeName, DataCallback.Description, false);
        }

        callback(element: HTMLElement): any {
            let jsFunction = this.getDataAttributeValue(element).attributeValue;
            return eval(jsFunction);
        }

    }

    /**
    * data-loading
    */
    export class DataLoading extends DataAttribute {
        static readonly UniqueId = 'DataLoading';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataLoading.UniqueId, attributeName, DataLoading.Description, false);
        }

    }

    /**
    * data-message
    */
    export class DataMessage extends DataAttribute {
        static readonly UniqueId = 'DataMessage';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataMessage.UniqueId, attributeName, DataMessage.Description, false);
        }

    }

    /**
    * data-bind
    */
    export class DataBind extends DataAttribute {
        static readonly UniqueId = 'DataBind';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataBind.UniqueId, attributeName, DataBind.Description, false);
        }

        bind(element: HTMLElement, any: any) {
            element.innerHTML = any?.toString() ?? '';
        }
    }

    /**
    * data-target
    */
    export class DataTarget extends DataAttribute {
        static readonly UniqueId = 'DataTarget';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataTarget.UniqueId, attributeName, DataTarget.Description, false);
        }

        getTargetElement(element: HTMLElement): HTMLElement {
            let targetElementSelector = this.getDataAttributeValue(element).attributeValue;

            return document.querySelector(targetElementSelector) as HTMLElement;
        }
    }

    /**
    * data-timeout
    */
    export class DataTimeout extends DataAttribute {
        static readonly UniqueId = 'DataTimeout';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataTimeout.UniqueId, attributeName, DataTimeout.Description, false);
        }
    }

    /**
    * data-data
    */
    export class DataData extends DataAttribute {
        static readonly UniqueId = 'DataData';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataData.UniqueId, attributeName, DataData.Description, false);
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

            this.dependencies.uses.push(DataBind.UniqueId);
        }

        render(content: string, model: any, element?: HTMLElement, dataRendererValue?: DataRenderer.DefaultAttributeValue): string {       
            if (!dataRendererValue) {
                dataRendererValue = this.getDataAttributeValue<DataRenderer.DefaultAttributeValue>(element);
            }

            return dataRendererValue.render(content, model);
        }
    }

    export namespace DataRenderer {

        /**
         * [data-renderer]='default'
         */
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

        /**
         * [data-renderer]='json2html'
         */
        export class Json2HtmlAttributeValue extends DefaultAttributeValue {
    
            private dataBind: DataBind;
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('json2html', dataAttribute);
    
                this.dataBind = this.dataAttribute.dependencies.getDataAttribute<DataBind>(DataBind.UniqueId);
            }
    
            loadElement(element: HTMLElement): boolean {
                return true;
            }
            
            render(templatedContent: string, model?: any): string {
                model = Attv.parseJsonOrElse(model);

                let templateElement = Attv.createHTMLElement(templatedContent);
                let rootElement = Attv.createHTMLElement('');
    
                this.bind(rootElement, templateElement, model);
    
                return rootElement.innerHTML;
            }
    
            protected bind(parent: HTMLElement, template: HTMLElement, model: any) {
                let allbinds = template.querySelectorAll(this.dataBind.toString());
                for (let i = 0; i < allbinds.length; i++) {
                    let bindElement = allbinds[i] as HTMLElement;
                    
                    let propName = bindElement.attr(this.dataBind);
                    let propValue = this.getPropertyValue(propName, model);

                    if (Array.isArray(propValue)) {
                        let array = propValue as [];
                        let parentOfBindElement = bindElement.parentElement;

                        bindElement.remove();

                        for (let j = 0; j < array.length; j++) {
                            let clonedBindElement = bindElement.cloneNode(true) as HTMLElement;
                            this.bind(parentOfBindElement, clonedBindElement, array[j]);
                        }
                    }
                    else {
                        this.dataBind.bind(bindElement, propValue);
                        
                        parent.append(template);
                    }
                }
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
                        try
                        {
                            propertyValue = propertyValue[propertyChilds[j]];
                        }
                        catch (e) {
                            // ignore
                        }
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
            list.push(new Attv.DataRenderer.DefaultAttributeValue(Attv.configuration.defaultTag, dataAttribute));
            list.push(new Attv.DataRenderer.Json2HtmlAttributeValue(dataAttribute));
        });
});