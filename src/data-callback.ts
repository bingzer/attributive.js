
namespace Attv {
    export class DataCallback extends Attv.Attribute {
        static readonly Key: string = 'data-callback';

        constructor() {
            super(Attv.DataCallback.Key);
            this.wildcard = "<jsExpression>";
        }

        callback(element: HTMLElement): any {
            return this.parseRaw(element);
        }
    } 
}

Attv.register(() => new Attv.DataCallback());