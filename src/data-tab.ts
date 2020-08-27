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
            settingsFn: Attv.Attribute.SettingsFactory,
            validators: Validators.AttributeValidator[] = []) {
            super(attributeValue, attribute, settingsFn, validators);
        }
        
        loadElement(element: HTMLElement): boolean {
            let dataTabNav = this.resolver.resolve<DataTabNav>(DataTabNav.UniqueId);

            element.querySelectorAll(dataTabNav.toString()).forEach((navElement: HTMLElement) => {
                dataTabNav.getValue(navElement).loadElement(navElement);
            });

            return true;
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
                    let dataActive = this.resolver.resolve<DataActive>(DataActive.UniqueId);
                    let dataEnabled = this.resolver.resolve<DataEnabled>(DataEnabled.UniqueId);

                    if (dataEnabled.isEnabled(element)) {
                        element.onclick = (evt: Event) => this.displayContent(element.parentElement, element)
                    }
    
                    if (dataActive.isActive(element)) {
                        this.displayContent(element.parentElement, element);
                    }

                    this.attribute.markElementLoaded(element, true);
                }

                return true;
            }

            private displayContent(tabElement: HTMLElement, navElement: HTMLElement): boolean {
                let dataActive = this.resolver.resolve<DataActive>(DataActive.UniqueId);
                let dataTabContent = this.resolver.resolve<DataTabContent>(DataTabContent.UniqueId);
    
                // -- [data-tab-nav]
                navElement.parentElement.querySelectorAll(this.toString()).forEach((e: HTMLElement) => e.attr(dataActive, false));
    
                let contentName = this.getRaw(navElement);
                let contentElement = tabElement.parentElement.querySelector(`[${dataTabContent.name}="${contentName}"]`) as HTMLElement;
                if (contentElement) {
                    let parentElement = contentElement.parentElement;
                    // hide all children
                    parentElement.querySelectorAll(dataTabContent.toString()).forEach((e: HTMLElement) => e.hide());

                    dataTabContent.getValue(contentElement).loadElement(contentElement);
    
                    // mark the tabnav as active
                    navElement.attr(dataActive, true);
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
//////////////////////////// AttributeConfiguration ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTab {
        
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

[data-tab] [data-tab-nav][data-enabled] {
    cursor: default;
}
[data-tab] [data-tab-nav][data-enabled]:hover {
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