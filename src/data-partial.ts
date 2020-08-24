namespace Attv {
    
    export class DataPartial extends Attv.DataAttribute {

        constructor (public attributeName: string) {
            super(DataPartial.UniqueId, attributeName, DataPartial.Description, true);

            this.dependencies.requires.push(DataUrl.UniqueId);
            this.dependencies.uses.push(DataTemplateSource.UniqueId, DataMethod.UniqueId, DataCallback.UniqueId, DataTarget.UniqueId);
        }

        renderPartial(element: HTMLElement | string, content?: string) {
            if (Attv.isString(element)) {
                element = document.querySelector(element as string) as HTMLElement;
            }

            let htmlElement = element as HTMLElement;

            let dataAttributeValue = this.getDataAttributeValue<DataPartial.DefaultAttributeValue>(htmlElement);

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

    export namespace DataPartial {

        /**
         * [data-partial]="click"
         */
        export class DefaultAttributeValue extends Attv.DataAttributeValue {
            
            constructor (attributeValue: string, 
                dataAttribute: Attv.DataAttribute, 
                validators: Validators.DataAttributeValueValidator[] = [
                    new Validators.RequiredAttributeValidator([DataUrl.UniqueId])
                ]) {
                super(attributeValue, dataAttribute, validators)
            }

            render(element: HTMLElement, content?: string) {
                // get content
                if (!content) {
                    //let options = element.attr('data') as AjaxOptions;
                    let options = this.dataAttribute.getData<AjaxOptions>(element);
                    options._internalCallback = (ajaxOptions: AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest): void => {
                        if (ajaxOptions.callback) {
                            ajaxOptions.callback(wasSuccessful, xhr);
                        }

                        content = xhr.response;
                        
                        this.doRender(element, content);
                    };

                    this.sendAjax(options);
                }
                else {
                    this.doRender(element, content);
                }
            }

            private doRender(element: HTMLElement, content: string) {
                // [data-template-source]
                let dataTemplateSource = this.dataAttribute.dependencies.getDataAttribute<DataTemplateSource>(DataTemplateSource.UniqueId);
                let html = dataTemplateSource.renderTemplate(element, content);

                // [data-target]
                let dataTarget = this.dataAttribute.dependencies.getDataAttribute<DataTarget>(DataTarget.UniqueId);
                let targetElement = dataTarget?.getTargetElement(element) || element;

                targetElement.innerHTML = html;

                Attv.loadElements(element);
            }
            
            protected sendAjax(options: AjaxOptions) {
                options.method = options.method || 'get';

                let dataPartial = this.dataAttribute as DataPartial;

                dataPartial.sendAjax(options);
            }

        }

        /**
         * [data-partial]="auto"
         */
        export class AutoAttributeValue extends DefaultAttributeValue {
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('auto', dataAttribute)
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
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('click', dataAttribute)
            }
            
        }

        /**
         * [data-partial]="click"
         */
        export class FormAttributeValue extends DefaultAttributeValue {
            
            constructor (dataAttribute: Attv.DataAttribute) {
                super('form', dataAttribute, [
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

    export namespace DataPartial {
        export const UniqueId: string = "DataPartial";
        export const Description: string = "Data partial for ajax and stuffs";
    }
}


Attv.loader.pre.push(() => {
    Attv.registerDataAttribute('data-partial', 
        (attributeName: string) => new Attv.DataPartial(attributeName),
        (dataAttribute: Attv.DataAttribute, list: Attv.DataAttributeValue[]) => {
            list.push(new Attv.DataPartial.AutoAttributeValue(dataAttribute));
            list.push(new Attv.DataPartial.ClickAttributeValue(dataAttribute));
            list.push(new Attv.DataPartial.FormAttributeValue(dataAttribute));
            list.push(new Attv.DataPartial.DefaultAttributeValue(Attv.configuration.defaultTag, dataAttribute));
            list.push(new Attv.DataPartial.DefaultAttributeValue('lazy', dataAttribute));
        });
});