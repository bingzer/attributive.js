
namespace Attv.DataForEach {
    export const Key = "data-foreach";

    export class Default extends Attv.AttributeValue {

        constructor() {
            super();
            this.dependencies.internals = [Attv.DataContent.Key, Attv.DataModel.Key];
        }
        
        load(element: HTMLElement): BooleanOrVoid {
            let html = element.attvHtml();

            Attv.addAttribute(DataContent.Key, element, html);

            // remove the content
            element.attvHtml('');

            let expression = this.parseExpression(element);
            let dataModel = this.attribute.resolve<DataModel>(Attv.DataModel.Key);
            expression.array.forEach(item => {
                let context = {};
                context[expression.name] = item;
                
                let template = expression.createTemplate();
                
                // datamodel bind all
                dataModel.bindAll(template, context);

                element.append(template);
            });


            return true;
        }

        private parseExpression(element: HTMLElement): { name: string, array: [], createTemplate: () => HTMLElement } {
            let expression = this.attribute.raw(element);
            let split = expression.split('in');
            let varName = split[0].trim();
            let varsName = split[1].trim();

            return {
                name: varName,
                array: Attv.DataModel.getProperty(varsName) || [],
                createTemplate: () => Attv.Dom.createHTMLElement(element.tagName, element.attvAttr('data-content'))
            };
        }
    }
}

Attv.register(Attv.DataForEach.Key, { wildcard: "*", isAutoLoad: true }, att => {
    att.map(() => new Attv.DataForEach.Default());
});