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
                Attv.DataTemplate.Key,
                Attv.DataTemplateUrl.Key,
                Attv.DataData.Key,
                Attv.DataPartialCall.Key
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
         * Partial options (also a union of AjaxOptions and LoadElementOptions) + more
         */
        export interface PartialOptions extends Attv.Ajax.AjaxOptions, LoadElementOptions, LoadElementCaller {
    
            /**
             * An HTMLElement container to insert to result to
             */
            container?: Attv.HTMLElementOrString;

            /**
             * Partial call
             */
            partialCall: (callFn: DataPartialCall.Call, context?: any, options?: PartialOptions) => void;
    
            /**
             * Callbacks before rendering.
             * sendFn() needs to be called to conginue
             */
            beforeRender?: (sendFn: () => void) => void;
    
            /**
             * During rendering
             */
            onRender?: (model: any, renderFn: (model: any, element: HTMLElement) => void) => void;
    
            /**
             * After rendering
             */
            afterRender?: (model: any, element: HTMLElement, targetElement?: HTMLElement) => void;

        }

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

            render(element: HTMLElement, model?: any, options?: PartialOptions): void {
                if (!options) {
                    options = this.attribute.getSettings<PartialOptions>(element) || { } as PartialOptions;
                }

                // deep copy options
                options = JSON.parse(JSON.stringify(options, (key, value) => {
                    if (key === "attribute") return undefined;
                    return value;
                }));

                options.url = this.attribute.resolve<DataUrl>(Attv.DataUrl.Key).raw(element, options.context);
                options.method = this.attribute.resolve<DataMethod>(Attv.DataMethod.Key).parseRaw<Ajax.AjaxMethod>(element, options.context);
                options.partialCall = this.attribute.resolve(Attv.DataPartialCall.Key).parseRaw<any>(element, options.context);
                
                // [data-target]
                let dataTarget = this.attribute.resolve<Attv.DataTarget>(Attv.DataTarget.Key);
                // if there's no data-target but there's a callback
                // leave the container empty
                let containerMaybeEmpty = (!dataTarget.exists(element) && this.attribute.resolve(Attv.DataCallback.Key).exists(element));
                options.container = dataTarget.parseRaw<HTMLElement>(element, options.context) || (containerMaybeEmpty ? undefined : element);

                // Before render
                options.beforeRender = sendFn => {
                    // [data-data]
                    let dataData = this.attribute.resolve<Attv.DataData>(Attv.DataData.Key);
                    options.data = dataData.parseRaw(element, options.context);

                    // [data-context]
                    options.context = this.attribute.getContext(element, options.context);

                    // [data-timeout]
                    let dataTimeout = this.attribute.resolve<Attv.DataTimeout>(Attv.DataTimeout.Key);
                    dataTimeout.timeout(element, () => {
                        let dataInterval = this.attribute.resolve<Attv.DataInterval>(Attv.DataInterval.Key);
                        dataInterval.interval(element, () => {
                            sendFn();
                        });
                    });
                };

                let tempContext = options.context;

                // During model rendering
                options.onRender = (model, renderFn) => {
                    // [data-context]
                    options.context = this.attribute.getContext(element);

                    // [data-source] vs [data-template-url]
                    let dataSource = this.attribute.resolve<Attv.DataSource>(Attv.DataSource.Key);
                    let dataTemplateUrl = this.attribute.resolve(Attv.DataTemplateUrl.Key);

                    if (dataSource.exists(element)) {
                        let sourceElement = dataSource.parseRaw<HTMLElement>(element, options.context);
                        
                        let dataTemplate = this.attribute.resolve<Attv.DataTemplate>(Attv.DataTemplate.Key);
                        model = dataTemplate.render(sourceElement, model);
                        
                        renderFn(model, element);
                    } else if (dataTemplateUrl.exists(element)) {
                        let templateAjaxOptions = dataTemplateUrl.getSettings<Ajax.AjaxOptions>(element) || {} as Ajax.AjaxOptions;
                        templateAjaxOptions.url = templateAjaxOptions.url || dataTemplateUrl.raw(element, options.context);
                        templateAjaxOptions.callback = (wasSuccessful, xhr) => {
                            if (!wasSuccessful)
                                return;  // TODO log?
                            
                            let template = Attv.Dom.parseDom(xhr.response);

                            tempContext = options.context;
                            
                            // modify the load options
                            options.context = this.attribute.getContext(element, Attv.concatObject(options.context, model, true));
                            options.element = element;
                            options.attribute = this.attribute;
                            options.includeSelf = false;

                            renderFn(template, element);
                        };

                        Ajax.sendAjax(templateAjaxOptions);

                    } else {
                        renderFn(model, element);
                    }
                };

                // After model has been rendered
                options.afterRender = (model, element, targetElement) => {
                    // [data-callback]
                    let dataCallback = this.attribute.resolve<Attv.DataCallback>(Attv.DataCallback.Key);
                    dataCallback.callback(element);

                    options.context = tempContext;
                }

                return DataPartial.renderPartial(options, model);
            }

        }

        /**
         * [data-partial='auto']. Auto load onDocumentReady()
         */
        export class Auto extends Default {
            constructor () {
                super('auto');
            }

            load(element: HTMLElement, options?: PartialOptions): BooleanOrVoid {
                this.render(element, undefined, options);

                return true;
            }
        }

        /**
         * [data-partial='click']
         */
        export class Click extends Default {
            constructor () {
                super('click');

                this.deps.uses = [ Attv.DataTarget.Key ];
            }

            load(element: HTMLElement, options?: PartialOptions): BooleanOrVoid {
                if (!this.attribute.isLoaded(element)) {
                    element.addEventListener('click', ev => this.click(ev, element, options));
                }

                return true;
            }

            protected click(ev: Event, element: HTMLElement, options?: PartialOptions) {
                if (!ev.cancelBubble || !ev.defaultPrevented) {
                    this.render(element, undefined, options);
                }
            }
        }

        /**
         * [data-partial='nonce'].
         * After load this AttributeValue will remove [data-partial] from the element.
         */
        export class Nonce extends Default {
            constructor () {
                super('nonce');
            }

            load(element: HTMLElement, options?: PartialOptions): BooleanOrVoid {
                this.render(element, undefined, options);

                // remove data partial
                element.removeAttribute(this.attribute.name);
                element.removeAttribute(this.attribute.loadedName());
                element.removeAttribute(this.attribute.settingsName());

                return false;
            }
        }

        export class Form extends Default {
            constructor () {
                super('form');

                this.validators = [
                    { name: Attv.Validators.NeedElements, options: [ 'form' ] }
                ];
            }

            load(element: HTMLElement, options?: PartialOptions): BooleanOrVoid {
                if (!this.attribute.isLoaded(element)) {
                    element.onsubmit = (ev: Event) => {
                        this.render(element, undefined, options);
                        return false;
                    }
                }

                return true;
            }
        }

        // --------------------------------------------------------------------------------------------- //
        
        /**
         * Render partial
         * 
         * @param options partial options
         * @param model optionaly specified model. If model is specified, this call won't make Ajax call
         */
        export function renderPartial(options?: PartialOptions, model?: any) {
            options.beforeRender = options.beforeRender || (fn => fn());
            options.onRender = options.onRender || ((model, renderFn) => renderFn(model, undefined));
            options.afterRender = options.afterRender || ((model, element, targetElement) => {});

            let ajaxOptions = options as Attv.Ajax.AjaxOptions;            
            ajaxOptions.callback = (wasSuccessful: boolean, xhr: XMLHttpRequest): void => {
                if (!wasSuccessful) {
                    return;
                }

                let model = Attv.parseJsonOrElse(xhr.response);
                renderModel(model, options);
            };

            let renderModel = (model: any, options: PartialOptions) => {
                options.onRender(model, (model, element) => {
                    let targetElement = Attv.select(options.container);
    
                    if (targetElement) {
                        targetElement.attvHtml('');
                        targetElement.attvHtml(model);
        
                        Attv.loadElements(targetElement, options, options);
                    }
    
                    options.afterRender(model, element, targetElement);
                });
            };

            if (model) {
                renderModel(model, options);
            } else {
                options.beforeRender(() => {
                    if (options.partialCall) {
                        options.partialCall((data, error) => {
                            if (error) {
                                throw error;
                            }
                            renderModel(data, options);
                        }, options.context, options);
                    } else {
                        Attv.Ajax.sendAjax(options)
                    }
                });
            }
        }
    }
}


Attv.register(() => new Attv.DataPartial(), att => {
    att.map(() => new Attv.DataPartial.Default());
    att.map(() => new Attv.DataPartial.Default('lazy'));
    att.map(() => new Attv.DataPartial.Auto());
    att.map(() => new Attv.DataPartial.Click());
    att.map(() => new Attv.DataPartial.Nonce());
    att.map(() => new Attv.DataPartial.Form());
});