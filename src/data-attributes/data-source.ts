namespace Attv.DataSource {
    export const Key: string = "data-source";

    Attv.register(Attv.DataSource.Key, { wildcard: "<querySelector>", isAutoLoad: false });
}