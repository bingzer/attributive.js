namespace Attv {

    /**
     * [data-table]
     */
    export class DataTable extends Attv.Attribute {
        static readonly UniqueId = 'DataTable';

        constructor () {
            super(DataTable.UniqueId, true);

            this.wildcard = "none";
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {
    

    /**
     * [data-table]="default"
     */
    export class DefaultValue extends Attribute.Value {
        
        constructor (attributeValue: string) {
            super(attributeValue);

            this.validators.push(new Validators.RequiredElement(['table']));
            this.resolver.uses.push(DataTemplate.UniqueId, DataPartial.UniqueId);
        }
    
        /**
         * Find all element and construct
         * @param root the root
         */
        loadElement(element: HTMLElement): boolean {
            if (!this.attribute.isElementLoaded(element)) {
                this.loadSettings<TableSettings>(element, settings => {
                    let dataTemplate = this.resolver.resolve<DataTemplate>(DataTemplate.UniqueId);
                    let dataPartial = this.resolver.resolve<DataPartial>(DataPartial.UniqueId);
    
                    dataTemplate.getValue(element).loadElement(element);
                    dataPartial.getValue(element).loadElement(element);

                    settings.pageNumber = 100;
                    Attv.Attribute.Settings.commit(element, settings);
                });

                return this.attribute.markElementLoaded(element, true);
            }

            return true;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DataPartial //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {
    /**
     * [data-partial]="table"
     */
    export class DataPartialTableValue extends Attv.DataPartial.DefaultValue {
        
        constructor () {
            super('table');

            this.validators.push(new Validators.RequiredAttribute([DataUrl.UniqueId]));
            this.resolver.uses.push(DataTemplateSource.UniqueId, DataTimeout.UniqueId, DataMethod.UniqueId, DataCallback.UniqueId, DataTarget.UniqueId, DataInterval.UniqueId);
        }

        protected getTargetElement(element: HTMLElement): HTMLElement {
            // [data-target]           
            let dataTarget = this.resolver.resolve<DataTarget>(DataTarget.UniqueId);

            let targetElement = (dataTarget.getTargetElement(element) || element).querySelector('tbody');
            if (!targetElement) {
                Attv.log('fatal', 'Unable to find tbody on the element', targetElement);
            }

            return targetElement;
        }

        loadElement(element: HTMLElement): boolean {
            if (!this.attribute.isElementLoaded(element)) {
                this.render(element);
                
                return this.attribute.markElementLoaded(element, true);
            }

            return true;
        }

    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DataTemplate //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {
    /**
     * [data-template]="table"
     */
    export class DataTemplateTableValue extends Attv.DataTemplate.DefaultValue {
        
        constructor () {
            super('table');
            this.validators.push(new Validators.RequiredElement(['table']));
        }

        loadElement(element: HTMLElement): boolean {
            if (!this.attribute.isElementLoaded(element)) {
                let tbody = element.querySelector('tbody');
                let templateHtml = tbody.attvHtml();

                this.resolver.addAttribute(DataTemplateHtml.UniqueId, element, templateHtml);

                tbody.attvHtml('');

                this.attribute.markElementLoaded(element, true);
            }

            return true;
        }

    }
}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Settings //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {
        
    export interface TableSettings extends Attv.Attribute.Settings {
        /**
         * Number of record per paging
         */
        pageSize?: number;

        /**
         * Current page number
         */
        pageNumber?: number;
    }

    export namespace TableSettings {
        export function getStyle(settings: TableSettings): string {
            return `
/* Style the table */
[data-table]
`;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-table', 
        () => new Attv.DataTable(),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTable.DefaultValue(Attv.configuration.defaultTag));
        });

    Attv.registerAttributeValue(Attv.DataTemplate.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTable.DataTemplateTableValue());
        });

    Attv.registerAttributeValue(Attv.DataPartial.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTable.DataPartialTableValue());
        });
});