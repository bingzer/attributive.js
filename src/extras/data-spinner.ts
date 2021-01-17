
namespace Attv {
    export class DataSpinner extends Attv.Attribute {
        static readonly Key: string = 'data-spinner';

        constructor() {
            super(Attv.DataSpinner.Key);

            this.wildcard = "none";
        }

        bind(element: HTMLElement, any: any) {
            element.attvHtml(any?.toString() || '');
        }
    } 

    export namespace DataSpinner {
        export class Default extends Attv.AttributeValue {
            load(element: HTMLElement): boolean {
                throw new Error('Not implemented');
            }
        }
    }
}

Attv.register(() => new Attv.DataSpinner(), att => {
    att.map(() => new Attv.DataSpinner.Default());
});