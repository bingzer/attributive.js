namespace Attv {


    export class DataTemplate extends Attv.DataAttribute {
        static readonly UniqueId = 'DataTemplate';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataTemplate.UniqueId, attributeName, DataTemplate.Description, true);

            this.dependencies.requires.push(DataRenderer.UniqueId, DataTemplateHtml.UniqueId);
        }

        renderTemplate(sourceElementOrSelectorOrContent: HTMLElement | string, modelOrContent: any): string {
            let sourceElement = sourceElementOrSelectorOrContent as HTMLElement;
            if (Attv.isString(sourceElementOrSelectorOrContent)) {
                sourceElement = document.querySelector(sourceElementOrSelectorOrContent as string) as HTMLElement;
            }

            let attributeValue = this.getDataAttributeValue<DataTemplate.DefaultAttributeValue>(sourceElement);
            let content = attributeValue.getTemplate(sourceElement)?.innerHTML || modelOrContent;
            let dataRenderer = this.dependencies.getDataAttribute<DataRenderer>(DataRenderer.UniqueId);

            return dataRenderer.render(content, modelOrContent, sourceElement);
        }

    }

    // --- AttributeValues

    export namespace DataTemplate {
        
        /**
         * [data-template]='default'
         */
        export class DefaultAttributeValue extends Attv.DataAttributeValue {
            
            constructor (attributeValue: string, dataAttribute: Attv.DataAttribute) {
                super(attributeValue, dataAttribute)
            }

            loadElement(element: HTMLElement): boolean {
                let templateHtml = element.innerHTML;

                this.dataAttribute.addDependencyDataAttribute(DataTemplateHtml.UniqueId, element, templateHtml);

                element.innerHTML = '';
                
                return true;
            }
            
            getTemplate(element: HTMLElement): HTMLElement {
                let html = this.dataAttribute.getDependencyDataAttribute(DataTemplateHtml.UniqueId, element);

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


    export class DataTemplateHtml extends DataAttribute {
        static readonly UniqueId = 'DataTemplateHtml';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataTemplateHtml.UniqueId, attributeName, DataTemplateHtml.Description, false);
        }
    }

    export class DataTemplateSource extends DataAttribute {
        static readonly UniqueId = 'DataTemplateSource';
        static readonly Description = '';

        constructor (public attributeName: string) {
            super(DataTemplateSource.UniqueId, attributeName, DataTemplateSource.Description, false);

            this.dependencies.uses.push(DataTemplate.UniqueId);
        }

        renderTemplate(element: HTMLElement, model: any): string {
            let templateElement = this.getSourceElement(element);

            let dataTemplate = this.dependencies.getDataAttribute<DataTemplate>(DataTemplate.UniqueId);
            return dataTemplate.renderTemplate(templateElement, model);
        }

        protected getSourceElement(element: HTMLElement): HTMLElement {
            let sourceElementSelector = this.getDataAttributeValue(element).attributeValue;

            return document.querySelector(sourceElementSelector) as HTMLElement;
        }
    }
}

Attv.loader.pre.push(() => {
    Attv.registerDataAttribute('data-template-html',  (attributeName: string) => new Attv.DataTemplateHtml(attributeName));
    Attv.registerDataAttribute('data-template-source',  (attributeName: string) => new Attv.DataTemplateSource(attributeName));
    Attv.registerDataAttribute('data-template', 
        (attributeName: string) => new Attv.DataTemplate(attributeName),
        (dataAttribute: Attv.DataAttribute, list: Attv.DataAttributeValue[]) => {
            list.push(new Attv.DataTemplate.DefaultAttributeValue(Attv.configuration.defaultTag, dataAttribute));
            list.push(new Attv.DataTemplate.ScriptAttributeValue(dataAttribute));
        });
});