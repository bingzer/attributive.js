
namespace Attv {

    export class DataBind extends Attv.Attribute {
        static readonly Key: string = 'data-bind';

        constructor() {
            super(Attv.DataBind.Key);
            this.wildcard = "<jsExpression>";
            this.isAutoLoad = false;
        }

        set(element: HTMLElement, any: any) {
            let value = any?.toString() || '';
            if (element.tagName.equalsIgnoreCase('input')) {
                element.attvAttr('value', value);
            } else {
                element.attvHtml(value);
            }
        }
    }

    export namespace DataBind {

        export interface OnBindElementFound {
            (bindElement: Element, propertyName: string, propertyValue: object): void;
        }

        export function bindElement(parent: HTMLElement, template: HTMLElement, model: any, onBindElementFound?: OnBindElementFound) {
            let dataBind = Attv.getAttribute<DataBind>(Attv.DataBind.Key);        
            let allbinds = template.querySelectorAll(dataBind.toString());
    
            for (let i = 0; i < allbinds.length; i++) {
                let bindElement = allbinds[i] as HTMLElement;
                
                let propName = bindElement.attvAttr(dataBind);
                let propValue = DataBind.getProperty(model, propName);
    
                if (Array.isArray(propValue)) {
                    let array = propValue as [];
                    let parentOfBindElement = bindElement.parentElement;
    
                    bindElement.remove();
    
                    for (let j = 0; j < array.length; j++) {
                        let clonedBindElement = bindElement.cloneNode(true) as HTMLElement;
                        DataBind.bindElement(parentOfBindElement, clonedBindElement, array[j]);
                    }
                }
                else {
                    // set
                    dataBind.set(bindElement, propValue);
                    if (onBindElementFound) {
                        onBindElementFound(bindElement, propName, propValue);
                    }
                    
                    if (parent !== template) {
                        parent.append(template);
                    }
                }
            }
        }

        export function getProperty(model: any, propertyName: string) {
            if (Attv.isUndefined(model)) {
                return undefined;
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

        export function setProperty(model: any, propertyName: string, propertyValue: any) {
            if (Attv.isUndefined(model)) {
                return undefined;
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

Attv.register(() => new Attv.DataBind());