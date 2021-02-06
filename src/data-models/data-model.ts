namespace Attv {
    export class DataModel extends Attv.Attribute {
        static readonly Key: string = 'data-model';

        readonly binder: Attv.Binders.Binder<HTMLElement>[];

        constructor() {
            super(DataModel.Key);
            this.wildcard = "<jsExpression>";
            this.priority = 0;
            this.isAutoLoad = true;
            this.binder = [
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

            let binder = this.binder.filter(b => b.accept(this, element))[0];
            if (binder) {
                binder.bind(this, element, expression, model);
                binder.stamp(this, element, refId);
            }

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
                let dataModel = this.attribute as DataModel;
                return dataModel.bindTo(element, options.context, options.contextRefId);
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

        function isGlobalVariable(variableName: string, scoped?: any) {
            return !scoped?.hasOwnProperty(variableName) && Attv.globalThis$().hasOwnProperty(variableName);
        }
    }
}

Attv.register(() => new Attv.DataModel(), att => {
    att.map(() => new Attv.DataModel.Value());
});