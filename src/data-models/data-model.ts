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
                Attv.DataModelBehavior.Key
            ];
        }

        
        getSettings<TAny>(element: HTMLElement): TAny {
            let settings = super.getSettings<Attv.DataModel.Settings>(element) || {} as Attv.DataModel.Settings;

            // #1. find the closes data-model-behavior
            if (Attv.isUndefined(settings.refresh)) {
                let dataModelBehavior = this.resolve(Attv.DataModelBehavior.Key);
                let closest = element.closest<HTMLElement>(dataModelBehavior.selector());
                if (closest) {
                    let behaviorSettings = dataModelBehavior.parseRaw<Attv.DataModel.Settings>(closest);
                    settings.refresh = behaviorSettings?.refresh;
                }
            }

            // #2. Use the static object
            if (Attv.isUndefined(settings.refresh)) {
                settings.refresh = Attv.DataModelBehavior.Settings.refresh;
            }

            return settings as any;
        }

        /**
         * Bind model into this element
         * @param element the element to bind
         * @param model the model
         */
        bindTo(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
            let rawValue = this.raw(element, options?.context);
            if (!rawValue)
                return false;
                
            let expression = new Attv.Expressions.AliasExpression(rawValue);

            let binder = this.binders.filter(b => b.accept(this, element, options))[0];
            if (binder) {
                binder.bind(this, element, expression, options);
            }

            return true;
        }

    }

    export namespace DataModel {

        export interface Settings {

            /**
             * Refresh
             */
            refresh?: string;
            
            /**
             * Loader
             */
            loader?: string;
        }
        
        export class Value extends Attv.AttributeValue {
            
            load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
                let dataModel = this.attribute as DataModel;
                
                return dataModel.bindTo(element, options);
            }
        }
    }
}

Attv.register(() => new Attv.DataModel(), att => {
    att.map(() => new Attv.DataModel.Value());
});