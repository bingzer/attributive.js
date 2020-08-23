namespace Attv {


    export class DataTemplate extends Attv.DataAttribute {

        constructor (public attributeName: string) {
            super(attributeName, true);
        }

        renderTemplate(sourceElementOrSelectorOrContent: HTMLElement | string, model: any, renderer?: Attv.DataTemplate.Renderers.Renderer): string {
            let sourceElement = sourceElementOrSelectorOrContent as HTMLElement;
            if (Attv.isString(sourceElementOrSelectorOrContent)) {
                sourceElement = document.querySelector(sourceElementOrSelectorOrContent as string) as HTMLElement;
            }

            // find renderer
            if (!renderer && sourceElement.attr('data-renderer')) {
                let rendererName = sourceElement.attr('data-renderer');
                renderer = this.findRendererByName(rendererName);
            }

            let attributeValue = sourceElement.attr(this.attributeName);
            let dataAttributeValue = Attv.getDataAttributeValue(attributeValue, this) as DataTemplate.Attributes.DefaultAttributeValue;

            let templateHtmlElement = dataAttributeValue.getTemplate(sourceElement);

            return this.renderContent(templateHtmlElement.innerHTML, model, renderer);
        }

        renderContent(content: string, model: any, renderer?: Attv.DataTemplate.Renderers.Renderer): string {
            if (!renderer) {
                renderer = new DataTemplate.Renderers.DefaultRenderer();
            }

            return renderer.render(content, model);
        }

        findRendererByName(name: string): DataTemplate.Renderers.Renderer {
            switch (name.toLocaleLowerCase()) {
                case "simple":
                    return new DataTemplate.Renderers.SimpleRenderer();
                default:
                    return new DataTemplate.Renderers.DefaultRenderer();
            }
        }
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
            
            getTemplate(element: HTMLElement): HTMLElement {
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

    
    // --- DataPartial Renderer

    export namespace DataTemplate.Renderers {

        export interface Renderer {
            render(content: string | any, model?: any): string;
        }

        export class DefaultRenderer implements Renderer {
            render(content: string | any, model?: any): string {
                return content;
            }
        }

        export class SimpleRenderer implements Renderer {

            render(content: string | any, model?: any): string {
                let templateElement = Attv.createHTMLElement(content);
                let rootElement = Attv.createHTMLElement('');

                this.bind(rootElement, templateElement, model);

                return rootElement.innerHTML;
            }

            protected bind(element: HTMLElement, template: HTMLElement, model: any) {
                // -- Array
                if (model instanceof Array) {
                    element.innerHTML = '';

                    let array = model as [];

                    for (let i = 0; i < array.length; i++) {
                        let foreachElement = this.findByAttribute(template, 'data-bind-foreach', true)[0];
    
                        if (!foreachElement)
                            return;
                            
                        let forEachBind = foreachElement.cloneNode(true) as HTMLElement;
    
                        this.bind(element, forEachBind, array[i]);
                    }
                }
                // -- Object
                else {
                    let bindElements = this.findByAttribute(template, 'data-bind');
                    for (let i = 0; i < bindElements.length; i++) {
                        let bindElement = bindElements[i];

                        // if the direct parent is the 'template'
                        if (bindElement.closest('[data-bind-foreach]') === template) {
                            // bind the value
                            let propName = bindElement.attr('data-bind');
                            let propValue = this.getPropertyValue(propName, model);

                            bindElement.innerHTML = propValue; // TODO: sanitize
                        } else {
                            // another loop
                            let foreachChild = bindElement.closest('[data-bind-foreach]') as HTMLElement;
                            let foreachChildName = foreachChild.attr('data-bind-foreach');
                            let foreachChildValue = this.getPropertyValue(foreachChildName, model);

                            let foreachChildTemplate = foreachChild.cloneNode(true) as HTMLElement;

                            this.bind(element, foreachChildTemplate, foreachChildValue);
                        }
                    }

                    element.append(template);
                }
            }
            


            private findByAttribute(element: HTMLElement, attributeName: string, includeSelf: boolean = false): HTMLElement[] {
                let elements = element.querySelectorAll(`[${attributeName}]`) as any
                if (includeSelf && element.attr(attributeName)) {
                    elements.push(element);
                }

                return elements;
            }

            private getPropertyValue(propertyName: string, any: any) {
                let propertyValue = any;

                if (Attv.isUndefined(any))
                    return undefined;
    
                if (propertyName === '$' || propertyName === '$root') {
                    propertyValue = any;
                }
                else if (propertyName === '$json') {
                    propertyValue = JSON.stringify(propertyValue);
                    return propertyValue;
                }
                else {
                    let propertyChilds = propertyName.split('.');
                    for (var j = 0; j < propertyChilds.length; j++) {
                        propertyValue = propertyValue[propertyChilds[j]];
                    }
                }
    
                return parseJsonOrElse(propertyValue);
            }
        }
    }

}

Attv.loader.pre.push(() => {
    Attv.registerDataAttribute('data-template', (attributeName) => new Attv.DataTemplate(attributeName));

    Attv.registerAttributeValue('data-template', dataAttribute => new Attv.DataTemplate.Attributes.DefaultAttributeValue(dataAttribute));
    Attv.registerAttributeValue('data-template', dataAttribute => new Attv.DataTemplate.Attributes.ScriptAttributeValue(dataAttribute));
});