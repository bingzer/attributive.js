declare const $: any;

namespace Attv.Bootstrap4 {

    /**
     * [data-bootstrap]
     */
    export class DataBootstrap extends Attv.Attribute {
        static readonly UniqueId = "DataBootstrap4";

        constructor () {
            super(DataBootstrap.UniqueId, true);

            this.wildcard = "none";
            this.priority = 0;
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
    export class Bootstrap4Value extends Attv.Attribute.Value {
        
        constructor (attributeValue: string) {
            super(attributeValue);

            this.validators.push(new Validators.RequiredElement(['body']));
            this.resolver.uses.push(DataRenderer.UniqueId);
            this.resolver.internals.push(DataTemplateHtml.UniqueId);
        }

        load(element: HTMLElement): boolean {
            if (!this.attribute.isElementLoaded(element)) {
                return this.loadSettings<BootstrapSettings>(element, settings => {
                    if (settings.injectJs)
                        settings.jsUrls = settings.jsUrls || BootstrapSettings.JsUrls;
    
                    if (settings.injectStyles)
                        settings.styleUrls = settings.styleUrls || BootstrapSettings.StyleUrls;
                });
            }

            return true;
        }
    }

    /**
     * [data-partial]="tab"
     */
    export class DataPartialTabValue extends Attv.DataPartial.DefaultValue {
        
        constructor () {
            super("tab");
        }

        load(element: HTMLElement): boolean {
            if (!this.attribute.isElementLoaded(element)) {
                if (Attv.isUndefined(window['$'])) {
                    return false;
                }

                let anchor = $(`a[href='#${element.id}']`);
                if (anchor) {
                    anchor.on('shown.bs.tab', (e: Event) => {
                        let targetElement = $(e.target);
                        if (element.id === targetElement.attr('href').replace('#', '')) {
                            this.render(element);
                        }
                    });

                    if (anchor.is('.active')) {
                        this.render(element);
                    }
                }

                return this.attribute.markElementLoaded(element, true);
            }
            
            return true;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// Settings /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Bootstrap4 {
        
    export interface BootstrapSettings extends Attv.Attribute.Settings {
        injectStyles: boolean;
        injectJs: boolean;
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
        () => new Attv.Bootstrap4.DataBootstrap(),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.Bootstrap4.Bootstrap4Value('bootstrap4'));
        });

    Attv.registerAttributeValue(Attv.DataPartial.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.Bootstrap4.DataPartialTabValue());
        });
});