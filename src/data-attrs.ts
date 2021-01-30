
namespace Attv.DataAttrs {
    export const Key = "data-attrs";

    export class Default extends Attv.AttributeValue {
        
        load(element: HTMLElement): BooleanOrVoid {
            let json = this.attribute.parseRaw<any>(element);

            Object.keys(json).forEach((key: string) => {
                let attributename = key.underscoreToDash();
                let attributeValue = json[key];
                
                element.attvAttr(attributename, attributeValue);
            });

            return true;
        }
    }
}

Attv.register(Attv.DataAttrs.Key, { wildcard: "<json>", isAutoLoad: true }, att => {
    att.map(() => new Attv.DataAttrs.Default());
});