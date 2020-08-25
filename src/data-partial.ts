namespace Attv {
    
    export class DataPartial extends Attv.Attribute {
        static readonly UniqueId = "DataPartial";

        constructor (public name: string) {
            super(DataPartial.UniqueId, name, true);
        }

        renderPartial(element: HTMLElement | string, content?: string) {
            if (Attv.isString(element)) {
                element = document.querySelector(element as string) as HTMLElement;
            }

            let htmlElement = element as HTMLElement;

            let attributeValue = this.getValue<DataPartial.DefaultAttributeValue>(htmlElement);

            attributeValue.render(htmlElement, content);
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

    export namespace DataPartial {

        /**
         * [data-partial]="lazy"
         */
        export class DefaultAttributeValue extends Attv.AttributeValue {
            
            constructor (attributeValue: string, 
                attribute: Attv.Attribute, 
                validators: Validators.AttributeValidator[] = [
                    new Validators.RequiredAttributeValidator([DataUrl.UniqueId])
                ]) {
                super(attributeValue, attribute, validators);

                this.resolver.requires.push(DataUrl.UniqueId);
                this.resolver.uses.push(DataTemplateSource.UniqueId, DataMethod.UniqueId, DataCallback.UniqueId, DataTarget.UniqueId);
            }

            render(element: HTMLElement, content?: string) {
                // get content
                if (!content) {
                    //let options = element.attr('data') as AjaxOptions;
                    let options = this.getData<AjaxOptions>(element);
                    options._internalCallback = (ajaxOptions: AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest): void => {
                        content = xhr.response;
                        
                        this.doRender(element, content);

                        // [data-callback]
                        let dataCallback = this.resolver.resolve<DataCallback>(DataCallback.UniqueId);
                        dataCallback.callback(element);
                    };

                    this.sendAjax(options);
                }
                else {
                    this.doRender(element, content);
                }
            }

            private doRender(element: HTMLElement, content: string) {
                // [data-template-source]
                let dataTemplateSource = this.resolver.resolve<DataTemplateSource>(DataTemplateSource.UniqueId);
                let html = dataTemplateSource.renderTemplate(element, content);

                // [data-target]
                let dataTarget = this.resolver.resolve<DataTarget>(DataTarget.UniqueId);
                let targetElement = dataTarget?.getTargetElement(element) || element;

                targetElement.innerHTML = html;

                Attv.loadElements(targetElement);
            }
            
            protected sendAjax(options: AjaxOptions) {
                options.method = options.method || 'get';

                let dataPartial = this.attribute as DataPartial;

                dataPartial.sendAjax(options);
            }

        }

        /**
         * [data-partial]="auto"
         */
        export class AutoAttributeValue extends DefaultAttributeValue {
            
            constructor (attribute: Attv.Attribute) {
                super('auto', attribute)
            }
            

            loadElement(element: HTMLElement): boolean {
                this.render(element);

                return true;
            }
        }

        /**
         * [data-partial]="click"
         */
        export class ClickAttributeValue extends DefaultAttributeValue {
            
            constructor (attribute: Attv.Attribute) {
                super('click', attribute, [
                    new Validators.RequiredAttributeValidator([DataUrl.UniqueId]),
                    new Validators.RequiredAnyElementsValidator(['button', 'a'])
                ])
            }

            loadElement(element: HTMLElement): boolean {
                element.onclick = (ev: Event) => {
                    this.render(element);
                    return false;
                }

                return true;
            }
        }

        /**
         * [data-partial]="click"
         */
        export class FormAttributeValue extends DefaultAttributeValue {
            
            constructor (attribute: Attv.Attribute) {
                super('form', attribute, [
                    new Validators.RequiredAttributeValidator([DataUrl.UniqueId]),
                    new Validators.RequiredElementValidator(['form'])
                ])
            }

            loadElement(element: HTMLElement): boolean {
                let formElement = element as HTMLFormElement;
                formElement.onsubmit = (ev: Event) => {
                    this.render(formElement);
                    return false;
                }

                return true;
            }
        }

    }

    export interface AjaxOptions {
        url: string;
        method?: 'post' | 'put' | 'delete' | 'patch' | 'get';
        callback: (wasSuccessful: boolean, xhr: XMLHttpRequest) => void;

        _internalCallback: (ajaxOptions: AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest) => void;
    }
}


Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-partial', 
        (attributeName: string) => new Attv.DataPartial(attributeName),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataPartial.AutoAttributeValue(attribute));
            list.push(new Attv.DataPartial.ClickAttributeValue(attribute));
            list.push(new Attv.DataPartial.FormAttributeValue(attribute));
            list.push(new Attv.DataPartial.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
            list.push(new Attv.DataPartial.DefaultAttributeValue('lazy', attribute));
        });
});