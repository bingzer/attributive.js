namespace Attv.Binders {
        
    export abstract class ElementBinder<TElement extends HTMLElement> {

        constructor(private eventName?: string, private broadcastEvent: string = "change") {
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
            this.bindValueToElement(dataModel, element, propertyValue);

            if (!dataModel.isLoaded(element) && !!this.eventName) {
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
        protected abstract bindValueToElement(dataModel: DataModel, element: TElement, propertyValue: any): void;
        protected abstract getValueFromElement(element: TElement): any;

        protected broadcast(dataModel: DataModel, element: TElement, options: LoadElementOptions) {
            let dataLoad = dataModel.resolve(Attv.DataLoad.Key);
            let selectors = dataLoad.raw(element);

            Attv.loadElements(selectors, options);
        }

    }

    /**
     * Any element
     */
    export class Default extends ElementBinder<HTMLElement> {
        
        bind(dataModel: DataModel, element: HTMLElement, propertyName: string, propertyValue: any, model?: any) {
            this.bindValueToElement(dataModel, element, propertyValue);
        }

        protected canBind(element: HTMLElement): boolean {
            return true;
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLElement, propertyValue: any): void {
            element.innerHTML = propertyValue || '';
        }

        protected getValueFromElement(element: HTMLElement): any {
            return undefined;
        }
    }

    /**
     * <input type="text">
     */
    export class Text extends ElementBinder<HTMLInputElement> {

        readonly types: string[] = [ "text", "password", "email", "number", "tel", "color", "date", "datetime-local", "file", "hidden", "image", "month", "range", "url", "week" ];

        constructor() {
            super("input");
        }

        protected canBind(element: HTMLInputElement): boolean {
            return element instanceof HTMLInputElement && this.types.some(t => t.equalsIgnoreCase(element.type));
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLInputElement, propertyValue: any): void {
            element.value = propertyValue || '';
        }

        protected getValueFromElement(element: HTMLInputElement): any {
            let value = element.value;
            return value;
        }
    }

    /**
     * <textarea>
     */
    export class TextArea extends ElementBinder<HTMLTextAreaElement> {

        constructor() {
            super("keyup");
        }

        protected canBind(element: HTMLTextAreaElement): boolean {
            return element instanceof HTMLTextAreaElement;
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLTextAreaElement, propertyValue: any): void {
            element.value = propertyValue || '';
        }

        protected getValueFromElement(element: HTMLTextAreaElement): any {
            let value = element.value;
            return value;
        }
    }

    /**
     * <input type="checkbox">
     */
    export class Checkbox extends ElementBinder<HTMLInputElement> {

        constructor() {
            super("change");
        }

        protected canBind(element: HTMLInputElement): boolean {
            return(element instanceof HTMLInputElement && element.type?.equalsIgnoreCase("checkbox"));
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLInputElement, propertyValue: any): void {
            element.checked = !!(propertyValue || '');
        }

        protected getValueFromElement(element: HTMLInputElement): any {
            let value = element.checked;
            return value;
        }

    }

    /**
     * <select>
     */
    export class Select extends ElementBinder<HTMLSelectElement> {

        constructor() {
            super("change");
        }
        
        bind(dataModel: DataModel, element: HTMLSelectElement, propertyName: string, propertyValue: any, model?: any) {
            if (dataModel.isLoaded(element)) {
                Attv.reloadElements(element.querySelector('option'));
                this.bindValueToElement(dataModel, element, propertyValue);
            }
            else {
                super.bind(dataModel, element, propertyName, propertyValue, model);
            }
        }

        protected canBind(element: HTMLSelectElement): boolean {
            return element instanceof HTMLSelectElement && !element.hasAttribute('multiple');
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLSelectElement, propertyValue: any): void {
            Attv.toArray(element.options).forEach((opt: HTMLOptionElement) => {
                opt.selected = opt.value?.equalsIgnoreCase(propertyValue);
            });
        }

        protected getValueFromElement(element: HTMLSelectElement): any {
            let selectedOption = element.options[element.selectedIndex];

            return selectedOption.value;
        }

    }

    /**
     * <select multiple>
     */
    export class MultiSelect extends Select {

        protected canBind(element: HTMLSelectElement): boolean {
            return element instanceof HTMLSelectElement && element.hasAttribute('multiple');
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLSelectElement, propertyValue: any): void {
            if (Array.isArray(propertyValue)) {
                let array = propertyValue as [];
                Attv.toArray<HTMLOptionElement>(element.options).forEach((opt: HTMLOptionElement) => {
                    opt.selected = array.some(item => item === opt.value);
                });
            } else {
                super.bindValueToElement(dataModel, element, propertyValue);
            }
        }

        protected getValueFromElement(element: HTMLSelectElement): any {
            let values = Attv.toArray<HTMLOptionElement>(element.selectedOptions).map(opt => opt.value);

            return values;
        }
    }

    /**
     * <input type="radio">
     */
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
                        
                    this.bindValueToElement(dataModel, element, propertyValue);
                });
    
                observer.observe(element, { attributes: true });
            }
        }

        protected canBind(element: HTMLInputElement): boolean {
            return(element instanceof HTMLInputElement && element.type?.equalsIgnoreCase("radio"));
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLInputElement, propertyValue: any): void {
            element.checked = element.value === (propertyValue || '');
        }

        protected getValueFromElement(element: HTMLInputElement): any {
            let value = element.value;
            return value;
        }
    }

    /**
     * <table>
     */
    export class Table extends ElementBinder<HTMLTableElement> {
        
        bind(dataModel: DataModel, element: HTMLTableElement, propertyName: string, propertyValue: any, model?: any) {
            this.bindValueToElement(dataModel, element, propertyValue);
        }

        protected canBind(element: HTMLTableElement): boolean {
            return element instanceof HTMLTableElement;
        }

        protected bindValueToElement(dataModel: DataModel, table: HTMLTableElement, propertyValue: any): void {
            if (Array.isArray(propertyValue)) {
                let array = propertyValue as any[];
                let headers = this.parseHeaders(dataModel, table, array[0]);
                
                this.bindArrayToElement(table, headers, array);
            } else {
                throw new Error();
            }
        }

        protected getValueFromElement(element: HTMLTableElement): any {
            return undefined;
        }

        // ------------------------------------------------------------ //

        private parseHeaders(dataModel: DataModel, table: HTMLTableElement, any: object): string[] {
            let settings = dataModel.getSettings<any>(table);
            let headers = settings?.headers as string[];

            return headers || Object.keys(any);
        }

        private bindArrayToElement(table: HTMLTableElement, headers: string[], array: any[]) {
            // -- thead
            let thead = table.createTHead();
            let tr = document.createElement('tr');
            thead.append(tr);
            headers.forEach(head => {
                let th = document.createElement('th');
                th.innerHTML = head;

                tr.append(th);
            });

            // -- tbody
            let tbody = table.createTBody();
            array.forEach(item => {
                let tr = document.createElement('tr');
                headers.forEach(head => {
                    let td = document.createElement('td');

                    td.innerHTML = item[head];

                    tr.append(td);
                });

                tbody.append(tr);
            });

            table.append(thead);
            table.append(tbody);
        }
    }
}