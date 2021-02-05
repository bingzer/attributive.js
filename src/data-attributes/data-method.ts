///////////////////// DataMethod ///////////////////////////////////
namespace Attv {
    export class DataMethod extends Attv.Attribute {
        static readonly Key: string = 'data-method';

        constructor() {
            super(Attv.DataMethod.Key);
            this.isAutoLoad = false;
        }

        raw(element: HTMLElement): string {
            let rawValue = super.raw(element);

            if (!rawValue && element?.tagName?.equalsIgnoreCase('form')) {
                // get from method attribute
                rawValue = element.attvAttr('method');
            }

            return rawValue || 'get';
        }

        getMethod(element: HTMLElement): Ajax.AjaxMethod {
            return this.raw(element) as Ajax.AjaxMethod;
        }
    } 
}

Attv.register(() => new Attv.DataMethod());