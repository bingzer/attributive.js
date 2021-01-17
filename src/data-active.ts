
namespace Attv {
    export class DataActive extends Attv.Attribute {
        static readonly Key: string = 'data-active';

        constructor() {
            super(Attv.DataActive.Key);
            this.wildcard = "<boolean>";
        }
        
        isActive(element: HTMLElement) {
            let rawValue = this.raw(element);

            return rawValue?.equalsIgnoreCase('true');
        }

        setActive(element: HTMLElement, isActive: boolean) {
            element.attvAttr(this, isActive);
        }
    } 
}

Attv.register(() => new Attv.DataActive());