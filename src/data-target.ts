
namespace Attv {
    export class DataTarget extends Attv.Attribute {
        static readonly Key: string = 'data-target';

        constructor() {
            super(Attv.DataTarget.Key);
            this.wildcard = "<querySelector>";
        }

        getTargetElement(element: HTMLElement): HTMLElement {
            return this.parseRaw<HTMLElement>(element);
        }
    } 
}

Attv.register(() => new Attv.DataTarget());