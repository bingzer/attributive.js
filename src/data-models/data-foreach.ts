
namespace Attv.DataForEach {
    export const Key = "data-foreach";

    export class Default extends Attv.AttributeValue {

        constructor() {
            super();
            this.deps.internals = [Attv.DataContent.Key, Attv.DataModel.Key];
            this.deps.uses = [Attv.DataId.Key, Attv.DataRef.Key];
        }
        
        load(element: HTMLElement, options: LoadElementOptions): BooleanOrVoid {
            let html = element.outerHTML;
            let dataContent = this.attribute.resolve(Attv.DataContent.Key);
            let dataId = this.attribute.resolve(Attv.DataId.Key);
            let dataRef = this.attribute.resolve(Attv.DataRef.Key);
            let id = element.attvAttr('id') || dataId.raw(element) || Attv.generateElementId('foreach');

            if (!this.attribute.isLoaded(element)) {
                // if it's not leaded
                // add custom attributes
                element.attvAttr(dataContent, html);
                element.attvAttr(dataId, id);
                element.attvHtml('');
            } else {
                // already been loaded
                let refId = element.attvAttr(dataId);
                element.parentElement.querySelectorAll(`[${dataRef.name}='${refId}']`).forEach(child => {
                    child.remove();
                });
            }

            let expression = this.parseExpression(element, options.context);
            expression.array.forEach(item => {
                let context = {};
                context[expression.name] = item;
                
                let template = expression.createTemplate();

                // load the elemen in the template
                Attv.loadElements(template, {
                    includeSelf: true,
                    context: context,
                    contextRefId: id
                }); 

                element.parentElement.appendChild(template);
            });

            // remove all unnecessary contents
            // except for [data-foreach] and [data-content]
            const attributesToKeep = [dataContent.name, dataId.name, this.attribute.name, 'id'];
            let existingAttributes = Attv.toArray<{ name: string }>(element.attributes).map(att => att.name);
            existingAttributes.forEach(name => {
                if (name && !attributesToKeep.some(attributeName => name.equalsIgnoreCase(attributeName))) {
                    element.removeAttribute(name);
                }
            });
            
            return true;
        }

        private parseExpression(element: HTMLElement, context: any): { name: string, array: [], createTemplate: () => HTMLElement } {
            let expression = this.attribute.raw(element);
            let split = expression.split('in');
            let varName = split[0].trim();
            let varsName = split[1].trim();

            let dataContent = this.attribute.resolve(Attv.DataContent.Key);
            let dataId = this.attribute.resolve(Attv.DataId.Key);
            let dataRef = this.attribute.resolve(Attv.DataRef.Key);

            return {
                name: varName,
                array: Attv.DataModel.getProperty(varsName, context) || [],
                createTemplate: () => {
                    let child = Attv.Dom.createHTMLElement(element.tagName, element.attvAttr(dataContent)).firstElementChild as HTMLElement;

                    child.attvAttr(dataRef, element.getAttribute(dataId.name));
                    
                    // IT IS important to remove unnecessary attributes otherwise we stuck in the for-each loops
                    child.removeAttribute('id'); // [id]
                    child.removeAttribute(this.attribute.name); // [data-foreach]
                    child.removeAttribute(this.attribute.loadedName()); // [data-foreach-loadedName]
                    child.removeAttribute(dataContent.name); // [data-foreach]
                    child.removeAttribute(dataContent.loadedName()); // [data-foreach-loadedName]
                    child.removeAttribute(dataId.name); // [data-foreach-loadedName]
                    child.removeAttribute(dataId.loadedName()); // [data-foreach-loadedName]

                    return child;
                }
            };
        }
    }
}

Attv.register(Attv.DataForEach.Key, { wildcard: "*", isAutoLoad: true, priority: 1 }, att => {
    att.map(() => new Attv.DataForEach.Default());
});