namespace Attv.DataPartialCall {
    export type Call = (data: any, error: Error) => void;


    export const Key: string = "data-partial-call";
    
    Attv.register(Attv.DataPartialCall.Key, { wildcard: "<jsExpression>", isAutoLoad: false });
}