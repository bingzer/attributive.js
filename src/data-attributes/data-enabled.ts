
namespace Attv {
    export class DataEnabled extends Attv.Attribute {
        static readonly Key: string = 'data-enabled';

        constructor() {
            super(Attv.DataEnabled.Key);
            this.wildcard = "<boolean>";
            this.isAutoLoad = false;
        }

    } 
}

Attv.register(() => new Attv.DataEnabled());