
namespace Attv.DataForEach {
    export const Key = "data-foreach";

    export class Default extends Attv.AttributeValue {

        constructor() {
            super();
            this.dependencies.internals = [Attv.DataContent.Key, Attv.DataModel.Key];
            this.dependencies.uses = [Attv.DataId.Key, Attv.DataRef.Key];
        }
        
        load(element: HTMLElement): BooleanOrVoid {
            let html = element.attvHtml();
            let dataContent = this.attribute.resolve(Attv.DataContent.Key);
            let dataId = this.attribute.resolve(Attv.DataId.Key);

            // add custom attributes
            element.attvAttr(dataContent, html);
            element.attvAttr(dataId, Attv.generateElementId('foreach'));
            element.attvHtml('');

            let expression = this.parseExpression(element);
            let dataModel = this.attribute.resolve<DataModel>(Attv.DataModel.Key);
            expression.array.forEach(item => {
                let context = {};
                context[expression.name] = item;
                
                let template = expression.createTemplate();
                
                // datamodel bind all
                dataModel.bindAll(template, context);

                element.parentElement.append(template);
            });

            // remove all unnecessary contents
            // except for [data-foreach] and [data-content]
            const selectors = [dataContent.name, dataId.name, this.attribute.name];
            for(let i = 0; i < element.attributes.length; i++) {
                let att = element.attributes[i];
                if (!selectors.some(selector => att.name.equalsIgnoreCase(selector))) {
                    element.removeAttribute(att.name);
                }
            }


            return true;
        }

        private parseExpression(element: HTMLElement): { name: string, array: [], createTemplate: () => HTMLElement } {
            let expression = this.attribute.raw(element);
            let split = expression.split('in');
            let varName = split[0].trim();
            let varsName = split[1].trim();

            let dataContent = this.attribute.resolve(Attv.DataContent.Key);
            let dataId = this.attribute.resolve(Attv.DataId.Key);
            let dataRef = this.attribute.resolve(Attv.DataRef.Key);

            return {
                name: varName,
                array: Attv.DataModel.getProperty(varsName) || [],
                createTemplate: () => {
                    let child = Attv.Dom.createHTMLElement(element.tagName, element.attvAttr('data-content'))
                    child.attvAttr(dataRef, element.getAttribute(dataId.name));

                    for(let i = 0; i < element.attributes.length; i++) {
                        let att = element.attributes[i];
                        child.setAttribute(att.name, att.value);
                    }
                    
                    // remove unnecessary attributes
                    child.removeAttribute(this.attribute.name); // [data-foreach]
                    child.removeAttribute(this.attribute.loadedName()); // [data-foreach-loadedName]
                    child.removeAttribute(dataContent.name); // [data-foreach]
                    child.removeAttribute(dataContent.loadedName()); // [data-foreach-loadedName]

                    return child;
                }
            };
        }
    }
}

Attv.register(Attv.DataForEach.Key, { wildcard: "*", isAutoLoad: true }, att => {
    att.map(() => new Attv.DataForEach.Default());
});