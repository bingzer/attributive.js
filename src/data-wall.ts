namespace Attv {
    
    /**
     * [data-wall]="alert"
     */
    export class DataWall extends Attv.Attribute {
        static readonly UniqueId = "DataWall";

        constructor (public name: string) {
            super(DataWall.UniqueId, name, true);

            this.isStrict = true;

            this.dependency.uses.push(DataContent.UniqueId);
            this.dependency.internals.push(DataCallback.UniqueId);
        }

    }

    // --- AttributeValues

    export namespace DataWall {

        /**
         * [data-wall]="alert"
         */
        export class DefaultValue extends Attribute.Value {

            constructor (attributeValue: string, 
                attribute: Attv.Attribute, 
                validators: Validators.AttributeValidator[] = [
                    new Validators.RequiredElement(['a', 'button'])
                ]) {
                super(attributeValue, attribute, validators);
            }
            
            loadElement(element: HTMLElement): boolean {
                // remove onclick
                if (element.attr('onclick')) {
                    this.resolver.addAttribute(DataCallback.UniqueId, element, element.attr('onclick'));
                }

                element.onclick = (ev: Event) => this.onclick(element, ev);

                return true;
            }

            protected onclick(element: HTMLElement, ev: Event): boolean {
                let dataContent = this.resolver.resolve<DataContent>(DataContent.UniqueId);
                let content = dataContent.getContent(element);

                alert(content);

                return this.continue(element);
            }

            protected continue(element: HTMLElement): boolean {
                let dataUrl = this.resolver.resolve<DataUrl>(DataUrl.UniqueId);
                let url = dataUrl.getValue(element).getRaw(element);
                
                let dataCallback = this.resolver.resolve<DataCallback>(DataCallback.UniqueId);
                if (dataCallback.getValue(element).getRaw(element)) {
                    dataCallback.callback(element);
                } else if (element?.tagName?.equalsIgnoreCase('a')) {
                    let target = element.attr('target');
                    Attv.navigate(url || '', target);
                }

                return false;
            }
        }

        /**
         * [data-wall]="confirm"
         */
        export class ConfirmValue extends DefaultValue {
            constructor (attributeValue: string,
                attribute: Attv.Attribute, 
                validators: Validators.AttributeValidator[] = []) {
                super(attributeValue, attribute, validators);
            }

            protected onclick(element: HTMLElement, ev: Event): boolean {
                let dataContent = this.resolver.resolve<DataContent>(DataContent.UniqueId);
                let content = dataContent.getContent(element);

                if (confirm(content)) {
                    return this.continue(element);
                }

                return false;
            }
        }
    }
    
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-wall', 
        (attributeName: string) => new Attv.DataWall(attributeName),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataWall.DefaultValue('alert', attribute));
            list.push(new Attv.DataWall.ConfirmValue('confirm', attribute));
            list.push(new Attv.DataWall.DefaultValue('native-alert', attribute));
            list.push(new Attv.DataWall.ConfirmValue('native-confirm', attribute));
        });
});