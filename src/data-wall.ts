namespace Attv {
    
    export class DataWall extends Attv.Attribute {
        static readonly UniqueId = "DataWall";

        constructor (public name: string) {
            super(DataWall.UniqueId, name, true);

            this.dependency.uses.push(DataContent.UniqueId, DataUrl.UniqueId);
            this.dependency.internals.push(DataCallback.UniqueId);
        }

    }

    export namespace DataWall {

        /**
         * [data-wall]="alert"
         */
        export class DefaultAttributeValue extends AttributeValue {

            constructor (attributeValue: string, 
                attribute: Attv.Attribute, 
                validators: Validators.AttributeValidator[] = [
                    new Validators.RequiredAnyElementsValidator(['a', 'button'])
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
                let url = dataUrl.getValue(element).getRawValue(element);
                
                let dataCallback = this.resolver.resolve<DataCallback>(DataCallback.UniqueId);
                if (dataCallback.getValue(element).getRawValue(element)) {
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
        export class ConfirmAttributeValue extends DefaultAttributeValue {
            constructor (attribute: Attv.Attribute, 
                validators: Validators.AttributeValidator[] = []) {
                super('confirm', attribute, validators);
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

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-wall', 
        (attributeName: string) => new Attv.DataWall(attributeName),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataWall.DefaultAttributeValue('alert', attribute));
            list.push(new Attv.DataWall.ConfirmAttributeValue(attribute));
        });
});