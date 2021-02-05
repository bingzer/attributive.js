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
            this.bindValueToElement(element, propertyValue);

            if (!dataModel.isLoaded(element)) {
                element.addEventListener(this.eventName, e => {
                    let value = this.getValueFromElement(element);
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
        protected abstract bindValueToElement(element: TElement, propertyValue: any): void;
        protected abstract getValueFromElement(element: TElement): any;

        protected broadcast(dataModel: DataModel, element: TElement, options: LoadElementOptions) {
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
            this.bindValueToElement(element, propertyValue);
        }

        protected canBind(element: HTMLElement): boolean {
            return true;
        }

        protected bindValueToElement(element: HTMLElement, propertyValue: any): void {
            element.innerHTML = propertyValue || '';
        }

        protected getValueFromElement(element: HTMLElement): any {
            return undefined;
        }
    }

    export class Text extends ElementBinder<HTMLInputElement> {

        readonly types: string[] = [ "text", "password", "email", "number", "tel", "color", "date", "datetime-local", "file", "hidden", "image", "month", "range", "url", "week" ];

        constructor() {
            super("input");
        }

        protected canBind(element: HTMLInputElement): boolean {
            return element instanceof HTMLInputElement && this.types.some(t => t.equalsIgnoreCase(element.type));
        }

        protected bindValueToElement(element: HTMLInputElement, propertyValue: any): void {
            element.value = propertyValue || '';
        }

        protected getValueFromElement(element: HTMLInputElement): any {
            let value = element.value;
            return value;
        }
    }

    export class TextArea extends ElementBinder<HTMLTextAreaElement> {

        constructor() {
            super("keyup");
        }

        protected canBind(element: HTMLTextAreaElement): boolean {
            return element instanceof HTMLTextAreaElement;
        }

        protected bindValueToElement(element: HTMLTextAreaElement, propertyValue: any): void {
            element.value = propertyValue || '';
        }

        protected getValueFromElement(element: HTMLTextAreaElement): any {
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

        protected bindValueToElement(element: HTMLInputElement, propertyValue: any): void {
            element.checked = !!(propertyValue || '');
        }

        protected getValueFromElement(element: HTMLInputElement): any {
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
                this.bindValueToElement(element, propertyValue);
            }
            else {
                super.bind(dataModel, element, propertyName, propertyValue, model);
            }
        }

        protected canBind(element: HTMLSelectElement): boolean {
            return element instanceof HTMLSelectElement && !element.hasAttribute('multiple');
        }

        protected bindValueToElement(element: HTMLSelectElement, propertyValue: any): void {
            Attv.toArray(element.options).forEach((opt: HTMLOptionElement) => {
                opt.selected = opt.value?.equalsIgnoreCase(propertyValue);
            });
        }

        protected getValueFromElement(element: HTMLSelectElement): any {
            let selectedOption = element.options[element.selectedIndex];

            return selectedOption.value;
        }

    }

    export class MultiSelect extends Select {

        protected canBind(element: HTMLSelectElement): boolean {
            return element instanceof HTMLSelectElement && element.hasAttribute('multiple');
        }

        protected bindValueToElement(element: HTMLSelectElement, propertyValue: any): void {
            if (Array.isArray(propertyValue)) {
                let array = propertyValue as [];
                Attv.toArray<HTMLOptionElement>(element.options).forEach((opt: HTMLOptionElement) => {
                    opt.selected = array.some(item => item === opt.value);
                });
            } else {
                super.bindValueToElement(element, propertyValue);
            }
        }

        protected getValueFromElement(element: HTMLSelectElement): any {
            let values = Attv.toArray<HTMLOptionElement>(element.selectedOptions).map(opt => opt.value);

            return values;
        }
    }

    export class RadioButton extends ElementBinder<HTMLInputElement> {

        constructor() {
            super("change");
        }
        
        bind(dataModel: DataModel, element: HTMLInputElement, propertyName: string, propertyValue: any, model?: any) {
            super.bind(dataModel, element, propertyName, propertyValue, model);

            if (!dataModel.isLoaded(element)) {
                let observer = new MutationObserver((mutations) => {
                    let valueAttributeMutation = mutations.filter(m => m.type === 'attributes' && m.attributeName.equalsIgnoreCase('value'))[0];
                    if (!valueAttributeMutation)
                        return;
                        
                    this.bindValueToElement(element, propertyValue);
                });
    
                observer.observe(element, { attributes: true });
            }
        }

        protected canBind(element: HTMLInputElement): boolean {
            return(element instanceof HTMLInputElement && element.type?.equalsIgnoreCase("radio"));
        }

        protected bindValueToElement(element: HTMLInputElement, propertyValue: any): void {
            element.checked = element.value === (propertyValue || '');
        }

        protected getValueFromElement(element: HTMLInputElement): any {
            let value = element.value;
            return value;
        }
    }
}