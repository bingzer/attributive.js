namespace Attv {


    export class DataTemplate extends Attv.DataAttribute {

        constructor (public attributeName: string, public renderer: DataTemplate.Renderers.Renderer = new DataTemplate.Renderers.DefaultRenderer()) {
            super(attributeName, true);
        }

    }

    
    // --- DataPartial Renderer

    export namespace DataTemplate.Renderers {

        export interface Renderer {
            render(dataAttribute: DataAttribute, element: HTMLElement, content: string | any);
        }

        export class DefaultRenderer implements Renderer {
            render(dataAttribute: DataAttribute, element: HTMLElement, content: string | any) {
                element.innerHTML = content;

                Attv.loadElements(element);
            }
        }
    }

}

Attv.loader.pre.push(() => {
    Attv.registerDataAttribute('data-template', (attributeName) => new Attv.DataTemplate(attributeName));
});