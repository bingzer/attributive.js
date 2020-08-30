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
        
        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            validators: Validators.AttributeValidator[] = []) {
            super(attributeValue, attribute, validators);

            this.resolver.uses.push(DataRenderer.UniqueId);
            this.resolver.internals.push(DataTemplateHtml.UniqueId);
        }

        loadElement(element: HTMLElement): boolean {
            let templateHtml = element.html();

            this.resolver.addAttribute(DataTemplateHtml.UniqueId, element, templateHtml);

            element.html('');
            
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
        
        constructor (attribute: Attv.Attribute) {
            super('script', attribute, [ 
                new Validators.RequiredElement(['script']),
                new Validators.RequiredAttributeWithValue([{ name: 'type', value: 'text/html'}])
            ])
        }

        loadElement(element: HTMLElement): boolean {
            // we don't need to do anything
            return true;
        }
        
        getTemplate(element: HTMLElement): string {
            return element.html();
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
    Attv.registerAttribute('data-template-html',  (attributeName: string) => new Attv.DataTemplateHtml(attributeName));
    Attv.registerAttribute('data-template-source', 
        (attributeName: string) => new Attv.DataTemplateSource(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            let attributeValue = new Attv.Attribute.Value(undefined, attribute);
            attributeValue.resolver.uses.push(Attv.DataTemplate.UniqueId);

            list.push(attributeValue);
        });
    Attv.registerAttribute('data-template', 
        (attributeName: string) => new Attv.DataTemplate(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTemplate.DefaultValue(Attv.configuration.defaultTag, attribute));
            list.push(new Attv.DataTemplate.ScriptValue(attribute));
        });
});