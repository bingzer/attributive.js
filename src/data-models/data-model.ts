namespace Attv {
    export class DataModel extends Attv.Attribute {
        static readonly Key: string = 'data-model';

        readonly binders: Attv.Binders.Binder<HTMLElement>[];

        constructor() {
            super(DataModel.Key);
            this.wildcard = "<jsExpression>";
            this.priority = 0;
            this.isAutoLoad = true;
            this.binders = [
                new Attv.Binders.Text(),
                new Attv.Binders.TextArea(),
                new Attv.Binders.Select(),
                new Attv.Binders.MultiSelect(),
                new Attv.Binders.Checkbox(),
                new Attv.Binders.RadioButton(),
                new Attv.Binders.Table(),
                new Attv.Binders.List(),
                new Attv.Binders.Default()
            ];
            this.deps.uses = [ 
                Attv.DataLoad.Key,
                Attv.DataModelContext.Key
            ];
        }

        /**
         * Bind model into this element
         * @param element the element to bind
         * @param model the model
         */
        bindTo(element: HTMLElement, model?: any, refId?: string): BooleanOrVoid {
            let rawValue = this.raw(element);
            if (!rawValue)
                return false;
                
            let expression = new Attv.Binders.AliasExpression(rawValue);

            let binder = this.binders.filter(b => b.accept(this, element))[0];
            if (binder) {
                binder.bind(this, element, expression, model);
                binder.stamp(this, element, refId);
            }

            return true;
        }
        
        /**
         * Returns a property of an object
         * @param model the object
         * @param propertyName the property name
         */
        static getProperty(propertyName: string, model?: any): any {
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
                        if (j == 0 && Attv.DataModel.isGlobalVariable(child, propertyValue)) {
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
    
            return Attv.parseJsonOrElse(propertyValue);
        }

        /**
         * Sets a property in an object
         * @param model the object
         * @param propertyName the property name
         * @param propertyValue the property value
         */
        static setProperty(propertyName: string, propertyValue: any, model: any) {
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
                    if (Attv.DataModel.isGlobalVariable(property)) {
                        return Attv.DataModel.setProperty(propertyName, propertyValue, undefined);
                    }
                    else {
                        Attv.log('warning', `No property ${childProperty}`, property);
                    }
                }
            }

            property[propertyChilds[len-1]] = propertyValue;
        }

        private static isGlobalVariable(variableName: string, scoped?: any) {
            return !scoped?.hasOwnProperty(variableName) && Attv.globalThis$().hasOwnProperty(variableName);
        }

    }

    export namespace DataModel {
        
        export class Value extends Attv.AttributeValue {
            
            load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
                let dataModel = this.attribute as DataModel;
                return dataModel.bindTo(element, options.context, options.contextRefId);
            }
        }
    }
}

Attv.register(() => new Attv.DataModel(), att => {
    att.map(() => new Attv.DataModel.Value());
});