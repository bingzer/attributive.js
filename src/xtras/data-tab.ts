namespace Attv {

    /**
     * [data-tab]
     */
    export class DataTab extends Attv.Attribute {
        static readonly UniqueId = 'DataTab';

        constructor () {
            super(DataTab.UniqueId, true);

            this.wildcard = "none";

            this.dependency.uses.push(DataTabContent.UniqueId, DataTabItem.UniqueId);
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
        
        constructor (attributeValue: string) {
            super(attributeValue);
        }
        
        load(element: HTMLElement): boolean {
            return this.loadSettings(element, settings => {
                let dataTabItem = this.resolver.resolve<DataTabItem>(DataTabItem.UniqueId);
    
                element.querySelectorAll(dataTabItem.toString()).forEach((itemElement: HTMLElement) => {
                    dataTabItem.getValue(itemElement).load(itemElement);
                });

                settings.style = Attv.DataTab.DefaultSettings.getStyle(settings);

                this.attribute.markElementLoaded(element, true);
            });
        }
    }

    /**
     * [data-partial]="tab"
     */
    export class DataPartialTabValue extends Attv.DataPartial.DefaultValue {
        
        constructor () {
            super('tab')
        }
    
        load(element: HTMLElement): boolean {
            return false;
        }

        render(element: HTMLElement, content?: string, options?: Ajax.AjaxOptions) {
            if (!this.attribute.isElementLoaded(element)) {
                super.render(element, content, options);

                this.attribute.markElementLoaded(element, true);
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
     * [data-tab-item]
     */
    export class DataTabItem extends Attv.Attribute {
        static readonly UniqueId = 'DataTabItem';

        constructor () {
            super(DataTabItem.UniqueId);

            this.dependency.uses.push(DataEnabled.UniqueId, DataActive.UniqueId);
            this.dependency.internals.push(DataRoute.UniqueId);
        }

    }

    export namespace DataTabItem {
        /**
         * [data-tab-item]="*"
         */
        export class DefaultValue extends Attribute.Value {
            
            constructor () {
                super();

                this.resolver.uses.push(DataEnabled.UniqueId, DataActive.UniqueId, DataTabContent.UniqueId);
                this.resolver.internals.push(DataTab.UniqueId);
            }
            
            load(element: HTMLElement): boolean {
                if (!this.attribute.isElementLoaded(element)) {
                    let dataTab = this.resolver.resolve<DataTab>(DataTab.UniqueId);
                    let dataActive = this.resolver.resolve<DataActive>(DataActive.UniqueId);
                    let dataEnabled = this.resolver.resolve<DataEnabled>(DataEnabled.UniqueId);
                    let dataRoute = this.resolver.resolve<DataRoute>(DataRoute.UniqueId);

                    let tab = element.closest(dataTab.toString()) as HTMLElement;
                    let item = element;
                    let itemSiblings = [...tab.querySelectorAll(this.toString()) as any] as HTMLElement[]; // force as array
                    let onclick = (evt: Event) => {
                        // mark everybody not active
                        this.setItemActive(dataActive, item, true, itemSiblings);
                        this.displayContent(tab, item, itemSiblings);

                        // update route on click
                        if (dataRoute.exists(tab)) {
                            let thisRoute = dataRoute.appendHash(dataRoute.getRoute(tab), this.getRaw(item));
                            dataRoute.setRoute(thisRoute);
                        }

                        return false;
                    }

                    // #1. from the route first
                    // [data-route]
                    let locationRoute = dataRoute.getLocationRoute();
                    if (locationRoute) {
                        for (let i = 0; i < itemSiblings.length; i++) {
                            let route = dataRoute.appendHash(dataRoute.getRoute(tab), this.getRaw(itemSiblings[i]));
                            if (dataRoute.matches(route)) {
                                // mark everybody not active
                                this.setItemActive(dataActive, itemSiblings[i], true, itemSiblings);
                                break;
                            }
                        }
                    }

                    // element is an <a>
                    if (dataRoute.exists(tab) && element.tagName.equalsIgnoreCase('a')) {
                        let thisRoute = dataRoute.appendHash(dataRoute.getRoute(tab), this.getRaw(item));
                        element.attvAttr('href', dataRoute.getHash(thisRoute));
                    }

                    // [data-enabled]
                    if (dataEnabled.isEnabled(element)) {
                        element.onclick = onclick
                        // if parent element is an <li>
                        if (element.parentElement.tagName.equalsIgnoreCase('li')) {
                            element.parentElement.onclick = onclick;
                        }
                    } else {
                        if (element.tagName.equalsIgnoreCase('a')) {
                            element.removeAttribute('href');
                        }
                        if (element.parentElement.tagName.equalsIgnoreCase('li')) {
                            element.parentElement.attvAttr(dataEnabled, false);
                        }
                    }

                    // [data-active]
                    if (dataActive.isActive(element)) {
                        this.displayContent(tab, item, itemSiblings);
                    }

                    this.attribute.markElementLoaded(element, true);
                }

                return true;
            }

            private setItemActive(dataActive: DataActive, item: HTMLElement, isActive: boolean, siblings?: HTMLElement[], ) {
                // mark everybody else not active
                if (!!siblings) {
                    siblings.forEach((e: HTMLElement) => {
                        this.setItemActive(dataActive, e, false);
                    });
                }

                dataActive.setActive(item, isActive);
                if (item.parentElement?.tagName?.equalsIgnoreCase('li')) {
                    dataActive.setActive(item.parentElement, isActive);
                }
            }

            private displayContent(tab: HTMLElement, item: HTMLElement, siblings: HTMLElement[]): boolean {
                let dataTabContent = this.resolver.resolve<DataTabContent>(DataTabContent.UniqueId);

                let contentName = this.getRaw(item);
                let contentElement = tab.parentElement.querySelector(`[${dataTabContent.name}="${contentName}"]`) as HTMLElement;
                if (contentElement) {
                    let parentElement = contentElement.parentElement;
                    // hide all children
                    parentElement.querySelectorAll(dataTabContent.toString()).forEach((e: HTMLElement) => e.attvHide());

                    dataTabContent.getValue(contentElement).load(contentElement);
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

        constructor () {
            super(DataTabContent.UniqueId);
        }

    }

    export namespace DataTabContent {
        
        /**
         * [data-tab-content]="*"
         */
        export class DefaultValue extends Attribute.Value {
            
            constructor () {
                super();
                this.resolver.uses.push(DataContent.UniqueId, DataPartial.UniqueId, DataActive.UniqueId);
            }
            
            load(element: HTMLElement): boolean {
                element.attvShow();

                if (!this.attribute.isElementLoaded(element)) {        
                    // [data-content]
                    let dataContent = this.resolver.resolve<DataContent>(DataContent.UniqueId);
                    if (dataContent.exists(element)) {
                        element.attvHtml(dataContent.getContent(element));
                        return this.attribute.markElementLoaded(element, true);
                    }
        
                    // [data-partial]
                    let dataPartial = this.resolver.resolve<DataPartial>(DataPartial.UniqueId);
                    if (dataPartial.exists(element)) {
                        dataPartial.renderPartial(element);
                        return this.attribute.markElementLoaded(element, true);
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
    export interface DefaultSettings extends Attv.Attribute.Settings {
    }
        
    export namespace DefaultSettings {
        export function getStyle(settings: DefaultSettings): string {
            return `
/* Style the tab */
${settings.attributeValue.attribute} {
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
}

/* Style the buttons inside the tab */
${settings.attributeValue.attribute} li {
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    padding: 14px 16px;
    transition: 0.3s;
    font-size: 17px;
    list-style: none;
}
${settings.attributeValue.attribute} li {
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    padding: 14px 16px;
    transition: 0.3s;
    font-size: 17px;
    list-style: none;
}

/* Change background color of buttons on hover */
${settings.attributeValue.attribute} li:not([data-enabled="false"]):hover {
    cursor: pointer;
}

/* Create an active/current tablink class */
${settings.attributeValue.attribute} li[data-active=true] {
    background-color: #ccc;
}

/* Style the tab content */
${settings.attributeValue.attribute} [data-tab-content]{
    display: none;
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-top: none;
}

${settings.attributeValue.attribute} [data-tab-item][data-enabled="false"] {
    cursor: default;
    opacity: 0.5;
}
${settings.attributeValue.attribute} li[data-enabled="false"]:hover,
${settings.attributeValue.attribute} [data-tab-item][data-enabled="false"]:hover {
    background-color: inherit;
}
`
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-tab', 
        () => new Attv.DataTab(),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTab.DefaultValue(Attv.configuration.defaultTag));
        });
    Attv.registerAttribute('data-tab-item', 
        () => new Attv.DataTabItem(),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTabItem.DefaultValue());
        });
    Attv.registerAttribute('data-tab-content', 
        () => new Attv.DataTabContent(),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTabContent.DefaultValue());
        });

    Attv.registerAttributeValue(Attv.DataPartial.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataTab.DataPartialTabValue());
        }
    );
});