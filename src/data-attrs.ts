
namespace Attv.DataAttrs {
    export const Key = "data-attrs";

    export class Default extends Attv.AttributeValue {
        
        load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
            let json = this.attribute.parseRaw<any>(element, options.context);

            if (json) {
                Object.keys(json).forEach((key: string) => {
                    let attributeName = key.underscoreToDash();
                    let attributeValue = json[key];
                    
                    element.attvAttr(attributeName, attributeValue);
                });
            }

            return true;
        }
    }
}

Attv.register(Attv.DataAttrs.Key, { wildcard: "<json>", isAutoLoad: true }, att => {
    att.map(() => new Attv.DataAttrs.Default());
});