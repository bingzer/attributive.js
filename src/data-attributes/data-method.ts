///////////////////// DataMethod ///////////////////////////////////
namespace Attv {
    export class DataMethod extends Attv.Attribute {
        static readonly Key: string = 'data-method';

        constructor() {
            super(Attv.DataMethod.Key);
            this.isAutoLoad = false;
        }

        raw(element: HTMLElement, context?: any, arg?: any): string {
            let rawValue = super.raw(element, context, arg);

            if (!rawValue && element?.tagName?.equalsIgnoreCase('form')) {
                // get from method attribute
                rawValue = element.attvAttr('method') || 'post';
            }

            return rawValue || 'get';
        }
    } 
}

Attv.register(() => new Attv.DataMethod());