
namespace Attv {
    export class DataCache extends Attv.Attribute {
        static readonly Key: string = 'data-cache';

        constructor() {
            super(Attv.DataCache.Key);
            this.wildcard = "<boolean>";
            this.isAutoLoad = false;
        }
    } 
}

Attv.register(() => new Attv.DataCache());