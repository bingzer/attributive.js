namespace Attv {
    
    /**
     * [data-wall]="alert"
     */
    export class DataWall extends Attv.Attribute {
        static readonly UniqueId = "DataWall";

        constructor () {
            super(DataWall.UniqueId, true);

            this.wildcard = "none";

            this.dependency.uses.push(DataContent.UniqueId);
            this.dependency.internals.push(DataCallback.UniqueId, DataUrl.UniqueId);
        }

    }
    // --- AttributeValues

    export namespace DataWall {

        /**
         * [data-wall]="alert"
         */
        export class DefaultValue extends Attribute.Value {

            constructor (attributeValue: string) {
                super(attributeValue);

                this.validators.push(new Validators.RequiredElement(['a', 'button']));
            }
            
            load(element: HTMLElement): boolean {
                // remove onclick
                if (element.attvAttr('onclick')) {
                    this.resolver.addAttribute(DataCallback.UniqueId, element, element.attvAttr('onclick'));
                    element.removeAttribute('onclick');
                    element.onclick = null;
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
                    let target = element.attvAttr('target');
                    Attv.navigate(url || '', target);
                }

                return false;
            }
        }

        /**
         * [data-wall]="confirm"
         */
        export class ConfirmValue extends DefaultValue {
            constructor (attributeValue: string) {
                super(attributeValue);
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
        () => new Attv.DataWall(),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataWall.DefaultValue('alert'));
            list.push(new Attv.DataWall.ConfirmValue('confirm'));
            list.push(new Attv.DataWall.DefaultValue('native-alert'));
            list.push(new Attv.DataWall.ConfirmValue('native-confirm'));
        });
});