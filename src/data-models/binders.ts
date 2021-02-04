namespace Attv.Binders {
        
    export abstract class ElementBinder<TElement extends HTMLElement> {

        constructor(private eventName: string, private broadcastEvent: string = "change") {
            // nothing
        }

        abstract accept(element: TElement): boolean;

        bind(dataModel: DataModel, element: TElement, propertyName: string, propertyValue: any, model?: any) {
            this.setValue(element, propertyValue);

            if (!dataModel.isLoaded(element)) {
                element.addEventListener(this.eventName, e => {
                    if (this.isBroadcastEvent(e)) {
                        return;
                    }

                    let value = this.getValue(element);
                    Attv.DataModel.setProperty(propertyName, value, model);

                    this.broadcastChange(element);
                });
            };
        }
        
        protected abstract setValue(element: TElement, propertyValue: any): void;
        protected abstract getValue(element: TElement): any;

        protected isBroadcastEvent(e: Event) {
            return (e instanceof CustomEvent && (e as CustomEvent).detail?.dataModel);
        }

        protected broadcastChange(element: TElement) {
            let event = new CustomEvent(this.broadcastEvent, { detail: { dataModel: true } });
            event.initEvent(this.broadcastEvent, false, true); 

            element.dispatchEvent(event);
        }

    }

    export class Default extends ElementBinder<HTMLElement> {
        constructor() {
            super("none");
        }
        
        bind(dataModel: DataModel, element: HTMLElement, propertyName: string, propertyValue: any, model?: any) {
            this.setValue(element, propertyValue);
        }

        accept(element: HTMLElement): boolean {
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

        accept(element: HTMLInputElement): boolean {
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

        accept(element: HTMLInputElement): boolean {
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

        accept(element: HTMLSelectElement): boolean {
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

        accept(element: HTMLInputElement): boolean {
            return(element instanceof HTMLInputElement && element.type?.equalsIgnoreCase("radio"));
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

        protected setValue(element: HTMLInputElement, propertyValue: any): void {
            element.checked = element.value === (propertyValue || '');
        }

        protected getValue(element: HTMLInputElement): any {
            let value = element.value;
            return value;
        }
    }
}