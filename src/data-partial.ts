namespace Attv {
    export interface AjaxOptions {
        url: string;
        method?: 'post' | 'put' | 'delete' | 'patch' | 'get';
        callback: (wasSuccessful: boolean, xhr: XMLHttpRequest) => void;

        _internalCallback: (ajaxOptions: AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest) => void;
    }
    
    export class DataPartial extends Attv.DataAttribute {

        constructor (public attributeName: string, public renderer: DataTemplate.Renderers.Renderer = new DataTemplate.Renderers.DefaultRenderer()) {
            super(attributeName, true);
        }

        renderPartial(element: HTMLElement | string, content?: string) {
            if (Attv.isString(element)) {
                element = document.querySelector(element as string) as HTMLElement;
            }

            let htmlElement = element as HTMLElement;

            // must get the content somehow
            let attributeValue = htmlElement.attr(this.attributeName);
            let dataAttributeValue = Attv.getDataAttributeValue(attributeValue, this) as DataPartial.Attributes.DefaultAttributeValue;

            dataAttributeValue.render(htmlElement, content);
        }
        
        sendAjax(options: AjaxOptions) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (e: Event) {
                let xhr = this as XMLHttpRequest;
                if (xhr.readyState == 4) {
                    let wasSuccessful = this.status >= 200 && this.status < 400;

                    options._internalCallback(options, wasSuccessful, xhr);
                }
            };
            xhr.onerror = function (e: ProgressEvent<EventTarget>) {
                options._internalCallback(options, false, xhr);
            }

            xhr.open(options.method, options.url, true);
            xhr.send();
        }

    }

    // --- AttributeValues

    export namespace DataPartial.Attributes {

        export class DefaultAttributeValue extends Attv.DataAttributeValue {
            
            constructor (attributeValue: string, 
                dataAttribute: Attv.DataAttribute, 
                validators: Validators.DataAttributeValueValidator[] = [
                    new Validators.RequiredAttributeValidator(['data-url'])
                ]) {
                super(attributeValue, dataAttribute, validators)
            }

            loadElement(element: HTMLElement): boolean {
                this.render(element);

                return true;
            }

            render(element: HTMLElement, content?: string) {
                let dataPartial = this.dataAttribute as DataPartial;
                let renderer = dataPartial.renderer;

                // get content
                if (!content) {
                    let options = element.attr('data') as AjaxOptions;
                    options._internalCallback = (ajaxOptions: AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest): void => {
                        if (ajaxOptions.callback) {
                            ajaxOptions.callback(wasSuccessful, xhr);
                        }

                        content = xhr.response;
                        renderer.render(dataPartial, element, content);
                    };

                    this.sendAjax(options);
                }
                else {
                    renderer.render(dataPartial, element, content);
                }
            }
            
            protected sendAjax(options: AjaxOptions) {
                options.method = options.method || 'get';

                let dataPartial = this.dataAttribute as DataPartial;

                dataPartial.sendAjax(options);
            }

        }

        export class AutoAttributeValue extends DefaultAttributeValue {
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('auto', dataAttribute)
            }
            
        }

        export class ClickAttributeValue extends DefaultAttributeValue {
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('click', dataAttribute)
            }
            
        }

        export class FormAttributeValue extends DefaultAttributeValue {
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('form', dataAttribute)
            }
            
        }

    }
}


Attv.loader.pre.push(() => {
    Attv.registerDataAttribute('data-partial', (attributeName) => new Attv.DataPartial(attributeName));
    
    Attv.registerAttributeValue('data-partial', dataAttribute => new Attv.DataPartial.Attributes.AutoAttributeValue(dataAttribute));
    Attv.registerAttributeValue('data-partial', dataAttribute => new Attv.DataPartial.Attributes.ClickAttributeValue(dataAttribute));
    Attv.registerAttributeValue('data-partial', dataAttribute => new Attv.DataPartial.Attributes.FormAttributeValue(dataAttribute));
    Attv.registerAttributeValue('data-partial', dataAttribute => new Attv.DataPartial.Attributes.DefaultAttributeValue('default', dataAttribute));
    Attv.registerAttributeValue('data-partial', dataAttribute => new Attv.DataPartial.Attributes.DefaultAttributeValue('lazy', dataAttribute));
});