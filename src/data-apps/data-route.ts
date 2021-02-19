
namespace Attv {
    export class DataRoute extends Attv.Attribute {
        static readonly Key: string = 'data-route';

        constructor() {
            super(Attv.DataRoute.Key);
            this.isAutoLoad = false;
        } 
    } 
}

Attv.register(() => new Attv.DataRoute());