namespace Attv {

    /**
     * [data-tab]
     */
    export class DataTab extends Attv.Attribute {
        static readonly UniqueId = 'DataTab';

        constructor (public name: string) {
            super(DataTab.UniqueId, name, true);

            this.dependency.uses.push(DataTabContent.UniqueId, DataTabNav.UniqueId);
            this.configuration = new DataTab.AttributeConfiguration(this);
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
    export class DefaultAttributeValue extends AttributeValue {
        
        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            validators: Validators.AttributeValidator[] = []) {
            super(attributeValue, attribute, validators);

            this.resolver.uses.push(DataContent.UniqueId, DataPartial.UniqueId, DataActive.UniqueId);
        }
        
        loadElement(element: HTMLElement): boolean {
            let dataTabNav = this.resolver.resolve<DataTabNav>(DataTabNav.UniqueId);

            element.querySelectorAll(dataTabNav.toString()).forEach((navElement: HTMLElement) => {
                let dataActive = this.resolver.resolve<DataActive>(DataActive.UniqueId);

                navElement.onclick = (evt: Event) => this.displayContent(navElement)

                if (dataActive.isActive(navElement)) {
                    this.displayContent(navElement);
                }
            });



            return true;
        }

        private displayContent(navElement: HTMLElement): boolean {
            let dataActive = this.resolver.resolve<DataActive>(DataActive.UniqueId);
            let dataTabNav = this.resolver.resolve<DataTabNav>(DataTabNav.UniqueId);
            let dataTabContent = this.resolver.resolve<DataTabContent>(DataTabContent.UniqueId);

            // -- [data-tab-nav]
            navElement.parentElement.querySelectorAll(dataTabNav.toString()).forEach((e: HTMLElement) => e.attr(dataActive, false));

            let contentName = dataTabNav.getValue(navElement).getRawValue(navElement);
            let contentElement = document.querySelector(`[${dataTabContent.name}="${contentName}"]`) as HTMLElement;
            if (contentElement) {
                let parentElement = contentElement.parentElement;
                // hide all children
                parentElement.querySelectorAll(dataTabContent.toString()).forEach((e: HTMLElement) => e.hide());

                this.displayContentElement(contentElement);

                // mark the tabnav as active
                navElement.attr(dataActive, true);
            }

            return false;
        }

        private displayContentElement(contentElement: HTMLElement) {
            contentElement.show();

            // [data-content]
            let dataContent = this.resolver.resolve<DataContent>(DataContent.UniqueId);
            if (dataContent.exists(contentElement)) {
                contentElement.html(dataContent.getContent(contentElement));
                return;
            }

            // [data-partial]
            let dataPartial = this.resolver.resolve<DataPartial>(DataPartial.UniqueId);
            if (dataPartial.exists(contentElement)) {
                dataPartial.renderPartial(contentElement);
                return;
            }
        }
    }

    /**
     * [data-partial]="tab"
     */
    export class DataTabDialogAttributeValue extends Attv.DataPartial.DefaultAttributeValue {
        
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
            super(DataTabNav.UniqueId, name, true);
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
            super(DataTabContent.UniqueId, name, true);
        }

    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// AttributeConfiguration ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataTab {
        
    export class AttributeConfiguration extends Attv.AttributeConfiguration {
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

    export interface DialogOptions extends AttributeConfiguration {
        isModal: boolean;
        content: string;
        title?: string;
        closeOnEscape?: boolean;
        closeOnOutsideClick?: boolean;
        size: string;

        callback: (contentElement: HTMLElement) => void;
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-tab', 
        (attributeName: string) => new Attv.DataTab(attributeName),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataTab.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
        });
    Attv.registerAttribute('data-tab-nav', (attributeName: string) => new Attv.DataTabNav(attributeName));
    Attv.registerAttribute('data-tab-content', (attributeName: string) => new Attv.DataTabContent(attributeName));

    Attv.registerAttributeValue(Attv.DataPartial.UniqueId,
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataTab.DataTabDialogAttributeValue(attribute));
        }
    );
});