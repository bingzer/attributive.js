namespace Attv.DataModelBehavior {
    export const Key: string = "data-model-behavior";

    export const Settings: Settings = { };

    export interface Settings extends Attv.DataModel.Settings {

    }
}

Attv.register(Attv.DataModelBehavior.Key, { wildcard: "<json>", isAutoLoad: false });