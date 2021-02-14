namespace Attv {
    
    /**
     * [data-partial]
     */
    export class DataPartial extends Attv.Attribute {
        static readonly Key: string = 'data-partial';

        constructor () {
            super(Attv.DataPartial.Key);

            this.wildcard = "none";
            this.isAutoLoad = true;
            this.deps.requires = [ Attv.DataUrl.Key ];
            this.deps.uses = [
                Attv.DataTimeout.Key,
                Attv.DataInterval.Key,
                Attv.DataMethod.Key,
                Attv.DataCallback.Key,
                Attv.DataTarget.Key,
                Attv.DataSource.Key,
                Attv.DataTemplate.Key
            ]
        }

        render(elementOrSelector: HTMLElement | string, model: any): void {
            let element = Attv.select(elementOrSelector);
            let attributeValue = this.getValue<DataPartial.Default>(element);

            attributeValue.render(element, model);
        }
    }

    export namespace DataPartial {

        /**
         * [data-partial='default|lazy']. Default and Laxy load
         */
        export class Default extends Attv.AttributeValue {

            constructor (attributeValue?: string) {
                super(attributeValue);
                this.validators = [
                    { name: Attv.Validators.NeedAttrKeys, options: [Attv.DataUrl.Key] },
                ];
            }

            render(element: HTMLElement, model?: any, options?: Ajax.AjaxOptions): void {
                if (!options) {
                    options = this.attribute.getSettings<Ajax.AjaxOptions>(element) || { } as Ajax.AjaxOptions;
                }

                if (model) {
                    return this.renderModel(element, model, options);
                } else {
                    return this.renderAjax(element, options);
                }
            }

            private renderAjax(element: HTMLElement, options: Ajax.AjaxOptions): void {
                options.url = this.attribute.resolve<DataUrl>(Attv.DataUrl.Key).getUrl(element);
                options.method = this.attribute.resolve<DataMethod>(Attv.DataMethod.Key).getMethod(element);
                options.callback = (ajaxOptions: Attv.Ajax.AjaxOptions, wasSuccessful: boolean, xhr: XMLHttpRequest): void => {
                    if (!wasSuccessful) {
                        return;
                    }

                    let model = Attv.parseJsonOrElse(xhr.response);
                    this.renderModel(element, model, options);

                    // [data-callback]
                    let dataCallback = this.attribute.resolve<DataCallback>(Attv.DataCallback.Key);
                    dataCallback.callback(element);
                };

                this.sendAjax(element, options);
            }

            private renderModel(element: HTMLElement, model: any, options: Ajax.AjaxOptions): void {
                let dataTemplate = this.attribute.resolve<DataTemplate>(Attv.DataTemplate.Key);
                let dataSource = this.attribute.resolve<DataSource>(Attv.DataSource.Key);
                let dataTarget = this.attribute.resolve<DataTarget>(Attv.DataTarget.Key);

                // [data-source]
                let sourceElement = dataSource.getSourceElement(element);
                if (sourceElement) {
                    model = dataTemplate.render(sourceElement, model);
                }

                // [data-target]
                let targetElement = dataTarget.getTargetElement(element) || element;

                if (model instanceof HTMLElement) {
                    targetElement.attvHtml('');
                    targetElement.append(model);
                } else {
                    targetElement.attvHtml(model);
                }
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

        /**
         * [data-partial='auto']. Auto load onDocumentReady()
         */
        export class Auto extends Default {
            constructor () {
                super('auto');
            }

            load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
                this.render(element, options.context);

                return true;
            }
        }

        /**
         * [data-partial='click']
         */
        export class Click extends Default {
            constructor () {
                super('click');

                this.deps.requires = [ Attv.DataTarget.Key ];
                this.validators = [
                    { name: Attv.Validators.NeedAttrKeys, options: [Attv.DataTarget.Key] }
                ];
            }

            load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
                if (!this.attribute.isLoaded(element)) {
                    element.onclick = (ev: Event) => {
                        this.render(element);
                    }
                }

                return true;
            }
        }
    }
}


Attv.register(() => new Attv.DataPartial(), att => {
    att.map(() => new Attv.DataPartial.Default());
    att.map(() => new Attv.DataPartial.Default('lazy'));
    att.map(() => new Attv.DataPartial.Auto());
    att.map(() => new Attv.DataPartial.Click());
});