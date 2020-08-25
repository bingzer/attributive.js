namespace Attv {
    
    export class DataPartial extends Attv.Attribute {
        static readonly UniqueId = "DataPartial";

        constructor (public name: string) {
            super(DataPartial.UniqueId, name, true);

            this.dependency.requires.push(DataUrl.UniqueId);
        }

        renderPartial(element: HTMLElement | string, content?: string) {
            if (Attv.isString(element)) {
                element = document.querySelector(element as string) as HTMLElement;
            }

            let htmlElement = element as HTMLElement;

            let attributeValue = this.getValue<DataPartial.DefaultAttributeValue>(htmlElement);

            attributeValue.render(htmlElement, content);
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

                this.resolver.uses.push(DataTemplateSource.UniqueId, DataTimeout.UniqueId, DataMethod.UniqueId, DataCallback.UniqueId, DataTarget.UniqueId, DataInterval.UniqueId);
            }

            render(element: HTMLElement, content?: string) {
                // get content
                if (!content) {
                    // data-url
                    let options = { } as Ajax.AjaxOptions;

                    // [data-url]
                    options.url = this.resolver.resolve<DataUrl>(DataUrl.UniqueId).getUrl(element);
                    options.method = this.resolver.resolve<DataMethod>(DataMethod.UniqueId).getMethod(element);

                    options._internalCallback = (ajaxOptions: Attv.Ajax.AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest): void => {
                        content = xhr.response;
                        
                        this.doRender(element, content);

                        // [data-callback]
                        let dataCallback = this.resolver.resolve<DataCallback>(DataCallback.UniqueId);
                        dataCallback.callback(element);
                    };

                    this.sendAjax(element, options);
                }
                else {
                    this.doRender(element, content);
                }
            }

            private doRender(element: HTMLElement, content: string) {
                // [data-template-source]                
                let html = this.resolver.resolve<DataTemplateSource>(DataTemplateSource.UniqueId).renderTemplate(element, content);

                // [data-target]
                let targetElement = this.resolver.resolve<DataTarget>(DataTarget.UniqueId).getTargetElement(element) || element;

                targetElement.html(html);

                Attv.loadElements(targetElement);
            }
            
            private sendAjax(element: HTMLElement, options: Attv.Ajax.AjaxOptions) {
                // [data-timeout]
                let dataTimeout = this.resolver.resolve<DataTimeout>(DataTimeout.UniqueId);
                dataTimeout.timeout(element, () => {
                    let dataInterval = this.resolver.resolve<DataInterval>(DataInterval.UniqueId);
                    dataInterval.interval(element, () => {
                        Attv.Ajax.sendAjax(options);
                    });
                });
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