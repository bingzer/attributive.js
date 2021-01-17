///////////////////// DataMethod ///////////////////////////////////
namespace Attv {
    export class DataData extends Attv.Attribute {
        static readonly Key: string = 'data-data';

        constructor() {
            super(Attv.DataData.Key);
            this.wildcard = "<json>";
        }
        
        getData(element: HTMLElement) {
            let rawValue = Attv.getAttribute(Key).raw(element);
            return Attv.parseJsonOrElse<any>(rawValue);
        }
    } 
}

Attv.register(() => new Attv.DataData());