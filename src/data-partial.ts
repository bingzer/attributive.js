/// <reference path="attv.ts" />

namespace Attv {
    export class DataPartial extends Attv.Attribute {
        
        static readonly Key: string = 'data-partial';

        constructor() {
            super(DataPartial.Key);
            this.isAutoLoad = true;
        }

        renderPartial(element: HTMLElement | string, content?: string): void {
            if (Attv.isString(element)) {
                element = document.querySelector(element as string) as HTMLElement;
            }
    
            let htmlElement = element as HTMLElement;
    
            let attribute = Attv.getAttribute(Attv.DataPartial.Key);
            let attributeValue = attribute.getValue(element as HTMLElement);
    
            throw new Error('todo');
        }
    }

    export namespace DataPartial {

        export class Value extends Attv.AttributeValue {
            constructor(value?: string) {
                super(value);
            }
        }
    
        export class Lazy extends Attv.AttributeValue {
            constructor() {
                super('lazy');
            }
        }
    
        export class Click extends Attv.AttributeValue {
            constructor() {
                super('click');
            }
        }
    
        export class Form extends Attv.AttributeValue {
            constructor() {
                super('form');
            }
        }
    }
}

Attv.register(() => new Attv.DataPartial(), att => {
    att.map(() => new Attv.DataPartial.Value());
    att.map(() => new Attv.DataPartial.Value('auto'));
    att.map(() => new Attv.DataPartial.Lazy());
    att.map(() => new Attv.DataPartial.Form());
    att.map(() => new Attv.DataPartial.Click());
});