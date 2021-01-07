namespace Attv.JQuery {

    /**
     * [data-jquery]
     */
    export class DataJQuery extends Attv.Attribute {
        static readonly UniqueId = "DataJQuery";

        constructor (public name: string) {
            super(DataJQuery.UniqueId, true);

            this.wildcard = "none";
        }

    }
}