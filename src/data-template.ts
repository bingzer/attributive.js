namespace Attv {

    /**
     * [data-template]
     */
    export class DataTemplate extends Attv.Attribute {
        static readonly UniqueId = 'DataTemplate';

        constructor () {
            super(DataTemplate.UniqueId, true);

            this.wildcard = "none";
        }

        renderTemplate(elementOrSelector: HTMLElement | string, modelOrContent: any): string {
            let sourceElement = elementOrSelector as HTMLElement;
            if (Attv.isString(elementOrSelector)) {
                sourceElement = document.querySelector(elementOrSelector as string) as HTMLElement;
            }

            // find the 'default'
            // getValue() doesn't like when sourceElement is null
            let attributeValue = this.values.filter(val => val.getRaw(sourceElement) === Attv.configuration.defaultTag)[0] as DataTemplate.DefaultValue;
            if (sourceElement) {
                attributeValue = this.getValue<DataTemplate.DefaultValue>(sourceElement);
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
    export class DefaultValue extends Attv.Attribute.Value {
        
        constructor (attributeValue: string) {
            super(attributeValue);

            this.resolver.uses.push(DataRenderer.UniqueId);
            this.resolver.internals.push(DataTemplateHtml.UniqueId);
        }

        loadElement(element: HTMLElement): boolean {
            let templateHtml = element.attvHtml();

            this.resolver.addAttribute(DataTemplateHtml.UniqueId, element, templateHtml);

            element.attvHtml('');
            
            return true;
        }
        
        getTemplate(element: HTMLElement): string {
            let html = this.resolver.resolve(DataTemplateHtml.UniqueId).getValue(element).getRaw(element);

            return html;
        }

        render(element: HTMLElement, modelOrContent: string): string {
            let content = this.getTemplate(element) || modelOrContent;
            let dataRenderer = this.resolver.resolve<DataRenderer>(DataRenderer.UniqueId);

            return dataRenderer.render(content, modelOrContent, element);
        }
    }

    /**
     * [data-template]='script'
     */
    export class ScriptValue extends DefaultValue {
        
        constructor () {
            super('script')
            this.validators.push(new Validators.RequiredElement(['script']), new Validators.RequiredAttributeWithValue([{ name: 'type', value: 'text/html'}]));
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

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// DataTemplateHtml //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {
    /**
     * [data-template-html]="*"
     */
    export class DataTemplateHtml extends Attribute {
        static readonly UniqueId = 'DataTemplateHtml';

        constructor () {
            super(DataTemplateHtml.UniqueId);
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

        constructor () {
            super(DataTemplateSource.UniqueId);

            this.wildcard = "<querySelector>";
        }

        renderTemplate(element: HTMLElement, model: any): string {
            let templateElement = this.getSourceElement(element);

            let dataTemplate = this.getValue(element).resolver.resolve<DataTemplate>(DataTemplate.UniqueId);
            return dataTemplate.renderTemplate(templateElement, model);
        }

        getSourceElement(element: HTMLElement): HTMLElement {
            let selector = this.getValue(element).getRaw(element);
            if (selector === 'this') {
                return element;
            }

            return document.querySelector(selector) as HTMLElement;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-template-html',  () => new Attv.DataTemplateHtml());
    Attv.registerAttribute('data-template-source', 
        () => new Attv.DataTemplateSource(),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            let attributeValue = new Attv.Attribute.Value(undefined);
            attributeValue.resolver.uses.push(Attv.DataTemplate.UniqueId);

            list.push(attributeValue);
        });
    Attv.registerAttribute('data-template', 
        () => new Attv.DataTemplate(),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTemplate.DefaultValue(Attv.configuration.defaultTag));
            list.push(new Attv.DataTemplate.ScriptValue());
        });
});