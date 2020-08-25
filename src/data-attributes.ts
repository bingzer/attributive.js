
namespace Attv {

    /**
     * [data-url]='*'
     */
    export class DataUrl extends Attv.Attribute {
        static readonly UniqueId = 'DataUrl';

        constructor (name: string) {
            super(DataUrl.UniqueId, name, false);
        }
    }

    export namespace DataUrl {

        export class DefaultAttributeValue extends AttributeValue {
            constructor (attribute: Attribute) {
                super(undefined, attribute);
            }

            getRawValue(element: HTMLElement): string {
                let rawValue = super.getRawValue(element);

                if (!rawValue && element?.tagName?.equalsIgnoreCase('form')) {
                    // get from action attribute
                    rawValue = element.attr('action');
                }

                return rawValue;
            }
        }
    }

    /**
     * [data-method]='*'
     */
    export class DataMethod extends Attv.Attribute {
        static readonly UniqueId = 'DataMethod';
        static readonly DefaultMethod = 'get';

        constructor (name: string) {
            super(DataMethod.UniqueId, name, false);
        }
    }
    export namespace DataMethod {
        export class DefaultAttributeValue extends AttributeValue {
            constructor (attribute: Attribute) {
                super(undefined, attribute)
            }

            getRawValue(element: HTMLElement): string {
                let rawValue = super.getRawValue(element);

                if (!rawValue && element?.tagName?.equalsIgnoreCase('form')) {
                    // get from method attribute
                    rawValue = element.attr('method') || DataMethod.DefaultMethod;
                }

                return rawValue;
            }
        }
    }

    /**
     * [data-callback]='*'
     */
    export class DataCallback extends Attv.Attribute {
        static readonly UniqueId = 'DataCallback';

        constructor (name: string) {
            super(DataCallback.UniqueId, name, false);
        }

        callback(element: HTMLElement): any {
            let jsFunction = this.getValue(element).getRawValue(element);
            return eval(jsFunction);
        }
    }

    /**
     * [data-loading]='*'
     */
    export class DataLoading extends Attv.Attribute {
        static readonly UniqueId = 'DataLoading';

        constructor (name: string) {
            super(DataLoading.UniqueId, name, false);
        }
    }

    /**
     * [data-nessage]='*'
     */
    export class DataMessage extends Attv.Attribute {
        static readonly UniqueId = 'DataMessage';

        constructor (name: string) {
            super(DataMessage.UniqueId, name, false);
        }

        getTargetElement(element: HTMLElement): HTMLElement {
            let selector = this.getValue(element).getRawValue(element);

            return document.querySelector(selector) as HTMLElement;
        }
    }

    /**
     * [data-target]='*'
     */
    export class DataTarget extends Attv.Attribute {
        static readonly UniqueId = 'DataTarget';

        constructor (name: string) {
            super(DataTarget.UniqueId, name, false);
        }

        getTargetElement(element: HTMLElement): HTMLElement {
            let selector = this.getValue(element).getRawValue(element);

            return document.querySelector(selector) as HTMLElement;
        }
    }

    /**
     * [data-timeout]='*'
     */
    export class DataTimeout extends Attv.Attribute {
        static readonly UniqueId = 'DataTimeout';

        constructor (name: string) {
            super(DataTimeout.UniqueId, name, false);
        }
    }

    /**
     * [data-timeout]='*'
     */
    export class DataData extends Attv.Attribute {
        static readonly UniqueId = 'DataData';

        constructor (name: string) {
            super(DataData.UniqueId, name, false);
        }
    }

    /**
     * [data-timeout]='*'
     */
    export class DataBind extends Attv.Attribute {
        static readonly UniqueId = 'DataBind';

        constructor (name: string) {
            super(DataBind.UniqueId, name, false);
        }

        bind(element: HTMLElement, any: any) {
            element.innerHTML = any?.toString() ?? '';
        }
    }

}

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-url', 
        (name: string) => new Attv.DataUrl(name),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataUrl.DefaultAttributeValue(attribute));
        });
    Attv.registerAttribute('data-method', 
        (name: string) => new Attv.DataMethod(name),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataMethod.DefaultAttributeValue(attribute));
        });
    Attv.registerAttribute('data-callback', (name: string) => new Attv.DataCallback(name));
    Attv.registerAttribute('data-loading', (name: string) => new Attv.DataLoading(name));
    Attv.registerAttribute('data-target',  (name: string) => new Attv.DataTarget(name));
    Attv.registerAttribute('data-message', (name: string) => new Attv.DataMessage(name));
    Attv.registerAttribute('data-timeout', (name: string) => new Attv.DataTimeout(name));
    Attv.registerAttribute('data-data', (name: string) => new Attv.DataData(name));
    Attv.registerAttribute('data-bind', (name: string) => new Attv.DataBind(name));
});

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// DataRenderer ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    /**
    * data-renderer
    */
    export class DataRenderer extends Attv.Attribute {
        static readonly UniqueId = 'DataRenderer';

        constructor (name: string) {
            super(DataRenderer.UniqueId, name, false);
        }

        render(content: string, model: any, element?: HTMLElement, attributeValue?: DataRenderer.DefaultAttributeValue): string {       
            if (!attributeValue) {
                attributeValue = this.getValue<DataRenderer.DefaultAttributeValue>(element);
            }

            return attributeValue.render(content, model);
        }
    }

    export namespace DataRenderer {

        /**
         * [data-renderer]='default'
         */
        export class DefaultAttributeValue extends Attv.AttributeValue  {
            
            constructor (attributeValue: string, attribute: Attv.Attribute) {
                super(attributeValue, attribute);
            }
    
            loadElement(element: HTMLElement): boolean {
                return true;
            }
            

            render(content: string, model: any, element?: HTMLElement): string {  
                return content;
            }
        }

        /**
         * [data-renderer]='json2html'
         */
        export class Json2HtmlAttributeValue extends DefaultAttributeValue {
    
            private dataBind: DataBind;
            
            constructor (attribute: Attv.Attribute) {
                super('json2html', attribute);

                this.resolver.requires.push(DataBind.UniqueId);
                this.dataBind = this.resolver.resolve<DataBind>(DataBind.UniqueId);
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
                        // bind
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
    Attv.registerAttribute('data-renderer', 
        (name: string) => new Attv.DataRenderer(name),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataRenderer.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
            list.push(new Attv.DataRenderer.Json2HtmlAttributeValue(attribute));
        });
});