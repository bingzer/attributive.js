namespace Attv {
    export class DataModel extends Attv.DataBind {
        static readonly Key: string = 'data-model';

        constructor() {
            super();
            this.key = DataModel.Key;
            this.name = DataModel.Key;
            this.wildcard = "<jsExpression>";
            this.priority = 3;
            this.isAutoLoad = true;
            this.dependency.uses = [
                Attv.DataBind.Key
            ];
        }

       
    }

    export namespace DataModel {
        
        export class Value extends Attv.AttributeValue {
            
            load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
                return (this.attribute as DataModel).bindTo(element, options.context);
            }
        }

    }
}

Attv.register(() => new Attv.DataModel(), att => {
    att.map(() => new Attv.DataModel.Value());
});