namespace Attv {
    export class DataModel extends Attv.Attribute {
        static readonly Key: string = 'data-model';

        constructor() {
            super(DataModel.Key);

            this.wildcard = "<jsExpression>";
            this.priority = 3;
            this.isAutoLoad = true;
            this.dependency.uses = [
                Attv.DataBind.Key
            ];
        }

        bindTo(element: HTMLElement, model?: any): BooleanOrVoid {
            let propertyName = this.raw(element);
            let propertyValue = Attv.DataModel.getProperty(propertyName, model);

            // TODO: refactor code
            if (element instanceof HTMLInputElement) {
                let input = element as HTMLInputElement;
                input.value = propertyValue || '';
                if (!this.isLoaded(element)) {
                    input.addEventListener('input', e => {
                        let value = (e.target as any).value;
                        Attv.DataModel.setProperty(propertyName, value, model);
                    });
                }
            } else {
                element.innerHTML = propertyValue;
            }

            return true;
        }

        bindAll(element: HTMLElement, model?: any) {
            let models = element.querySelectorAll(this.selector());
            models.forEach(elem => {
                this.bindTo(elem as HTMLElement, model);
            });
        }
    }

    export namespace DataModel {
        
        export class Value extends Attv.AttributeValue {
            
            load(element: HTMLElement): BooleanOrVoid {
                return (this.attribute as DataModel).bindTo(element);
            }
        }

        /**
         * Returns a property of an object
         * @param model the object
         * @param propertyName the property name
         */
        export function getProperty(propertyName: string, model?: any) {
            if (!model) {
                model = Attv.globalThis$();
            }

            let propertyValue = model;

            if (propertyName === '$' || propertyName === '$root') {
                return propertyValue;
            } 
            else if (propertyName === '$json') {
                return JSON.stringify(propertyValue);
            } 
            else {
                let propertyChilds = propertyName.split('.');
                
                for (var j = 0; j < propertyChilds.length; j++) {
                    try
                    {
                        propertyValue = propertyValue[propertyChilds[j]];
                    }
                    catch (e) {
                        propertyValue = undefined;
                        break;
                    }
                }
            }
    
            return parseJsonOrElse(propertyValue);
        }

        /**
         * Sets a property in an object
         * @param model the object
         * @param propertyName the property name
         * @param propertyValue the property value
         */
        export function setProperty(propertyName: string, propertyValue: any, model: any) {
            if (!model) {
                model = Attv.globalThis$();
            }

            let property = model;
            let propertyChilds = propertyName.split('.');
            
            let len = propertyChilds.length;
            for (let j = 0; j < len - 1; j++) {
                let childProperty = propertyChilds[j];
                property = property[childProperty];

                // throw warning
                if (Attv.isUndefined(property)) {
                    Attv.log('warning', `No property ${childProperty}`, property);
                }
            }

            property[propertyChilds[len-1]] = propertyValue;
        }
    }
}

Attv.register(() => new Attv.DataModel(), att => {
    att.map(() => new Attv.DataModel.Value());
});