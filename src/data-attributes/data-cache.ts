
namespace Attv {
    export class DataCache extends Attv.Attribute {
        static readonly Key: string = 'data-cache';

        constructor() {
            super(Attv.DataCache.Key);
            this.wildcard = "<boolean>";
            this.isAutoLoad = false;
        }
        
        useCache(element: HTMLElement) {
            let value = this.raw(element);
            if (Attv.isUndefined(value) || value === null)
                return true;
    
            return value?.equalsIgnoreCase('true');
        }
    } 
}

Attv.register(() => new Attv.DataCache());