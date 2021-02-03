namespace Attv {
    
    /**
     * [data-wall]
     */
    export class DataWall extends Attv.Attribute {
        static readonly Key: string = 'data-wall';

        constructor() {
            super(Attv.DataWall.Key);

            this.isAutoLoad = true;
            this.deps.uses = [ Attv.DataContent.Key, Attv.DataCallback.Key ];
        }
    }

    export namespace DataWall {

        /**
         * [data-wall="alert"]
         */
        export class Default extends Attv.AttributeValue {
            
            constructor(attributeValue?: string) {
                super(attributeValue);
            }

            load(element: HTMLElement, options?: LoadElementOptions) {
                if (!this.attribute.isLoaded(element)) {
                    let onclick = element.attvAttr('onclick');
                    if (onclick) {

                        let dataCallback = this.attribute.resolve<DataCallback>(Attv.DataCallback.Key);
                        element.attvAttr(dataCallback, onclick);
                        element.removeAttribute('onclick');
                        element.onclick = null;
                    }
    
                    element.onclick = (ev: Event) => this.click(element, ev);
                }
            }

            protected click(element: HTMLElement, ev: Event): boolean {
                let dataContent = this.attribute.resolve(Attv.DataContent.Key);
                let content = dataContent.raw(element);

                alert(content);

                return this.continue(element);
            }

            protected continue(element: HTMLElement): boolean {
                let dataUrl = this.attribute.resolve<DataUrl>(Attv.DataUrl.Key);
                let url = dataUrl.getUrl(element);
                
                let dataCallback = this.attribute.resolve<DataCallback>(Attv.DataCallback.Key);
                if (dataCallback.raw(element)) {
                    dataCallback.callback(element);
                } else if (element?.tagName?.equalsIgnoreCase('a')) {
                    let target = element.attvAttr('target');
                    Attv.navigate(url || '', target);
                }

                return false;
            }

        }

        /**
         * [data-wall="confirm"]
         */
        export class Confirm extends Default {
            constructor (attributeValue: string) {
                super(attributeValue);
            }

            protected click(element: HTMLElement, ev: Event): boolean {
                let dataContent = this.attribute.resolve(Attv.DataContent.Key);
                let content = dataContent.raw(element);

                if (confirm(content)) {
                    return this.continue(element);
                }

                return false;
            }
        }

    }

}

Attv.register(() => new Attv.DataWall(), att => {
    att.map(() => new Attv.DataWall.Default('alert'));
    att.map(() => new Attv.DataWall.Default('native-alert'));
    
    att.map(() => new Attv.DataWall.Confirm('confirm'));
    att.map(() => new Attv.DataWall.Confirm('native-confirm'));
});