///////////////////// DataMethod ///////////////////////////////////
namespace Attv {
    export class DataCache extends Attv.Attribute {
        static readonly Key: string = 'data-cache';

        constructor() {
            super(Attv.DataData.Key);
            this.wildcard = "<boolean>";
        }
        
        useCache(element: HTMLElement) {
            let value = this.raw(element);
            if (isUndefined(value) || value === null)
                return true;
    
            return value?.equalsIgnoreCase('true');
        }
    } 
}

Attv.register(() => new Attv.DataCache());