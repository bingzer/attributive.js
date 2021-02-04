namespace Attv.Binders {
        
    export abstract class ElementBinder<TElement extends HTMLElement> {

        constructor(private eventName: string, private broadcastEvent: string = "change") {
            // nothing
        }

        accept(dataModel: DataModel, element: TElement, refId?: string): boolean {
            if (!this.canBind(element))
                return false;

            // compare context
            let dataModelContext = dataModel.resolve(Attv.DataModelContext.Key);
            return element.attvAttr(dataModelContext) === refId;
        }

        bind(dataModel: DataModel, element: TElement, propertyName: string, propertyValue: any, model?: any) {
            this.setValue(element, propertyValue);

            if (!dataModel.isLoaded(element)) {
                element.addEventListener(this.eventName, e => {
                    let value = this.getValue(element);
                    Attv.DataModel.setProperty(propertyName, value, model);

                    // data load
                    this.broadcast(dataModel, element, { forceReload: true });
                });
            };
        }

        stamp(dataModel: DataModel, element: TElement, refId: string) {
            if (refId) {
                let dataModelContext = dataModel.resolve(Attv.DataModelContext.Key);
                element.attvAttr(dataModelContext, refId);
            }
        }
        

        protected abstract canBind(element: TElement): boolean;
        protected abstract setValue(element: TElement, propertyValue: any): void;
        protected abstract getValue(element: TElement): any;

        protected broadcast(dataModel: DataModel, element: HTMLElement, options: LoadElementOptions) {
            let dataLoad = dataModel.resolve(Attv.DataLoad.Key);
            let selectors = dataLoad.raw(element);

            Attv.loadElements(selectors, options);
        }

    }

    export class Default extends ElementBinder<HTMLElement> {
        constructor() {
            super("none");
        }
        
        bind(dataModel: DataModel, element: HTMLElement, propertyName: string, propertyValue: any, model?: any) {
            this.setValue(element, propertyValue);
        }

        protected canBind(element: HTMLElement): boolean {
            return true;
        }

        protected setValue(element: HTMLElement, propertyValue: any): void {
            element.innerHTML = propertyValue;
        }

        protected getValue(element: HTMLElement): any {
            return undefined;
        }
    }

    export class Text extends ElementBinder<HTMLInputElement> {

        constructor() {
            super("input");
        }

        protected canBind(element: HTMLInputElement): boolean {
            return(element instanceof HTMLInputElement && element.type?.equalsIgnoreCase("text"));
        }

        protected setValue(element: HTMLInputElement, propertyValue: any): void {
            element.value = propertyValue || '';
        }

        protected getValue(element: HTMLInputElement): any {
            let value = element.value;
            return value;
        }
    }

    export class Checkbox extends ElementBinder<HTMLInputElement> {

        constructor() {
            super("change");
        }

        protected canBind(element: HTMLInputElement): boolean {
            return(element instanceof HTMLInputElement && element.type?.equalsIgnoreCase("checkbox"));
        }

        protected setValue(element: HTMLInputElement, propertyValue: any): void {
            element.checked = !!(propertyValue || '');
        }

        protected getValue(element: HTMLInputElement): any {
            let value = element.checked;
            return value;
        }

    }

    export class Select extends ElementBinder<HTMLSelectElement> {

        constructor() {
            super("change");
        }
        
        bind(dataModel: DataModel, element: HTMLSelectElement, propertyName: string, propertyValue: any, model?: any) {
            if (dataModel.isLoaded(element)) {
                Attv.reloadElements(element.querySelector('option'));
                this.setValue(element, propertyValue);
            }
            else {
                super.bind(dataModel, element, propertyName, propertyValue, model);
            }
        }

        protected canBind(element: HTMLSelectElement): boolean {
            return element instanceof HTMLSelectElement;
        }

        protected setValue(element: HTMLSelectElement, propertyValue: any): void {
            Attv.toArray(element.options).forEach((opt: HTMLOptionElement) => {
                // check if proeprtyValue is an array
                if (opt.value?.equalsIgnoreCase(propertyValue)) {
                    opt.selected = true;
                }
            });
        }

        protected getValue(element: HTMLSelectElement): any {
            let selectedOptions = element.selectedOptions;

            return selectedOptions[0].value;
        }

    }

    export class RadioButton extends ElementBinder<HTMLInputElement> {

        constructor() {
            super("change");
        }
        
        bind(dataModel: DataModel, element: HTMLInputElement, propertyName: string, propertyValue: any, model?: any) {
            super.bind(dataModel, element, propertyName, propertyValue, model);

            let observer = new MutationObserver((mutations) => {
                let valueAttributeMutation = mutations.filter(m => m.type === 'attributes' && m.attributeName.equalsIgnoreCase('value'))[0];
                if (!valueAttributeMutation)
                    return;
                    
                this.setValue(element, propertyValue);
            });

            observer.observe(element, { attributes: true });
        }

        protected canBind(element: HTMLInputElement): boolean {
            return(element instanceof HTMLInputElement && element.type?.equalsIgnoreCase("radio"));
        }

        protected setValue(element: HTMLInputElement, propertyValue: any): void {
            element.checked = element.value === (propertyValue || '');
        }

        protected getValue(element: HTMLInputElement): any {
            let value = element.value;
            return value;
        }
    }
}