namespace Attv {

    /**
     * [data-template]
     */
    export class DataTemplate extends Attv.Attribute {
        static readonly UniqueId = 'DataTemplate';

        constructor (public name: string) {
            super(DataTemplate.UniqueId, name, true);

            this.isStrict = true;
        }

        renderTemplate(elementOrSelector: HTMLElement | string, modelOrContent: any): string {
            let sourceElement = elementOrSelector as HTMLElement;
            if (Attv.isString(elementOrSelector)) {
                sourceElement = document.querySelector(elementOrSelector as string) as HTMLElement;
            }

            // find the 'default'
            // getValue() doesn't like when sourceElement is null
            let attributeValue = this.attributeValues.filter(val => val.getRawValue(sourceElement) === Attv.configuration.defaultTag)[0] as DataTemplate.DefaultAttributeValue;
            if (sourceElement) {
                attributeValue = this.getValue<DataTemplate.DefaultAttributeValue>(sourceElement);
            }

            return attributeValue.render(sourceElement, modelOrContent);
        }

    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTemplate {

    /**
     * [data-template]='default'
     */
    export class DefaultAttributeValue extends Attv.AttributeValue {
        
        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            configFn?: AttributeConfigurationFactory,
            validators: Validators.AttributeValidator[] = []) {
            super(attributeValue, attribute, configFn, validators);

            this.resolver.uses.push(DataRenderer.UniqueId);
            this.resolver.internals.push(DataTemplateHtml.UniqueId);
        }

        loadElement(element: HTMLElement): boolean {
            let templateHtml = element.html();

            this.resolver.addAttribute(DataTemplateHtml.UniqueId, element, templateHtml);

            element.html('');
            
            return true;
        }
        
        getTemplate(element: HTMLElement): HTMLElement {
            let html = this.resolver.resolve(DataTemplateHtml.UniqueId).getValue(element).getRawValue(element);

            return Attv.createHTMLElement(html);
        }

        render(element: HTMLElement, modelOrContent: string): string {
            let content = this.getTemplate(element)?.html() || modelOrContent;
            let dataRenderer = this.resolver.resolve<DataRenderer>(DataRenderer.UniqueId);

            return dataRenderer.render(content, modelOrContent, element);
        }
    }

    /**
     * [data-template]='script'
     */
    export class ScriptAttributeValue extends DefaultAttributeValue {
        
        constructor (attribute: Attv.Attribute) {
            super('script', attribute, undefined, [ 
                new Validators.RequiredElementValidator(['script']),
                new Validators.RequiredAttributeValidatorWithValue([{ name: 'type', value: 'text/html'}])
            ])
        }

        loadElement(element: HTMLElement): boolean {
            // we don't need to do anything
            return true;
        }
        
        getTemplate(element: HTMLElement): HTMLElement {
            let html = element.html();
            return Attv.createHTMLElement(html);
        }
        
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// DataTemplateHtml //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {
    /**
     * [data-template-html]="*"
     */
    export class DataTemplateHtml extends Attribute {
        static readonly UniqueId = 'DataTemplateHtml';

        constructor (public name: string) {
            super(DataTemplateHtml.UniqueId, name, false);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// DataTemplateSource /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {
    
    /**
     * [data-template-source]="*"
     */
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

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

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