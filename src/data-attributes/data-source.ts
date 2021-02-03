
namespace Attv {
    export class DataSource extends Attv.Attribute {
        static readonly Key: string = 'data-source';

        constructor() {
            super(Attv.DataSource.Key);
            this.wildcard = "<querySelector>";
            this.isAutoLoad = false;
        }

        getSourceElement(element: HTMLElement): HTMLElement | undefined {
            let querySelector = this.raw(element);
            try {
                return document.querySelector(querySelector);
            } catch (e) {
                return undefined;
            }
        }
    } 
}

Attv.register(() => new Attv.DataSource());