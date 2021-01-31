namespace Attv {
    export namespace DataId {
        export const Key: string = "data-id";
    }


    export namespace DataRef {
        export const Key: string = "data-ref";
    }
}

Attv.register(Attv.DataId.Key, { isAutoLoad: false });
Attv.register(Attv.DataRef.Key, { isAutoLoad: false });