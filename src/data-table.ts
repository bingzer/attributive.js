namespace Attv {

    /**
     * [data-tab]
     */
    export class DataTable extends Attv.Attribute {
        static readonly UniqueId = 'DataTable';

        constructor (public name: string) {
            super(DataTable.UniqueId, name, true);

            this.isStrict = true;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {
    

    /**
     * [data-table]="default"
     */
    export class DefaultValue extends Attribute.Value {
        
        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            settingsFn?: Attv.Attribute.SettingsFactory,
            validators: Validators.AttributeValidator[] = [
                new Validators.RequiredElementValidator(['table'])
            ]) {
            super(attributeValue, attribute, settingsFn, validators);

            this.resolver.uses.push(DataTemplate.UniqueId, DataPartial.UniqueId);
        }
    
        /**
         * Find all element and construct
         * @param root the root
         */
        loadElement(element: HTMLElement): boolean {
            if (!this.attribute.isElementLoaded(element)) {
                let dataTemplate = this.resolver.resolve<DataTemplate>(DataTemplate.UniqueId);
                let dataPartial = this.resolver.resolve<DataPartial>(DataPartial.UniqueId);

                dataTemplate.getValue(element).loadElement(element);
                dataPartial.getValue(element).loadElement(element);

                this.attribute.markElementLoaded(element, true);
            }

            return true;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DataPartial //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {
    export class DataPartialTableValue extends Attv.DataPartial.DefaultValue {
        
        constructor (attribute: Attv.Attribute, 
            settingsFn?: Attv.Attribute.SettingsFactory,
            validators: Validators.AttributeValidator[] = [
                new Validators.RequiredAttributeValidator([DataUrl.UniqueId])
            ]) {
            super('table', attribute, settingsFn, validators);

            this.resolver.uses.push(DataTemplateSource.UniqueId, DataTimeout.UniqueId, DataMethod.UniqueId, DataCallback.UniqueId, DataTarget.UniqueId, DataInterval.UniqueId);
        }

        protected getTargetElement(element: HTMLElement): HTMLElement {
            // [data-target]           
            let dataTarget = this.resolver.resolve<DataTarget>(DataTarget.UniqueId);

            let targetElement = (dataTarget.getTargetElement(element) || element).querySelector('tbody');
            if (!targetElement) {
                Attv.log('fatal', 'Unable to find tbody on the element', targetElement);
            }

            return targetElement;
        }

        loadElement(element: HTMLElement): boolean {
            if (!this.attribute.isElementLoaded(element)) {
                this.render(element);
                
                this.attribute.markElementLoaded(element, true);
            }

            return true;
        }

    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DataTemplate //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {
    export class DataTemplateTableValue extends Attv.DataTemplate.DefaultValue {
        
        constructor (attribute: Attv.Attribute, 
            settingsFn?: Attv.Attribute.SettingsFactory,
            validators: Validators.AttributeValidator[] = [
                new Validators.RequiredElementValidator(['table'])
            ]) {
            super('table', attribute, settingsFn, validators);
        }

        loadElement(element: HTMLElement): boolean {
            if (!this.attribute.isElementLoaded(element)) {
                let tbody = element.querySelector('tbody');
                let templateHtml = tbody.html();

                this.resolver.addAttribute(DataTemplateHtml.UniqueId, element, templateHtml);

                tbody.html('');

                this.attribute.markElementLoaded(element, true);
            }

            return true;
        }

    }
}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// DataRenderer //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {
    export class DataRendererJson2TableValue extends Attv.DataRenderer.Json2HtmlValue {
        
        constructor (attribute: Attv.Attribute) {
            super('json2Table', attribute);
        }
            
        render(templatedContent: string, model?: any): string {
            model = Attv.parseJsonOrElse(model);

            let tbody = Attv.createHTMLElement('tbody');
            tbody.innerHTML = templatedContent;
            
            let rootElement = Attv.createHTMLElement('tbody');

            this.bind(rootElement, tbody, model);

            let rootHtml = rootElement.html();

            return rootHtml;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Settings //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTable {

    export interface DefaultOptions {
    }
        
    export class DefaultSettings extends Attv.Attribute.Settings {
        style = `
/* Style the table */
[data-table]
`;
    }
}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-table', 
        (attributeName: string) => new Attv.DataTable(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTable.DefaultValue(Attv.configuration.defaultTag, attribute, (name, value) => new Attv.DataTable.DefaultSettings(name, value)));
        });

    Attv.registerAttributeValue(Attv.DataTemplate.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTable.DataTemplateTableValue(attribute));
        });

    Attv.registerAttributeValue(Attv.DataPartial.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTable.DataPartialTableValue(attribute));
        });

    Attv.registerAttributeValue(Attv.DataRenderer.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTable.DataRendererJson2TableValue(attribute));
        });
});