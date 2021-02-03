namespace Attv {
    export class DataModel extends Attv.Attribute {
        static readonly Key: string = 'data-model';

        constructor() {
            super(DataModel.Key);
            this.wildcard = "<jsExpression>";
            this.priority = 0;
            this.isAutoLoad = true;
        }

        /**
         * Bind model into this element
         * @param element the element to bind
         * @param model the model
         */
        bindTo(element: HTMLElement, model?: any): BooleanOrVoid {
            let propertyName = this.raw(element);
            if (!propertyName)
                return false;

            let propertyValue = Attv.DataModel.getProperty(propertyName, model);

            // TODO: refactor code
            if (element instanceof HTMLInputElement) {
                let input = element as HTMLInputElement;
                this.bindInput(input, propertyName, propertyValue, model);
            } else if (element instanceof HTMLSelectElement) {
                let select = element as HTMLSelectElement;
                this.bindSelect(select, propertyName, propertyValue, model);
            }
            else {
                element.innerHTML = propertyValue;
            }

            return true;
        }

        /**
         * Bind all elements under the parent. 
         * The parent will not get bounded. 
         * @param parent the root or the parent
         * @param model the model
         */
        bindAll(parent: HTMLElement, model?: any) {
            let models = parent.querySelectorAll(this.selector());
            models.forEach(elem => {
                this.bindTo(elem as HTMLElement, model);
                this.markLoaded(elem as HTMLElement, true);
            });
        }
        
        private bindInput(input: HTMLInputElement, propertyName: string, propertyValue: any, model?: any): BooleanOrVoid {
            if (input.type?.equalsIgnoreCase('text')) {
                return this.bindInputText(input, propertyName, propertyValue, model);
            } else if (input.type?.equalsIgnoreCase('checkbox')) {
                return this.bindInputCheckbox(input, propertyName, propertyValue, model);
            }
        }
        
        private bindInputText(input: HTMLInputElement, propertyName: string, propertyValue: any, model?: any): BooleanOrVoid {
            input.value = propertyValue || '';
            if (!this.isLoaded(input)) {
                input.addEventListener('input', e => {
                    if (this.isBroadcastEvent(e)) {
                        return;
                    }

                    let value = (e.target as HTMLInputElement).value;
                    Attv.DataModel.setProperty(propertyName, value, model);
                        
                    this.broadcastChange(input);
                });
            }
        }

        private bindInputCheckbox(input: HTMLInputElement, propertyName: string, propertyValue: any, model?: any): BooleanOrVoid {
            input.checked = !!(propertyValue || '');
            if (!this.isLoaded(input)) {
                input.addEventListener('change', e => {
                    if (this.isBroadcastEvent(e)) {
                        return;
                    }

                    let value = (e.target as HTMLInputElement).checked;
                    Attv.DataModel.setProperty(propertyName, value, model);
                        
                    this.broadcastChange(input);
                });
            }
        }

        private bindSelect(select: HTMLSelectElement, propertyName: string, propertyValue: any, model?: any): BooleanOrVoid {
            Attv.toArray(select.options).forEach((opt: HTMLOptionElement) => {
                // check if proeprtyValue is an array
                if (opt.value?.equalsIgnoreCase(propertyValue)) {
                    opt.selected = true;
                }
            });

            if (!this.isLoaded(select)) {
                select.addEventListener("change", e => {
                    if (this.isBroadcastEvent(e)) {
                        return;
                    }

                    let selectedOptions = (e.target as HTMLSelectElement).selectedOptions;
                    if (selectedOptions.length === 1) {
                        Attv.DataModel.setProperty(propertyName, selectedOptions[0].value, model);
                        
                        this.broadcastChange(select);
                    }
                    else {
                        throw new Error('Not supported yet');
                    }
                });
            }
        }

        private isBroadcastEvent(e: Event) {
            return (e instanceof CustomEvent && (e as CustomEvent).detail?.dataModel);
        }

        private broadcastChange(element: HTMLElement, eventName: string = "change") {
            let event = new CustomEvent("change", { detail: { dataModel: true } });
            event.initEvent("change", false, true); 

            element.dispatchEvent(event);
        }
    }

    export namespace DataModel {
        
        export class Value extends Attv.AttributeValue {
            
            load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
                return (this.attribute as DataModel).bindTo(element, options.context);
            }
        }
        
        /**
         * Returns a property of an object
         * @param model the object
         * @param propertyName the property name
         */
        export function getProperty(propertyName: string, model?: any): any {
            if (!model) {
                model = Attv.globalThis$();
            }

            let propertyValue = model;
            let propertyChilds = propertyName.split('.');
            
            for (let j = 0; j < propertyChilds.length; j++) {
                try
                {
                    let child = propertyChilds[j];
                    if (child === 'this') {
                        propertyValue = propertyValue;
                    } else {
                        propertyValue = propertyValue[child];
                    }
                }
                catch (e) {
                    propertyValue = undefined;
                    break;
                }
            }
    
            return parseJsonOrElse(propertyValue);
        }

        /**
         * Sets a property in an object
         * @param model the object
         * @param propertyName the property name
         * @param propertyValue the property value
         */
        export function setProperty(propertyName: string, propertyValue: any, model: any) {
            if (!model) {
                model = Attv.globalThis$();
            }

            let property = model;
            let propertyChilds = propertyName.split('.');
            
            let len = propertyChilds.length;
            for (let j = 0; j < len - 1; j++) {
                let childProperty = propertyChilds[j];
                property = property[childProperty];

                // throw warning
                if (Attv.isUndefined(property)) {
                    Attv.log('warning', `No property ${childProperty}`, property);
                }
            }

            property[propertyChilds[len-1]] = propertyValue;
        }
    }
}

Attv.register(() => new Attv.DataModel(), att => {
    att.map(() => new Attv.DataModel.Value());
});