///////////////////// DataMethod ///////////////////////////////////
namespace Attv {
    export class DataMethod extends Attv.Attribute {
        // static readonly Key: string = 'data-method';
        // static getMethod(element: HTMLElement): Ajax.AjaxMethod {
        //     return Attv.resolve(this.Key).raw(element) as Ajax.AjaxMethod;
        // }

        constructor(key: string) {
            super(key);
        }

        raw(element: HTMLElement): string {
            let rawValue = ''; // super.raw(element);

            if (!rawValue && element?.tagName?.equalsIgnoreCase('form')) {
                // get from method attribute
                rawValue = element.attvAttr('method');
            }

            return rawValue || 'get';
        }
    }
}

Attv.register('data-method', { create: (key) => new Attv.DataMethod(key) }, att => {
    att.map(() => new Attv.AttributeValue('default'));
});
