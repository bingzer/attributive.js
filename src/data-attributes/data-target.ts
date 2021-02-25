namespace Attv.DataTarget {
    export const Key: string = "data-target";

    Attv.register(Attv.DataTarget.Key, { wildcard: "<querySelector>", isAutoLoad: false });
}