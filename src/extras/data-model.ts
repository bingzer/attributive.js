/// <reference path="../attv.ts" />

namespace Attv {
    export class DataModel extends Attv.Attribute {
        static readonly Key: string = 'data-model';

        constructor() {
            super(DataModel.Key);

            this.wildcard = "<jsExpression>";
            this.isAutoLoad = true;
            this.dependency.uses = [
                Attv.DataBind.Key
            ];
        }
    }

    export namespace DataModel {
        
        export class Value extends Attv.AttributeValue {
            
            load(element: HTMLElement): boolean {
                let model = this.getReferencedObject(this.attribute.raw(element));
                
                DataBind.bindElement(element, element, model, (bindElement, propertyName, propertyValue) => {
                    if (bindElement.tagName.equalsIgnoreCase('input')) {
                        if (bindElement.getAttribute('data-input-listener-added') !== 'true') {
                            bindElement.addEventListener('input', (e) => {
                                let newValue = (e.target as any).value;
                                Attv.DataBind.setProperty(model, propertyName, newValue);
                                Attv.loadElements(element.parentElement, true);
                            });
                            bindElement.setAttribute('data-input-listener-added', 'true');
                        }
                    }
                });

                return true;
            }

            private getReferencedObject(name: string) {
                try {
                    return Attv.eval$(name);
                } catch (e) {
                    return {};
                }
            }
        }
    }
}

Attv.register(() => new Attv.DataModel(), att => {
    att.map(() => new Attv.DataModel.Value());
});