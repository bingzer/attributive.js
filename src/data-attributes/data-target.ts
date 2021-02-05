
namespace Attv {
    export class DataTarget extends Attv.Attribute {
        static readonly Key: string = 'data-target';

        constructor() {
            super(Attv.DataTarget.Key);
            this.wildcard = "<querySelector>";
            this.isAutoLoad = false;
        }

        getTargetElement(element: HTMLElement): HTMLElement {
            let querySelector = this.raw(element);
            try {
                return document.querySelector(querySelector);
            } catch (e) {
                return undefined;
            }
        }
    } 
}

Attv.register(() => new Attv.DataTarget());