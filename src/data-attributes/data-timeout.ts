
namespace Attv {
    export class DataTimeout extends Attv.Attribute {
        static readonly Key: string = 'data-timeout';

        constructor() {
            super(Attv.DataTimeout.Key);
            this.wildcard = "<number>";
            this.isAutoLoad = false;
        }

        timeout(element: HTMLElement, fn: () => void) {
            let ms = parseInt(this.raw(element));
            DataTimeout.run(fn, ms);
        }

        static run(fn: () => void, ms?: number) {
            if (ms) {
                window.setTimeout(fn, ms);
            } else {
                fn();
            }
        }
    }
}

Attv.register(() => new Attv.DataTimeout());