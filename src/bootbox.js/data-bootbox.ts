declare var bootbox: any;

namespace Attv.Bootbox {
    
    /**
     * [data-wall]="alert"
     */
    export class DefaultValue extends Attv.DataWall.DefaultValue {

        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            validators: Validators.AttributeValidator[] = [
                new Attv.Bootbox.BootboxLibraryValidator(),
                new Validators.RequiredElement(['a', 'button'])
            ]) {
            super(attributeValue, attribute, validators);

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

        constructor (attributeValue: string, 
            attribute: Attv.Attribute, 
            validators: Validators.AttributeValidator[] = [
                new Attv.Bootbox.BootboxLibraryValidator(),
                new Validators.RequiredElement(['a', 'button'])
            ]) {
            super(attributeValue, attribute, validators);
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
            list.push(new Attv.Bootbox.DefaultValue('alert', attribute));
            list.push(new Attv.Bootbox.ConfirmValue('confirm', attribute));
        });
});