namespace Attv.Binders {

    export type HTMLListELement = HTMLUListElement | HTMLOListElement | HTMLDListElement;
        
    /**
     * Base class for binder
     */
    export abstract class Binder<TElement extends HTMLElement> {

        accept(dataModel: DataModel, element: TElement, refId?: string): boolean {
            if (!this.canBind(element))
                return false;

            // compare context
            let dataModelContext = dataModel.resolve(Attv.DataModelContext.Key);
            return element.attvAttr(dataModelContext) === refId;
        }

        stamp(dataModel: DataModel, element: TElement, refId: string) {
            if (refId) {
                let dataModelContext = dataModel.resolve(Attv.DataModelContext.Key);
                element.attvAttr(dataModelContext, refId);
            }
        }

        abstract bind(dataModel: DataModel, element: TElement, expression: AliasExpression, model?: any): void;

        protected abstract canBind(element: TElement): boolean;
        protected abstract bindValueToElement(dataModel: DataModel, element: TElement, expression: AliasExpression, model?: any): void;

    }

    /**
     * One-way binder
     */
    export abstract class OneWayBinder<TElement extends HTMLElement> extends Binder<TElement> {
        bind(dataModel: DataModel, element: TElement, expression: AliasExpression, model?: any) {
            this.bindValueToElement(dataModel, element, expression, model);
        }
    }

    /**
     * Two-way binder
     */
    export abstract class TwoWayBinder<TElement extends HTMLElement> extends Binder<TElement> {

        constructor(private eventName?: string) {
            super();
        }

        bind(dataModel: DataModel, element: TElement, expression: AliasExpression, model?: any): void {
            this.bindValueToElement(dataModel, element, expression, model);

            if (!dataModel.isLoaded(element) && !!this.eventName) {
                element.addEventListener(this.eventName, e => {
                    let value = this.getValueFromElement(element);
                    Attv.DataModel.setProperty(expression.propertyName, value, model);

                    // data load
                    this.broadcast(dataModel, element, { forceReload: true });
                });
            };
        }

        protected abstract getValueFromElement(element: TElement): any;
        
        protected broadcast(dataModel: DataModel, element: TElement, options: LoadElementOptions) {
            let dataLoad = dataModel.resolve(Attv.DataLoad.Key);
            let selectors = dataLoad.raw(element);

            Attv.loadElements(selectors, options);
        }

    }

    // ---------------------------------- two-way binder -------------------------------------------------//

    /**
     * <input type="text">
     */
    export class Text extends TwoWayBinder<HTMLInputElement> {

        readonly types: string[] = [ "text", "password", "email", "number", "tel", "color", "date", "datetime-local", "file", "hidden", "image", "month", "range", "url", "week" ];

        constructor() {
            super("input");
        }

        protected canBind(element: HTMLInputElement): boolean {
            return element instanceof HTMLInputElement && this.types.some(t => t.equalsIgnoreCase(element.type));
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLInputElement, expression: AliasExpression, model?: any): void {
            element.value = expression.evaluate(model).filtered;
        }

        protected getValueFromElement(element: HTMLInputElement): any {
            let value = element.value;
            return value;
        }
    }

    /**
     * <textarea>
     */
    export class TextArea extends TwoWayBinder<HTMLTextAreaElement> {

        constructor() {
            super("keyup");
        }

        protected canBind(element: HTMLTextAreaElement): boolean {
            return element instanceof HTMLTextAreaElement;
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLTextAreaElement, expression: AliasExpression, model?: any): void {
            element.value = expression.evaluate(model).filtered;
        }

        protected getValueFromElement(element: HTMLTextAreaElement): any {
            let value = element.value;
            return value;
        }
    }

    /**
     * <input type="checkbox">
     */
    export class Checkbox extends TwoWayBinder<HTMLInputElement> {

        constructor() {
            super("change");
        }

        protected canBind(element: HTMLInputElement): boolean {
            return(element instanceof HTMLInputElement && element.type?.equalsIgnoreCase("checkbox"));
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLInputElement, expression: AliasExpression, model?: any): void {
            element.checked = !!(expression.evaluate(model).value);
        }

        protected getValueFromElement(element: HTMLInputElement): any {
            let value = element.checked;
            return value;
        }

    }

    /**
     * <select>
     */
    export class Select extends TwoWayBinder<HTMLSelectElement> {

        constructor() {
            super("change");
        }
        
        bind(dataModel: DataModel, element: HTMLSelectElement, expression: AliasExpression, model?: any): void {
            if (dataModel.isLoaded(element)) {
                Attv.loadElements(element.querySelector('option'), { forceReload: true });
                this.bindValueToElement(dataModel, element, expression, model);
            }
            else {
                super.bind(dataModel, element, expression, model);
            }
        }

