
namespace Attv {
    export class DataTemplateSource extends Attv.Attribute {
        static readonly Key: string = 'data-template-source';

        constructor() {
            super(Attv.DataTemplateSource.Key);

            this.wildcard = "<querySelector>";
            this.isAutoLoad = false;
        }

        renderTemplate(element: HTMLElement, model: any): string {
            let templateElement = this.getSourceElement(element);

            let dataTemplate = this.resolve<DataTemplate>(Attv.DataTemplate.Key);
            return dataTemplate.renderTemplate(templateElement, model);
        }

        getSourceElement(element: HTMLElement): HTMLElement {
            return this.parseRaw<HTMLElement>(element);
        }
    } 
}

Attv.register(() => new Attv.DataTemplateSource());