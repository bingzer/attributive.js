namespace Attv {
    
    /**
     * [data-partial]
     */
    export class DataPartial extends Attv.Attribute {
        static readonly UniqueId = "DataPartial";

        constructor (public name: string) {
            super(DataPartial.UniqueId, name, true);

            this.isStrict = true;
            this.dependency.requires.push(DataUrl.UniqueId);
        }

        renderPartial(element: HTMLElement | string, content?: string): void {
            if (Attv.isString(element)) {
                element = document.querySelector(element as string) as HTMLElement;
            }

            let htmlElement = element as HTMLElement;

            let attributeValue = this.getValue<DataPartial.DefaultValue>(htmlElement);

            attributeValue.render(htmlElement, content);
        }

    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataPartial {

    /**
     * [data-partial]="lazy"
     */
    export class DefaultValue extends Attv.Attribute.Value {
        
        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            settingsFn?: Attv.Attribute.SettingsFactory,
            validators: Validators.AttributeValidator[] = [
                new Validators.RequiredAttributeValidator([DataUrl.UniqueId])
            ]) {
            super(attributeValue, attribute, settingsFn, validators);

            this.resolver.uses.push(DataTemplateSource.UniqueId, DataTimeout.UniqueId, DataMethod.UniqueId, DataCallback.UniqueId, DataTarget.UniqueId, DataInterval.UniqueId);
        }

        render(element: HTMLElement, content?: string, options?: Ajax.AjaxOptions): void {
            // get content
            if (!content) {
                // data-url
                if (!options) {
                    options = { } as Ajax.AjaxOptions;
                }

                // [data-url]
                options.url = this.resolver.resolve<DataUrl>(DataUrl.UniqueId).getUrl(element);
                options.method = this.resolver.resolve<DataMethod>(DataMethod.UniqueId).getMethod(element);

                options._internalCallback = (ajaxOptions: Attv.Ajax.AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest): void => {
                    content = xhr.response;
                    
                    this.doRender(element, content, options);

                    // [data-callback]
                    let dataCallback = this.resolver.resolve<DataCallback>(DataCallback.UniqueId);
                    dataCallback.callback(element);
                };

                this.sendAjax(element, options);
            }
            else {
                this.doRender(element, content, options);
            }
        }

        protected doRender(element: HTMLElement, content: string, options?: Ajax.AjaxOptions): void {
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
    export class AutoValue extends DefaultValue {
        
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
    export class ClickValue extends DefaultValue {
        
        constructor (attribute: Attv.Attribute) {
            super('click', attribute, undefined, [
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
    export class FormValue extends DefaultValue {
        
        constructor (attribute: Attv.Attribute) {
            super('form', attribute, undefined, [
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


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-partial', 
        (attributeName: string) => new Attv.DataPartial(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataPartial.DefaultValue(Attv.configuration.defaultTag, attribute));
            list.push(new Attv.DataPartial.DefaultValue('lazy', attribute));
            list.push(new Attv.DataPartial.AutoValue(attribute));
            list.push(new Attv.DataPartial.ClickValue(attribute));
            list.push(new Attv.DataPartial.FormValue(attribute));
        });
});