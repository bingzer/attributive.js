
namespace Attv {
    export class DataRenderer extends Attv.Attribute {
        static readonly Key: string = 'data-renderer';

        constructor() {
            super(Attv.DataRenderer.Key);

            //this.wildcard = "none";
        }
        

        render(content: string, model: any, element?: HTMLElement, attributeValue?: DataRenderer.Default): string {       
            if (!attributeValue) {
                attributeValue = this.getValue<DataRenderer.Default>(element);
            }

            return attributeValue.render(content, model);
        }
    } 

    export namespace DataRenderer {
        export class Default extends Attv.AttributeValue {

            constructor (value?: string) {
                super(value);
            }
    
            loadElement(element: HTMLElement): boolean {
                return true;
            }
            

            render(content: string, model: any, element?: HTMLElement): string {  
                return content;
            }
        }
        
        export class Json2HtmlValue extends Default {
            
            constructor () {
                super('json2html');

                this.dependencies.requires = [ Attv.DataBind.Key ];
            }
            
            render(templatedContent: string, model?: any): string {
                model = Attv.parseJsonOrElse<any>(model);

                let templateElement = Attv.createHTMLElement(templatedContent);
                let rootElement = Attv.createHTMLElement('');
    
                this.bind(rootElement, templateElement, model);
    
                return rootElement.attvHtml();
            }

            protected bind(parent: HTMLElement, template: HTMLElement, model: any) {
                let dataBind = this.attribute.resolve<DataBind>(Attv.DataBind.Key);
                let allbinds = template.querySelectorAll(dataBind.toString());

                for (let i = 0; i < allbinds.length; i++) {
                    let bindElement = allbinds[i] as HTMLElement;
                    
                    let propName = bindElement.attvAttr(dataBind);
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
                        dataBind.bind(bindElement, propValue);
                        
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

Attv.register(() => new Attv.DataRenderer(), att => {
    att.map(() => new Attv.DataRenderer.Default());
    att.map(() => new Attv.DataRenderer.Json2HtmlValue());
});