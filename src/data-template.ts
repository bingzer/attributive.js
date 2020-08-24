namespace Attv {


    export class DataTemplate extends Attv.DataAttribute {
        static readonly UniqueId = 'DataTemplate';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataTemplate.UniqueId, attributeName, DataTemplate.Description, true);

            this.dependencies.requires.push(DataRenderer.UniqueId, DataTemplateHtml.UniqueId);
        }

        renderTemplate(sourceElementOrSelectorOrContent: HTMLElement | string, model: any): string {
            let sourceElement = sourceElementOrSelectorOrContent as HTMLElement;
            if (Attv.isString(sourceElementOrSelectorOrContent)) {
                sourceElement = document.querySelector(sourceElementOrSelectorOrContent as string) as HTMLElement;
            }

            let attributeValue = this.getDataAttributeValue<DataTemplate.DefaultAttributeValue>(sourceElement);
            let content = attributeValue.getTemplate(sourceElement).innerHTML;
            let dataRenderer = this.dependencies.getDataAttribute<DataRenderer>(DataRenderer.UniqueId);

            return dataRenderer.render(content, model, sourceElement);
        }

        renderContent(content: string, model: any): string {            
            let dataRenderer = this.dependencies.getDataAttribute<DataRenderer>(DataRenderer.UniqueId);

            return dataRenderer.render(content, model);
        }

    }

    // --- AttributeValues

    export namespace DataTemplate {
        
        /**
         * [data-template]='default'
         */
        export class DefaultAttributeValue extends Attv.DataAttributeValue {
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('default', dataAttribute)
            }

            loadElement(element: HTMLElement): boolean {
                let templateHtml = element.innerHTML;

                this.dataAttribute.addDependencyDataAttribute(element, DataTemplateHtml.UniqueId, templateHtml);

                element.innerHTML = '';
                
                return true;
            }
            
            getTemplate(element: HTMLElement): HTMLElement {
                this.dataAttribute.getDependencyDataAttribute(element, DataTemplateHtml.UniqueId);

                let html = element.attr('data-template-html');
                return Attv.createHTMLElement(html);
            }
        }

        /**
         * [data-template]='script'
         */
        export class ScriptAttributeValue extends Attv.DataAttributeValue {
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('script', dataAttribute, [ 
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


    export class DataTemplateHtml extends RawDataAttribute {
        static readonly UniqueId = 'DataTemplateHtml';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataTemplateHtml.UniqueId, attributeName, DataTemplateHtml.Description, false);
        }
    }
}

Attv.loader.pre.push(() => {
    Attv.registerDataAttribute('data-template-html',  (attributeName: string) => new Attv.DataTemplateHtml(attributeName));
    Attv.registerDataAttribute('data-template', 
        (attributeName: string) => new Attv.DataTemplate(attributeName),
        (dataAttribute: Attv.DataAttribute, list: Attv.DataAttributeValue[]) => {
            list.push(new Attv.DataTemplate.DefaultAttributeValue(dataAttribute));
            list.push(new Attv.DataTemplate.ScriptAttributeValue(dataAttribute));
        });
});