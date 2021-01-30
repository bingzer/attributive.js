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
                let propertyName = this.attribute.raw(element);
                let propertyValue = getProperty(propertyName);

                // TODO: refactor code
                if (element instanceof HTMLInputElement) {
                    (element as HTMLInputElement).value = getProperty(propertyName)
                } else {
                    element.innerHTML = propertyValue;
                }

                return true;
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
                property = property[propertyChilds[j]];
            }

            property[propertyChilds[len-1]] = propertyValue;
        }
    }
}

Attv.register(() => new Attv.DataModel(), att => {
    att.map(() => new Attv.DataModel.Value());
});