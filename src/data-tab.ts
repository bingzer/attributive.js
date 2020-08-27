namespace Attv {

    /**
     * [data-tab]
     */
    export class DataTab extends Attv.Attribute {
        static readonly UniqueId = 'DataTab';

        constructor (public name: string) {
            super(DataTab.UniqueId, name, true);

            this.isStrict = true;

            this.dependency.uses.push(DataTabContent.UniqueId, DataTabNav.UniqueId);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTab {

    /**
     * [data-tab]="default"
     */
    export class DefaultValue extends Attribute.Value {
        
        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            settingsFn?: Attv.Attribute.SettingsFactory,
            validators: Validators.AttributeValidator[] = []) {
            super(attributeValue, attribute, settingsFn, validators);

            this.resolver.uses.push(DataRoute.UniqueId, DataOptions.UniqueId);
        }
        
        loadElement(element: HTMLElement): boolean {
            if (!this.attribute.isElementLoaded(element)) {
                let dataTabNav = this.resolver.resolve<DataTabNav>(DataTabNav.UniqueId);
    
                element.querySelectorAll(dataTabNav.toString()).forEach((navElement: HTMLElement) => {
                    dataTabNav.getValue(navElement).loadElement(navElement);
                });

                // load settings
                this.applySettings(element);

                this.attribute.markElementLoaded(element, true);
            }

            return true;
        }

        private applySettings(element: HTMLElement) {
            let dataOptions = this.resolver.resolve<DataOptions>(DataOptions.UniqueId);
            if (dataOptions.exists(element)) {
                this.settings
            }

            this.settings?.commit();
        }
    }

    /**
     * [data-partial]="tab"
     */
    export class DataTabDialogAttributeValue extends Attv.DataPartial.DefaultValue {
        
        constructor (attribute: Attv.Attribute) {
            super('tab', attribute)
        }
    
        loadElement(element: HTMLElement): boolean {
            return false;
        }

        render(element: HTMLElement, content?: string, options?: Ajax.AjaxOptions) {
            if (!this.attribute.isElementLoaded(element)) {
                super.render(element, content, options);
            }
        }
        
        protected doRender(element: HTMLElement, content: string, options?: Ajax.AjaxOptions): void {
            super.doRender(element, content, options);

            this.attribute.markElementLoaded(element, true);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// DataTabNav ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    /**
     * [data-tab-nav]
     */
    export class DataTabNav extends Attv.Attribute {
        static readonly UniqueId = 'DataTabNav';

        constructor (public name: string) {
            super(DataTabNav.UniqueId, name);

            this.dependency.uses.push(DataEnabled.UniqueId, DataActive.UniqueId);
            this.dependency.internals.push(DataRoute.UniqueId);
        }

    }

    export namespace DataTabNav {
        /**
         * [data-tab-nav]="*"
         */
        export class DefaultAttributeValue extends Attribute.Value {
            
            constructor (attribute: Attv.Attribute, 
                settingsFn?: Attv.Attribute.SettingsFactory,
                validators: Validators.AttributeValidator[] = []) {
                super(undefined, attribute, settingsFn, validators);

                this.resolver.uses.push(DataEnabled.UniqueId, DataActive.UniqueId, DataTabContent.UniqueId);
            }
            
            loadElement(element: HTMLElement): boolean {
                if (!this.attribute.isElementLoaded(element)) {
                    let tab = element.parentElement;
                    let nav = element;
                    let navSibilings = [...tab.querySelectorAll(this.toString()) as any] as HTMLElement[]; // force as array

                    let dataActive = this.resolver.resolve<DataActive>(DataActive.UniqueId);
                    let dataEnabled = this.resolver.resolve<DataEnabled>(DataEnabled.UniqueId);
                    let dataRoute = this.resolver.resolve<DataRoute>(DataRoute.UniqueId);

                    // #1. from the route first
                    // [data-route]
                    let locationRoute = dataRoute.getLocationRoute();
                    if (locationRoute) {
                        for (let i = 0; i < navSibilings.length; i++) {
                            let route = dataRoute.appendHash(dataRoute.getRoute(tab), this.getRaw(navSibilings[i]));
                            if (dataRoute.matches(route)) {
                                // mark everybody not active
                                navSibilings.forEach((e: HTMLElement) => dataActive.setActive(e, false) );
                                dataActive.setActive(navSibilings[i], true);
                                break;
                            }
                        }
                    }

                    // [data-enabled]
                    if (dataEnabled.isEnabled(element)) {
                        element.onclick = (evt: Event) => {
                            // mark everybody not active
                            navSibilings.forEach((e: HTMLElement) => dataActive.setActive(e, false));
                            dataActive.setActive(nav, true);
                            this.displayContent(tab, nav, navSibilings);

                            // update route on click
                            let thisRoute = dataRoute.appendHash(dataRoute.getRoute(tab), this.getRaw(nav));
                            dataRoute.setRoute(thisRoute);
                        }
                    }

                    // [data-active]
                    if (dataActive.isActive(element)) {
                        this.displayContent(tab, nav, navSibilings);
                    }

                    this.attribute.markElementLoaded(element, true);
                }

                return true;
            }

            private displayContent(tab: HTMLElement, nav: HTMLElement, siblings: HTMLElement[]): boolean {
                let dataTabContent = this.resolver.resolve<DataTabContent>(DataTabContent.UniqueId);

                let contentName = this.getRaw(nav);
                let contentElement = tab.parentElement.querySelector(`[${dataTabContent.name}="${contentName}"]`) as HTMLElement;
                if (contentElement) {
                    let parentElement = contentElement.parentElement;
                    // hide all children
                    parentElement.querySelectorAll(dataTabContent.toString()).forEach((e: HTMLElement) => e.hide());

                    dataTabContent.getValue(contentElement).loadElement(contentElement);
                }
    
                return false;
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// DataTabContent //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    /**
     * [data-tab-content]
     */
    export class DataTabContent extends Attv.Attribute {
        static readonly UniqueId = 'DataTabContent';

        constructor (public name: string) {
            super(DataTabContent.UniqueId, name);
        }

    }

    export namespace DataTabContent {
        
        /**
         * [data-tab-nav]="*"
         */
        export class DefaultAttributeValue extends Attribute.Value {
            
            constructor (attribute: Attv.Attribute, 
                settingsFn?: Attv.Attribute.SettingsFactory,
                validators: Validators.AttributeValidator[] = []) {
                super(undefined, attribute, settingsFn, validators);
                
                this.resolver.uses.push(DataContent.UniqueId, DataPartial.UniqueId, DataActive.UniqueId);
            }
            
            loadElement(element: HTMLElement): boolean {
                if (!this.attribute.isElementLoaded(element)) {
                    element.show();
        
                    // [data-content]
                    let dataContent = this.resolver.resolve<DataContent>(DataContent.UniqueId);
                    if (dataContent.exists(element)) {
                        element.html(dataContent.getContent(element));
                        return;
                    }
        
                    // [data-partial]
                    let dataPartial = this.resolver.resolve<DataPartial>(DataPartial.UniqueId);
                    if (dataPartial.exists(element)) {
                        dataPartial.renderPartial(element);
                        return;
                    }
        
                    Attv.loadElements(element);

                    this.attribute.markElementLoaded(element, true);
                }

                return true;
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Settings //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTab {

    export interface DefaultOptions {
        router: boolean;
    }
        
    export class DefaultSettings extends Attv.Attribute.Settings {
        style = `
/* Style the tab */
[data-tab] {
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
}

/* Style the buttons inside the tab */
[data-tab] [data-tab-nav] {
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 14px 16px;
    transition: 0.3s;
    font-size: 17px;
    list-style: none;
}

[data-tab] [data-tab-nav][data-enabled="false"] {
    cursor: default;
    opacity: 0.5;
}
[data-tab] [data-tab-nav][data-enabled="false"]:hover {
    background-color: inherit;
}

/* Change background color of buttons on hover */
[data-tab] [data-tab-nav]:hover {
    background-color: #ddd;
}

/* Create an active/current tablink class */
[data-tab] [data-tab-nav][data-active=true] {
    background-color: #ccc;
}

/* Style the tab content */
[data-tab-content]{
    display: none;
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-top: none;
}
`;
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-tab', 
        (attributeName: string) => new Attv.DataTab(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTab.DefaultValue(Attv.configuration.defaultTag, attribute, (name, value) => new Attv.DataTab.DefaultSettings(name, value)));
        });
    Attv.registerAttribute('data-tab-nav', 
        (attributeName: string) => new Attv.DataTabNav(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTabNav.DefaultAttributeValue(attribute));
        });
    Attv.registerAttribute('data-tab-content', 
        (attributeName: string) => new Attv.DataTabContent(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTabContent.DefaultAttributeValue(attribute));
        });

    Attv.registerAttributeValue(Attv.DataPartial.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTab.DataTabDialogAttributeValue(attribute));
        }
    );
});