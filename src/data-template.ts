namespace Attv {


    export class DataTemplate extends Attv.DataAttribute {

        constructor (public attributeName: string, public renderer: DataTemplate.Renderers.Renderer = new DataTemplate.Renderers.DefaultRenderer()) {
            super(attributeName, true);
        }

        // renderTemplate(model: any, renderer: Attv.DataTemplate.Renderers.Renderer) {
            
        // }

    }

    // --- AttributeValues

    export namespace DataTemplate.Attributes {
        
        /**
         * [data-template]='default'
         */
        export class DefaultAttributeValue extends Attv.DataAttributeValue {
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('default', dataAttribute)
            }

            loadElement(element: HTMLElement): boolean {
                let templateHtml = element.innerHTML;
                element.attr('data-template-html', templateHtml);
                element.innerHTML = '';
                
                return true;
            }
            

            protected render(element: HTMLElement, template: HTMLElement, model: any) {
                if (model instanceof Array) {
                    let elements = this.findByAttribute(template, 'data-bind');
                }
                else {

                }
            }


            

            private findByAttribute(element: HTMLElement, attributeName: string): HTMLElement[] {
                let elements = element.querySelectorAll(`[${attributeName}]`) as any
                if (element.attr(attributeName)) {
                    elements.push(element);
                }

                return elements;
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
            
        }
    }

    
    // --- DataPartial Renderer

    export namespace DataTemplate.Renderers {

        export interface Renderer {
            render(dataAttribute: DataAttribute, element: HTMLElement, content: string | any);
        }

        export class DefaultRenderer implements Renderer {
            render(dataAttribute: DataAttribute, element: HTMLElement, content: string | any) {
                element.innerHTML = content;

                Attv.loadElements(element);
            }
        }

        export class SimpleRenderer implements Renderer {
            render(dataAttribute: DataAttribute, element: HTMLElement, content: string | any) {
                let model = content as object;
                if (Attv.isString(content)) {
                    model = Attv.parseJsonOrElse(content);
                }
                

            }
        }
    }

}

Attv.loader.pre.push(() => {
    Attv.registerDataAttribute('data-template', (attributeName) => new Attv.DataTemplate(attributeName));

    Attv.registerAttributeValue('data-template', dataAttribute => new Attv.DataTemplate.Attributes.DefaultAttributeValue(dataAttribute));
    Attv.registerAttributeValue('data-template', dataAttribute => new Attv.DataTemplate.Attributes.ScriptAttributeValue(dataAttribute));
});