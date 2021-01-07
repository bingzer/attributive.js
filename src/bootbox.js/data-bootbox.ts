declare var bootbox: any;

namespace Attv.Bootbox {
    
    /**
     * [data-wall]="alert"
     */
    export class DefaultValue extends Attv.DataWall.DefaultValue {

        constructor (attributeValue: string) {
            super(attributeValue);

            this.validators.push(new Attv.Bootbox.BootboxLibraryValidator(), new Validators.RequiredElement(['a', 'button']));
            this.resolver.uses.push(DataContent.UniqueId, DataTitle.UniqueId, DataCallback.UniqueId);
            this.resolver.internals.push(DataCallback.UniqueId);
        }

        protected onclick(element: HTMLElement, ev: Event): boolean {
            this.loadSettings<BootboxSettings>(element, settings => {
                settings = this.mapSettings(element, settings);

                this.bootboxShow(settings);
            });

            return false;
        }

        protected mapSettings(element: HTMLElement, settings: BootboxSettings): BootboxSettings {
            let dataContent = this.resolver.resolve<DataContent>(DataContent.UniqueId);
            let dataTitle = this.resolver.resolve<DataTitle>(DataTitle.UniqueId);
            
            settings.message = settings.message || dataContent.getContent(element);
            settings.title = settings.title || dataTitle.getTitle(element);
            settings.callback = settings.callback || this.bootboxCallback(element);

            return settings;
        }

        protected bootboxCallback(element: HTMLElement) {
            let dataCallback = this.resolver.resolve<DataCallback>(DataCallback.UniqueId);

            if (dataCallback.exists(element)) {
                return (result: boolean) => {
                    if (Attv.isUndefined(result) || result) {
                        dataCallback.callback(element);
                    }
                }
            }

            return undefined;
        }

        protected bootboxShow(settings: BootboxSettings) {
            bootbox.alert(settings);
        }
    }
    
    /**
     * [data-wall]="confirm"
     */
    export class ConfirmValue extends DefaultValue {

        constructor (attributeValue: string) {
            super(attributeValue);

            this.validators.push(new Attv.Bootbox.BootboxLibraryValidator(), new Validators.RequiredElement(['a', 'button']));
        }

        protected bootboxCallback(element: HTMLElement) {
            let dataCallback = this.resolver.resolve<DataCallback>(DataCallback.UniqueId);
            return (result: boolean) => {
                if (Attv.isUndefined(result) || result) {
                    dataCallback.callback(element);
                }
            }
        }

        protected bootboxShow(settings: BootboxSettings) {
            bootbox.confirm(settings);
        }
    }

}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// [data-dialog] ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Bootbox.Dialog {
    
    /**
     * [data-dialog]="default|click"
     */
    export class DefaultValue extends Attv.DataDialog.DefaultValue {

        constructor (attributeValue: string) {
            super(attributeValue);

            this.validators.push(new Validators.RequiredElement(['a', 'button']));
        }

        protected showDialog(settings: DataDialog.DialogSettings): HTMLElement {
            let templateHtmlElement = Attv.createHTMLElement(settings.templateHtml);
            let dialogElement = templateHtmlElement.querySelector('dialog') as HTMLDialogElement;

            if (settings.content) {
                dialogElement.querySelector(settings.contentSelector).attvHtml(settings.content);
            }

            let bootboxOptions = settings as any;
            bootboxOptions.message = dialogElement.attvHtml();
            bootboxOptions.onShown = (e: Event) => {
                let modal = e.target as HTMLElement;

                if (settings.callback) {
                    settings.callback(modal.querySelector(settings.contentSelector));
                }
            }

            return bootbox.dialog(bootboxOptions);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Settings //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Bootbox {

    export interface BootboxSettings extends Attv.Attribute.Settings {
        message: string;
        title: string;
        size: 'small' | 'medium' | 'large';
        callback: (result?: boolean) => void;
    }

}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Validators ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv.Bootbox {
    export class BootboxLibraryValidator implements Attv.Validators.AttributeValidator {
        validate(value: Attribute.Value, element: Element): boolean {
            let isValidated = true;

            if (!window.bootbox) {
                isValidated = false;
                Attv.log('fatal', `${value.toString(true)} is requiring bootboxjs`, element)
            }

            return isValidated;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttributeValue(Attv.DataWall.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.Bootbox.DefaultValue('alert'));
            list.push(new Attv.Bootbox.ConfirmValue('confirm'));
        });

    Attv.registerAttributeValue(Attv.DataDialog.UniqueId,
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.Bootbox.Dialog.DefaultValue(Attv.configuration.defaultTag));
        });
});