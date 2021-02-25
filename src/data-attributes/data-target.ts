
namespace Attv {
    export class DataTarget extends Attv.Attribute {
        static readonly Key: string = 'data-target';

        constructor() {
            super(Attv.DataTarget.Key);
            this.wildcard = "<querySelector>";
            this.isAutoLoad = false;
        }
    } 
}

Attv.register(() => new Attv.DataTarget());