        protected canBind(element: HTMLSelectElement): boolean {
            return element instanceof HTMLSelectElement && !element.hasAttribute('multiple');
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLSelectElement, expression: AliasExpression, model?: any): void {
            let propertyValue = expression.evaluate(model).filtered;

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

        protected bindValueToElement(dataModel: DataModel, element: HTMLSelectElement, expression: AliasExpression, model?: any): void {
            let result = expression.evaluate(model);
            
            if (Array.isArray(result.value)) {
                let array = result.value as [];
                Attv.toArray<HTMLOptionElement>(element.options).forEach((opt: HTMLOptionElement) => {
                    opt.selected = array.some(item => item === opt.value);
                });
            } else {
                super.bindValueToElement(dataModel, element, expression, model);
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
    export class RadioButton extends TwoWayBinder<HTMLInputElement> {

        constructor() {
            super("change");
        }
        
        bind(dataModel: DataModel, element: HTMLInputElement, expression: AliasExpression, model?: any): void {
            super.bind(dataModel, element, expression, model);

            if (!dataModel.isLoaded(element)) {
                let observer = new MutationObserver((mutations) => {
                    let valueAttributeMutation = mutations.filter(m => m.type === 'attributes' && m.attributeName.equalsIgnoreCase('value'))[0];
                    if (!valueAttributeMutation)
                        return;
                        
                    this.bindValueToElement(dataModel, element, expression, model);
                });
    
                observer.observe(element, { attributes: true });
            }
        }

        protected canBind(element: HTMLInputElement): boolean {
            return(element instanceof HTMLInputElement && element.type?.equalsIgnoreCase("radio"));
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLInputElement, expression: AliasExpression, model?: any): void {
            element.checked = element.value === expression.evaluate(model).value;
        }

        protected getValueFromElement(element: HTMLInputElement): any {
            let value = element.value;
            return value;
        }
    }

    // ---------------------------------- one-way binder -------------------------------------------------//

    /**
     * Any element
     */
    export class Default extends OneWayBinder<HTMLElement> {
        
        bind(dataModel: DataModel, element: HTMLElement, expression: AliasExpression, model?: any): void {
            this.bindValueToElement(dataModel, element, expression, model);
        }

        protected canBind(element: HTMLElement): boolean {
            return true;
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLElement, expression: AliasExpression, model?: any): void {
            element.innerHTML = expression.evaluate(model).filtered;
        }
    }

    /**
     * <table>
     */
    export class Table extends OneWayBinder<HTMLTableElement> {
        
        bind(dataModel: DataModel, element: HTMLTableElement, expression: AliasExpression, model?: any): void {
            this.bindValueToElement(dataModel, element, expression, model);
        }

        protected canBind(element: HTMLTableElement): boolean {
            return element instanceof HTMLTableElement;
        }

        protected bindValueToElement(dataModel: DataModel, table: HTMLTableElement, expression: AliasExpression, model?: any): void {
            let result = expression.evaluate(model);

            if (Array.isArray(result.value)) {
                let array = result.filtered as any[];
                let headers = this.parseHeaders(dataModel, table, array[0]);
                
                this.bindArrayToElement(table, headers, array);
            } else {
                throw new Error();
            }
        }

        // ------------------------------------------------------------ //

        private parseHeaders(dataModel: DataModel, table: HTMLTableElement, any: object): AliasExpression[] {
            let settings = dataModel.getSettings<any>(table);
            let headers = settings?.headers as string[];

            return (headers || Object.keys(any)).map<AliasExpression>(head => new AliasExpression(head));
        }

        private bindArrayToElement(table: HTMLTableElement, headers: AliasExpression[], array: any[]) {
            // -- thead
            let thead = table.createTHead();
            let tr = document.createElement('tr');
            thead.append(tr);
            headers.forEach(head => {
                let th = document.createElement('th');
                th.innerHTML = head.alias;

                tr.append(th);
            });

            // -- tbody
            let tbody = table.createTBody();
            array.forEach(item => {
                let tr = document.createElement('tr');
                headers.forEach(head => {
                    let td = document.createElement('td');

                    td.innerHTML = head.evaluate(item).filtered;

                    tr.append(td);
                });

                tbody.append(tr);
            });

            table.append(thead);
            table.append(tbody);
        }
    }

    /**
     * <ul>/<ol>
     */
    export class List extends OneWayBinder<HTMLListELement> {

        protected canBind(element: HTMLListELement): boolean {
            return element instanceof HTMLOListElement || element instanceof HTMLUListElement || element instanceof HTMLDListElement;
        }

        protected bindValueToElement(dataModel: DataModel, element: HTMLListELement, expression: AliasExpression, model?: any): void {
            let result = expression.evaluate(model);

            if (Array.isArray(result.value)) {
                let array = result.filtered as any[];
                array.forEach(item => {
                    let li = element instanceof HTMLDListElement ? document.createElement('dt') : document.createElement('li');
                    let expression = this.parseItemExpression(dataModel, element, model);
                    li.innerHTML = expression.evaluate(item).filtered;

                    element.append(li);
                });
            } else {
                throw new Error();
            }
        }

        private parseItemExpression(dataModel: DataModel, element: HTMLListELement, any: object): AliasExpression {
            let settings = dataModel.getSettings<any>(element);
            let itemExpression = settings?.item as string || "";

            return new AliasExpression(itemExpression);
        }
    }
}