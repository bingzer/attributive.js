
namespace Attv {
    export class DataRenderer extends Attv.Attribute {
        static readonly Key: string = 'data-renderer';

        constructor() {
            super(Attv.DataRenderer.Key);

            this.wildcard = "none";
            this.isAutoLoad = false; 
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
    
                Attv.DataBind.bindElement(rootElement, templateElement, model);
    
                return rootElement.attvHtml();
            }
        
        }
    }
}

Attv.register(() => new Attv.DataRenderer(), att => {
    att.map(() => new Attv.DataRenderer.Default());
    att.map(() => new Attv.DataRenderer.Json2HtmlValue());
});