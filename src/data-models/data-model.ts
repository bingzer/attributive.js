namespace Attv {
    export class DataModel extends Attv.Attribute {
        static readonly Key: string = 'data-model';

        readonly handlers: Attv.Binders.ElementBinder<HTMLElement>[];

        constructor() {
            super(DataModel.Key);
            this.wildcard = "<jsExpression>";
            this.priority = 0;
            this.isAutoLoad = true;
            this.handlers = [
                new Attv.Binders.Text(),
                new Attv.Binders.Select(),
                new Attv.Binders.Checkbox(),
                new Attv.Binders.RadioButton(),
                new Attv.Binders.Default()
            ];
        }

        /**
         * Bind model into this element
         * @param element the element to bind
         * @param model the model
         */
        bindTo(element: HTMLElement, model?: any): BooleanOrVoid {
            let propertyName = this.raw(element);
            if (!propertyName)
                return false;

            let propertyValue = Attv.DataModel.getProperty(propertyName, model);

            let handler = this.handlers.filter(handler => handler.accept(element))[0];
            handler.bind(this, element, propertyName, propertyValue, model);

            return true;
        }

        /**
         * Bind all elements under the parent. 
         * The parent will not get bounded. 
         * @param parent the root or the parent
         * @param model the model
         */
        bindAll(parent: HTMLElement, model?: any) {
            let models = parent.querySelectorAll(this.selector());
            models.forEach(elem => {
                this.bindTo(elem as HTMLElement, model);
                this.markLoaded(elem as HTMLElement, true);
            });
        }
    }

    export namespace DataModel {
        
        export class Value extends Attv.AttributeValue {
            
            load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
                return (this.attribute as DataModel).bindTo(element, options.context);
            }
        }
        
        /**
         * Returns a property of an object
         * @param model the object
         * @param propertyName the property name
         */
        export function getProperty(propertyName: string, model?: any): any {
            if (!model) {
                model = Attv.globalThis$();
            }

            let propertyValue = model;
            let propertyChilds = propertyName.split('.');
            
            for (let j = 0; j < propertyChilds.length; j++) {
                try
                {
                    let child = propertyChilds[j];
                    if (child === 'this') {
                        propertyValue = propertyValue;
                    } else {
                        // see if the propertyName is a global variable
                        if (j == 0 && isGlobalVariable(child, propertyValue)) {
                            propertyValue = Attv.globalThis$()[child];
                        }
                        else {
                            propertyValue = propertyValue[child];
                        }
                    }
                }
                catch (e) {
                    propertyValue = undefined;
                    break;
                }
            }
    
            return parseJsonOrElse(propertyValue);
        }

        function isGlobalVariable(variableName: string, scoped?: any) {
            return !scoped?.hasOwnProperty(variableName) && Attv.globalThis$().hasOwnProperty(variableName);
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
                    if (isGlobalVariable(property)) {
                        return setProperty(propertyName, propertyValue, undefined);
                    }
                    else {
                        Attv.log('warning', `No property ${childProperty}`, property);
                    }
                }
            }

            property[propertyChilds[len-1]] = propertyValue;
        }
    }
}

Attv.register(() => new Attv.DataModel(), att => {
    att.map(() => new Attv.DataModel.Value());
});