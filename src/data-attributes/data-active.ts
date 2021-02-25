
namespace Attv {
    export class DataActive extends Attv.Attribute {
        static readonly Key: string = 'data-active';

        constructor() {
            super(Attv.DataActive.Key);
            this.wildcard = "<boolean>";
            this.isAutoLoad = false;
        }
    } 
}

Attv.register(() => new Attv.DataActive());