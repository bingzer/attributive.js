
namespace Attv {
    export class DataTemplate extends Attv.Attribute {
        static readonly Key: string = 'data-template';

        constructor() {
            super(Attv.DataTemplate.Key);

            this.wildcard = "none";
            this.isAutoLoad = false;
            this.dependency.uses = [ Attv.DataRenderer.Key ];
            this.dependency.internals = [ Attv.DataTemplateHtml.Key ];
        }

        renderTemplate(elementOrSelector: HTMLElement | string, modelOrContent: any): string {
            let sourceElement = elementOrSelector as HTMLElement;
            if (Attv.isString(elementOrSelector)) {
                sourceElement = document.querySelector(elementOrSelector as string) as HTMLElement;
            }

            // find the 'default'
            // getValue() doesn't like when sourceElement is null
            let attributeValue = this.values.filter(val => val.value === Attv.configuration.defaultTag)[0] as DataTemplate.Default;
            if (sourceElement) {
                attributeValue = this.getValue<DataTemplate.Default>(sourceElement);
            }

            return attributeValue.render(sourceElement, modelOrContent);
        }
    }

    export namespace DataTemplate {
        export class Default extends Attv.AttributeValue {
        
            constructor (attributeValue?: string) {
                super(attributeValue);
    
                this.dependencies.uses = [Attv.DataRenderer.Key];
                this.dependencies.internals = [Attv.DataTemplateHtml.Key];
            }
    
            loadElement(element: HTMLElement): boolean {
                let templateHtml = element.attvHtml();
    
                Attv.addAttribute(DataTemplateHtml.Key, element, templateHtml);
    
                element.attvHtml('');
                
                return true;
            }
            
            getTemplate(element: HTMLElement): string {
                let html = this.attribute.resolve(DataTemplateHtml.Key).raw(element);
    
                return html;
            }
    
            render(element: HTMLElement, modelOrContent: string): string {
                let content = this.getTemplate(element) || modelOrContent;
                let dataRenderer = this.attribute.resolve<DataRenderer>(DataRenderer.Key);
    
                return dataRenderer.render(content, modelOrContent, element);
            }
        }
        /**
         * [data-template]='script'
         */
        export class Script extends Default {
            
            constructor () {
                super('script')
                this.validators = [
                    { name: Attv.Validators.RequiringElements, options: ['script'] },
                    { name: Attv.Validators.RequiringAttributeWithValue, options: [ { name: 'type', value: 'text/html'} ]}
                ];
            }
    
            loadElement(element: HTMLElement): boolean {
                // we don't need to do anything
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
});