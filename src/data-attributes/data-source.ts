
namespace Attv {
    export class DataSource extends Attv.Attribute {
        static readonly Key: string = 'data-source';

        constructor() {
            super(Attv.DataSource.Key);
            this.wildcard = "<querySelector>";
            this.isAutoLoad = false;
        }
    } 
}

Attv.register(() => new Attv.DataSource());