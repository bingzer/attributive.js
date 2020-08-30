namespace Attv.Bootstrap4 {

    /**
     * [data-bootstrap]
     */
    export class DataBootstrap extends Attv.Attribute {
        static readonly UniqueId = "DataBootstrap4";

        constructor (public name: string) {
            super(DataBootstrap.UniqueId, name, true);
            
            this.isStrict = true;
        }

    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Bootstrap4 {
    

    /**
     * [data-bootstrap]="bootstrap4"
     */
    export class DefaultAttributeValue extends Attv.Attribute.Value {
        
        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            validators: Validators.AttributeValidator[] = [
                new Validators.RequiredElementValidator(['body'])
            ]) {
            super(attributeValue, attribute, validators);

            this.resolver.uses.push(DataRenderer.UniqueId);
            this.resolver.internals.push(DataTemplateHtml.UniqueId);
        }

        loadElement(element: HTMLElement): boolean {
            return this.loadSettings<BootstrapSettings>(element, settings => {
                settings.styleUrls = settings.styleUrls || BootstrapSettings.StyleUrls;
                settings.jsUrls = settings.jsUrls || BootstrapSettings.JsUrls;
            });
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// AttributeConfiguration ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Bootstrap4 {
        
    export interface BootstrapSettings extends Attv.Attribute.Settings {
    }

    export namespace BootstrapSettings {
        export const StyleUrls = [
            {
                name: 'bootstrap-css',
                url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
                options: {
                    integrity: 'sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T',
                    crossorigin: 'anonymous'
                }
            }
        ];
        
        export const JsUrls = [
            { 
                name: 'jquery',
                url: 'https://code.jquery.com/jquery-3.3.1.slim.min.js',                
                options: {
                    integrity: 'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo',
                    crossorigin: 'anonymous'
                }
            },
            { 
                name: 'popper',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',                
                options: {
                    integrity: 'sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1',
                    crossorigin: 'anonymous'
                }
            },
            { 
                name: 'bootstrap',
                url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',                
                options: {
                    integrity: 'sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM',
                    crossorigin: 'anonymous'
                }
            },
        ]
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-bootstrap', 
        (attributeName: string) => new Attv.Bootstrap4.DataBootstrap(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.Bootstrap4.DefaultAttributeValue('bootstrap4', attribute));
        });
});