
namespace Attv {
    export class DataBind extends Attv.Attribute {
        static readonly Key: string = 'data-bind';

        constructor() {
            super(Attv.DataBind.Key);
            this.wildcard = "<jsExpression>";
            this.isAutoLoad = false;
        }

        bind(element: HTMLElement, any: any) {
            element.attvHtml(any?.toString() || '');
        }
    } 
}

Attv.register(() => new Attv.DataBind());