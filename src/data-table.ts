namespace Attv {

    /**
     * [data-tab]
     */
    export class DataTable extends Attv.Attribute {
        static readonly UniqueId = 'DataTable';

        constructor (public name: string) {
            super(DataTable.UniqueId, name, true);

            this.isStrict = true;
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
        
        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            settingsFn?: Attv.Attribute.SettingsFactory,
            validators: Validators.AttributeValidator[] = [
                new Validators.RequiredElementValidator(['table'])
            ]) {
            super(attributeValue, attribute, settingsFn, validators);

            this.resolver.uses.push(DataRoute.UniqueId, DataOptions.UniqueId);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Settings //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {

    export interface DefaultOptions {
    }
        
    export class DefaultSettings extends Attv.Attribute.Settings {
        style = `
/* Style the table */
[data-table]
`;
    }
}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-table', 
        (attributeName: string) => new Attv.DataTable(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTable.DefaultValue(Attv.configuration.defaultTag, attribute, (name, value) => new Attv.DataTable.DefaultSettings(name, value)));
        });
});