namespace Attv {
    
    /**
     * [data-dialog]
     */
    export class DataDialog extends Attv.Attribute {
        static readonly UniqueId = "DataDialog";

        constructor () {
            super(DataDialog.UniqueId);

            this.wildcard = "none";

            this.dependency.uses.push(DataContent.UniqueId, DataUrl.UniqueId, DataModal.UniqueId, DataTitle.UniqueId, DataPartial.UniqueId);
            this.dependency.internals.push(DataCallback.UniqueId);
        }

        show(element: HTMLElement) {
            return this.getValue<Attv.DataDialog.DefaultValue>(element).show(element);
        }
    }

}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataDialog {
    /**
     * [data-dialog]="default|click"
     */
    export class DefaultValue extends Attv.Attribute.Value {

        constructor (attributeValue: string) {
            super(attributeValue);
            this.validators.push(new Validators.RequiredElement(['a', 'button']));
        }

        loadElement(element: HTMLElement): boolean {
            // remove onclick
            if (element.attvAttr('onclick')) {
                this.resolver.addAttribute(DataCallback.UniqueId, element, element.attvAttr('onclick'));
            }

            element.onclick = (ev: Event) => {
                this.show(element);
                return false;
            }

            return true;
        }

        show(elementOrSettings: DataDialog.DialogSettings | HTMLElement) {
            if (elementOrSettings instanceof HTMLElement) {
                let element = elementOrSettings as HTMLElement;
                this.loadSettings<DialogSettings>(element, settings => {
                    settings.isModal = settings.isModal || this.resolver.resolve<DataModal>(DataModal.UniqueId).isModal(element);
                    settings.title = settings.title || this.resolver.resolve<DataTitle>(DataTitle.UniqueId).getTitle(element);
                    settings.content = settings.content || this.resolver.resolve<DataContent>(DataContent.UniqueId).getContent(element);
                    if (!settings.content) {
                        let dataPartial = this.resolver.resolve<DataPartial>(DataPartial.UniqueId);
                        if (dataPartial.exists(element)) {
                            settings.callback = (contentElement: HTMLElement) => {
                                dataPartial.getValue<DataPartialDialogValue>(element).render(element, undefined, { targetElement: contentElement } as any);
                            }
                        }
                    }
    
                    settings.titleSelector = settings.titleSelector || DataDialog.DialogSettings.DefaultTitleSelector;
                    settings.contentSelector = settings.contentSelector || DataDialog.DialogSettings.DefaultContentSelector;
                    settings.templateHtml = settings.templateHtml || DataDialog.DialogSettings.DefaultTemplateHtml;
                    settings.style = DataDialog.DialogSettings.getStyle(settings);
    
                    this.showDialog(settings);
                });
            } else {
                this.showDialog(elementOrSettings as DialogSettings);
            }
        }

        protected showDialog(settings: DataDialog.DialogSettings): HTMLElement {
            let templateHtmlElement = Attv.createHTMLElement(settings.templateHtml);
            let dialogElement = templateHtmlElement.querySelector('dialog') as HTMLDialogElement;

            // add to the body
            document.body.append(dialogElement);

            if (settings.title) {
                dialogElement.querySelector(settings.titleSelector).attvHtml(settings.title);
            }

            if (settings.content) {
                dialogElement.querySelector(settings.contentSelector).attvHtml(settings.content);
            }

            if (settings.isModal) {
                dialogElement.showModal();
            } else {
                dialogElement.attvShow();
            }

            if (settings.callback) {
                settings.callback(dialogElement.querySelector(settings.contentSelector));
            }

            return dialogElement;
        }
    }

    /**
     * [data-partial]="dialog"
     */
    export class DataPartialDialogValue extends Attv.DataPartial.DefaultValue {
        
        constructor () {
            super('dialog')
        }

        protected doRender(element: HTMLElement, content?: string, options?: Ajax.AjaxOptions) {
            // [data-template-source]                
            let html = this.resolver.resolve<DataTemplateSource>(DataTemplateSource.UniqueId).renderTemplate(element, content);

            // [data-target]
            let targetElement = this.resolver.resolve<DataTarget>(DataTarget.UniqueId).getTargetElement(element) || (options as any)?.targetElement as HTMLElement;

            targetElement.attvHtml(html);

            Attv.loadElements(targetElement);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Settings ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.DataDialog {

    export interface DialogSettings extends Attv.Attribute.Settings {
        isModal: boolean;
        content: string;
        title?: string;
        closeOnEscape?: boolean;
        closeOnOutsideClick?: boolean;
        size: string;
        templateHtml: string;
        titleSelector: string;
        contentSelector: string;

        callback: (contentElement: HTMLElement) => void;
    }

    export namespace DialogSettings {
        export const DefaultTitleSelector = "h3.attv-dialog-header-title";
        export const DefaultContentSelector = ".attv-dialog-body-content";
        export const DefaultTemplateHtml = `
<dialog class="attv-dialog">
    <div class="attv-dialog-header">
        <div class="attv-dialog-header-content">
            <h3 class="attv-dialog-header-title"></h3>
        </div>
    </div>
    <div class="attv-dialog-body">
        <div class="attv-dialog-body-content"></div>
    </div>
    <div class="attv-dialog-footer">
        <div class="attv-dialog-footer-content"></div>
    </div>
</dialog>`;
        export function getStyle(settings: DialogSettings) {
            return `
dialog.attv-dialog {
    border: 1px solid gray;
    min-width: 250px;
}
dialog.attv-dialog h3.attv-dialog-header-title {
    margin-top: 8px;
}
dialog.attv-dialog .attv-dialog-body {
    margin-bottom: 8px;
}
`
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DataModal ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    /**
     * [data-modal]="true|false"
     */
    export class DataModal extends Attv.Attribute {
        static readonly UniqueId = "DataModal";

        constructor () {
            super(DataModal.UniqueId);

            this.wildcard = "<boolean>";
        }

        isModal(element: HTMLElement): boolean {
            let rawValue = this.getValue(element).getRaw(element);

            return rawValue?.equalsIgnoreCase('true');
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-dialog', 
        () => new Attv.DataDialog(),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataDialog.DefaultValue(Attv.configuration.defaultTag));
            list.push(new Attv.DataDialog.DefaultValue('click'));
        });
    Attv.registerAttribute('data-modal', () => new Attv.DataModal());

    Attv.registerAttributeValue(Attv.DataPartial.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataDialog.DataPartialDialogValue());
        }
    );
});
