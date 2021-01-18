/// <reference path="../attv.ts" />

namespace Attv {
    export class DataPartial extends Attv.Attribute {
        
        static readonly Key: string = 'data-partial';

        constructor() {
            super(DataPartial.Key);

            this.isAutoLoad = true;
            this.dependency.requires = [Attv.DataUrl.Key];
        }

        renderPartial(element: HTMLElement | string, content?: string): void {
            if (Attv.isString(element)) {
                element = document.querySelector(element as string) as HTMLElement;
            }

            let htmlElement = element as HTMLElement;

            let attributeValue = this.getValue<DataPartial.Value>(htmlElement);

            attributeValue.render(htmlElement, content);
        }
    }

    export namespace DataPartial {

        export class Value extends Attv.AttributeValue {
            constructor(value?: string) {
                super(value);

                this.validators = [{ name: Attv.Validators.RequiringAttributeKeys, options: [ Attv.DataUrl.Key ] }];
            }
            
            load(element: HTMLElement): boolean {
                this.render(element);

                console.log('renderPartial() was called');

                return true;
            }

            render(element: HTMLElement, content?: string, options?: Ajax.AjaxOptions): void {
                // get content
                if (!content) {
                    // data-url
                    if (!options) {
                        options = { } as Ajax.AjaxOptions;
                    }

                    // [data-url]
                    options.url = this.attribute.resolve<DataUrl>(DataUrl.Key).getUrl(element);
                    options.method = this.attribute.resolve<DataMethod>(DataMethod.Key).getMethod(element);

                    options.callback = (ajaxOptions: Attv.Ajax.AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest): void => {
                        if (!wasSuccessful) {
                            return;
                        }

                        content = xhr.response;
                        this.doRender(element, content, options);

                        // [data-callback]
                        let dataCallback = this.attribute.resolve<DataCallback>(DataCallback.Key);
                        dataCallback.callback(element);
                    };

                    this.sendAjax(element, options);
                }
                else {
                    this.doRender(element, content, options);
                }
            }

            protected doRender(element: HTMLElement, content: string, options?: Ajax.AjaxOptions): void {
                let html = this.getTemplate(element, content);
                let targetElement = this.getTargetElement(element);

                targetElement.attvHtml(html);

                Attv.loadElements(targetElement);
            }

            protected getTemplate(element: HTMLElement, content: string): string {
                // [data-template-source]           
                let dataTemplateSource = this.attribute.resolve<DataTemplateSource>(Attv.DataTemplateSource.Key);

                let html = dataTemplateSource.renderTemplate(element, content);

                return html;
            }

            protected getTargetElement(element: HTMLElement): HTMLElement {
                // [data-target]           
                let dataTarget = this.attribute.resolve<DataTarget>(Attv.DataTarget.Key);

                let targetElement = dataTarget.getTargetElement(element) || element;

                return targetElement;
            }
            
            private sendAjax(element: HTMLElement, options: Attv.Ajax.AjaxOptions) {
                // [data-timeout]
                let dataTimeout = this.attribute.resolve<DataTimeout>(Attv.DataTimeout.Key);
                dataTimeout.timeout(element, () => {
                    let dataInterval = this.attribute.resolve<DataInterval>(Attv.DataInterval.Key);
                    dataInterval.interval(element, () => {
                        Attv.Ajax.sendAjax(options);
                    });
                });
            }
        }
    
        export class Lazy extends Value {
            constructor() {
                super('lazy');
            }

            load(element: HTMLElement): boolean {
                return true;
            }
        }
    
        export class Click extends Value {
            constructor() {
                super('click');
            }

            load(element: HTMLElement): boolean {
                element.onclick = (ev: Event) => {
                    this.render(element);
                    return false;
                }
    
                return true;
            }
        }
    
        export class Form extends Value {
            constructor() {
                super('form');
            }

            load(element: HTMLElement): boolean {
                let formElement = element as HTMLFormElement;
                formElement.onsubmit = (ev: Event) => {
                    this.render(formElement);
                    return false;
                }
    
                return true;
            }
        }
    }
}

Attv.register(() => new Attv.DataPartial(), att => {
    att.map(() => new Attv.DataPartial.Value());
    att.map(() => new Attv.DataPartial.Value('auto'));
    att.map(() => new Attv.DataPartial.Lazy());
    att.map(() => new Attv.DataPartial.Form());
    att.map(() => new Attv.DataPartial.Click());
});