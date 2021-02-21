
namespace Attv {
    /**
     * [data-template] is used to stored an HTML template
     */
    export class DataTemplate extends Attv.Attribute {
        static readonly Key: string = 'data-template';

        constructor() {
            super(Attv.DataTemplate.Key);

            this.wildcard = "none"; 
            this.isAutoLoad = true;
            this.deps.internals = [ Attv.DataModel.Key ];
            this.priority = 2;
        }

        /**
         * Render element
         * @param elementOrSelector element or a selector
         * @param model the model
         */
        render(elementOrSelector: HTMLElement | string, model: any): HTMLElement {
            let sourceElement = Attv.select(elementOrSelector);

            let attributeValue: DataTemplate.Default = this.getValue<DataTemplate.Default>(sourceElement);

            return attributeValue.render(sourceElement, model);
        }
    }

    export namespace DataTemplate {

        export function renderTemplate(elementOrSelector: HTMLElement | string, model: any): HTMLElement {
            let dataTemplate = Attv.getAttribute<Attv.DataTemplate>(Attv.DataTemplate.Key);
            return dataTemplate.render(elementOrSelector, model);
        }

        export class Default extends Attv.AttributeValue {
        
            constructor (attributeValue?: string) {
                super(attributeValue);
    
                this.deps.internals = [Attv.DataContent.Key];
            }
    
            load(element: HTMLElement, options: LoadElementOptions): boolean {
                let templateHtml = element.attvHtml();
                let dataContent = this.attribute.resolve(Attv.DataContent.Key);

                element.attvAttr(dataContent, templateHtml);
                element.attvHtml('');
                
                return true;
            }

            getTemplate(element: HTMLElement): string {
                let dataContent = this.attribute.resolve(Attv.DataContent.Key);
                let html = dataContent.raw(element);

                if (!html)
                    Attv.log('fatal', 'No [data-content]');

                return html;
            }
            
            getTemplateElement(element: HTMLElement): HTMLElement {
                let html = this.getTemplate(element);

                let dom = Attv.Dom.parseDom(html);
                return dom as HTMLElement;
            }
    
            render(element: HTMLElement, model?: any): HTMLElement {
                let template = this.getTemplateElement(element).cloneNode(true) as HTMLElement;
                
                Attv.loadElements(template, {
                    includeSelf: true,
                    context: model
                });

                template.attvAttr('data-template-container', 'container');

                return template;
            }
        }
        /**
         * [data-template]='script'
         */
        export class Script extends Default {
            
            constructor () {
                super('script')
                this.validators = [
                    { name: Attv.Validators.NeedElements, options: ['script'] },
                    { name: Attv.Validators.NeedAttrWithValue, options: [ { name: 'type', value: 'text/html'} ]}
                ];
            }
    
            load(element: HTMLElement, options: LoadElementOptions): boolean {
                return true;
            }
            
            getTemplate(element: HTMLElement): string {
                return element.attvHtml();
            }
        }
    }
}

Attv.register(() => new Attv.DataTemplate(), att => {
    att.map(() => new Attv.DataTemplate.Default());
    att.map(() => new Attv.DataTemplate.Script());

    // register filters
    Attv.Expressions.filters.template = (selector: string) => {
        return (model: any) => {
            let element = Attv.select(selector);
            let template = Attv.DataTemplate.renderTemplate(element, model);
            
            return template;
        }
    }
});