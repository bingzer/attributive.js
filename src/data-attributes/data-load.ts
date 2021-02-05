
namespace Attv.DataLoad {
    export const Key: string = "data-load";
}

Attv.register(Attv.DataLoad.Key, { isAutoLoad: false, wildcard: "<querySelector>" });