namespace Attv.DataIf {
    export const Key = "data-if";

    export class Default extends Attv.AttributeValue {
        
        load(element: HTMLElement, options: LoadElementOptions): BooleanOrVoid {
            let expression = this.attribute.raw(element, options.context);
            let aliasExpression = new Attv.Expressions.AliasExpression(expression);
            
            let value = aliasExpression.evaluate(options?.context);
            if (value?.filtered) {
                element.attvShow();
            } else {
                element.attvHide();
            }
            
            return true;
        }

    }
}

Attv.register(Attv.DataIf.Key, { wildcard: "<jsExpression>", isAutoLoad: true, priority: 0 }, att => {
    att.map(() => new Attv.DataIf.Default());
});