
namespace Attv.DataForEach {
    export const Key = "data-foreach";

    export class Default extends Attv.AttributeValue {

        constructor() {
            super();
            this.dependencies.internals = [Attv.DataContent.Key];
        }
        
        load(element: HTMLElement): BooleanOrVoid {
            let html = element.attvHtml();

            Attv.addAttribute(DataContent.Key, element, html);

            // remove the content
            element.attvHtml('');

            return Attv.DataForEach.render();
        }
    }

    export function render(): BooleanOrVoid {
        return true;
    }
}

Attv.register(Attv.DataForEach.Key, { wildcard: "*", isAutoLoad: true }, att => {
    att.map(() => new Attv.DataForEach.Default());
});