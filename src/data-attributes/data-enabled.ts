namespace Attv.DataEnabled {
    export const Key: string = "data-enabled";

    Attv.register(Attv.DataEnabled.Key, { wildcard: "<boolean>", isAutoLoad: false });
}
