namespace Attv {


    export class DataTemplate extends Attv.Attribute {
        static readonly UniqueId = 'DataTemplate';

        constructor (public name: string) {
            super(DataTemplate.UniqueId, name, true);
        }

        renderTemplate(sourceElementOrSelector: HTMLElement | string, modelOrContent: any): string {
            let sourceElement = sourceElementOrSelector as HTMLElement;
            if (Attv.isString(sourceElementOrSelector)) {
                sourceElement = document.querySelector(sourceElementOrSelector as string) as HTMLElement;
            }

            let attributeValue = this.getValue<DataTemplate.DefaultAttributeValue>(sourceElement);
            return attributeValue.render(sourceElement, modelOrContent);
        }

    }

    // --- AttributeValues

    export namespace DataTemplate {
        
        /**
         * [data-template]='default'
         */
        export class DefaultAttributeValue extends Attv.AttributeValue {
            
            constructor (attributeValue: string, attribute: Attv.Attribute, validators: Validators.AttributeValidator[] = []) {
                super(attributeValue, attribute, validators);

                this.resolver.uses.push(DataRenderer.UniqueId, DataTemplateHtml.UniqueId);
            }

            loadElement(element: HTMLElement): boolean {
                let templateHtml = element.innerHTML;

                this.resolver.addAttribute(DataTemplateHtml.UniqueId, element, templateHtml);

                element.innerHTML = '';
                
                return true;
            }
            
            getTemplate(element: HTMLElement): HTMLElement {
                let html = this.resolver.resolve(DataTemplateHtml.UniqueId).getValue(element).getRawValue(element);

                return Attv.createHTMLElement(html);
            }

            render(element: HTMLElement, modelOrContent: string): string {
                let content = this.getTemplate(element)?.innerHTML || modelOrContent;
                let dataRenderer = this.resolver.resolve<DataRenderer>(DataRenderer.UniqueId);
    
                return dataRenderer.render(content, modelOrContent, element);
            }
        }

        /**
         * [data-template]='script'
         */
        export class ScriptAttributeValue extends DefaultAttributeValue {
            
            constructor (attribute: Attv.Attribute) {
                super('script', attribute, [ 
                    new Validators.RequiredElementValidator(['script']),
                    new Validators.RequiredAttributeValidatorWithValue([{ name: 'type', value: 'text/html'}])
                ])
            }

            loadElement(element: HTMLElement): boolean {
                // we don't need to do anything
                return true;
            }
            
            getTemplate(element: HTMLElement): HTMLElement {
                let html = element.innerHTML;
                return Attv.createHTMLElement(html);
            }
            
        }
    }


    export class DataTemplateHtml extends Attribute {
        static readonly UniqueId = 'DataTemplateHtml';

        constructor (public name: string) {
            super(DataTemplateHtml.UniqueId, name, false);
        }
    }

    export class DataTemplateSource extends Attribute {
        static readonly UniqueId = 'DataTemplateSource';

        constructor (public name: string) {
            super(DataTemplateSource.UniqueId, name, false);
        }

        renderTemplate(element: HTMLElement, model: any): string {
            let templateElement = this.getSourceElement(element);

            let dataTemplate = this.getValue(element).resolver.resolve<DataTemplate>(DataTemplate.UniqueId);
            return dataTemplate.renderTemplate(templateElement, model);
        }

        protected getSourceElement(element: HTMLElement): HTMLElement {
            let sourceElementSelector = this.getValue(element).getRawValue(element);

            return document.querySelector(sourceElementSelector) as HTMLElement;
        }
    }
}

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-template-html',  (attributeName: string) => new Attv.DataTemplateHtml(attributeName));
    Attv.registerAttribute('data-template-source', 
        (attributeName: string) => new Attv.DataTemplateSource(attributeName),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            let attributeValue = new Attv.AttributeValue(undefined, attribute);
            attributeValue.resolver.uses.push(Attv.DataTemplate.UniqueId);

            list.push(attributeValue);
        });
    Attv.registerAttribute('data-template', 
        (attributeName: string) => new Attv.DataTemplate(attributeName),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataTemplate.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
            list.push(new Attv.DataTemplate.ScriptAttributeValue(attribute));
        });
});