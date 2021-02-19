
namespace Attv.DataAttrs {
    export const Key = "data-attrs";

    export class Default extends Attv.AttributeValue {
        
        load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
            try {
                let json = this.attribute.parseRaw<any>(element, options?.context);
    
                if (json) {
                    Object.keys(json).forEach((key: string) => {
                        let attributeName = key.underscoreToDash();
                        let attributeValue = json[key];

                        // ignore recursive
                        if (attributeName.equalsIgnoreCase(this.attribute.name))
                            return;

                        // special attribute
                        // that requires special handling
                        if (attributeName?.equalsIgnoreCase('disabled') && !attributeValue) {
                            // remove if exists
                            element.removeAttribute('disabled');
                            return;
                        }
                        
                        element.attvAttr(attributeName, attributeValue);
                    });
                }
            } catch (e) {
                if (!options?.forceReload)
                    throw e;
            }

            return true;
        }
    }
}

Attv.register(Attv.DataAttrs.Key, { wildcard: "<json>", isAutoLoad: true }, att => {
    att.map(() => new Attv.DataAttrs.Default());
});