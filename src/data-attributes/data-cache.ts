namespace Attv.DataCache {
    export const Key: string = "data-cache";

    Attv.register(Attv.DataCache.Key, { wildcard: "<boolean>", isAutoLoad: false });
}