
namespace Attv.DataForEach {
    export const Key = "data-foreach";

    export class Default extends Attv.AttributeValue {

        constructor() {
            super();
            this.dependencies.internals = [Attv.DataContent.Key];
        }
        
        load(element: HTMLElement): BooleanOrVoid {
            let html = element.attvHtml();
            let expression = this.parseExpression(element);

            Attv.addAttribute(DataContent.Key, element, html);

            // remove the content
            element.attvHtml('');

            return true;
        }

        private parseExpression(element: HTMLElement): { name: string, array: [] } {
            let expression = this.attribute.raw(element);
            let split = expression.split('in');
            let varName = split[0].trim();
            let varsName = split[1].trim();

            return {
                name: varName,
                array: Attv.DataModel.getProperty(varsName)
            };
        }
    }
}

Attv.register(Attv.DataForEach.Key, { wildcard: "*", isAutoLoad: true }, att => {
    att.map(() => new Attv.DataForEach.Default());
});