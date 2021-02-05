
namespace Attv {
    export class DataEnabled extends Attv.Attribute {
        static readonly Key: string = 'data-enabled';

        constructor() {
            super(Attv.DataEnabled.Key);
            this.wildcard = "<boolean>";
            this.isAutoLoad = false;
        }

        /**
         * Assume everything is enabled except when specifically set to 'false'
         * @param element the element
         */
        isEnabled(element: HTMLElement) {
            let rawValue = this.raw(element);

            return !rawValue?.equalsIgnoreCase('false');
        }
    } 
}

Attv.register(() => new Attv.DataEnabled());