namespace Attv {
    
    /**
     * [data-wall]
     */
    export class DataWall extends Attv.Attribute {
        static readonly Key: string = 'data-wall';

        constructor() {
            super(Attv.DataWall.Key);

            this.isAutoLoad = true;
            this.wildcard = "none";
            this.priority = 1;
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
                    }

                    element.onclick = (ev: Event) => {
                        if (!ev.cancelBubble || !ev.defaultPrevented) {
                            return this.click(ev, element, options);
                        }

                        return true;
                    }
                }
            }

            protected click(ev: Event, element: HTMLElement, options?: LoadElementOptions): boolean {
                let dataContent = this.attribute.resolve(Attv.DataContent.Key);
                let content = dataContent.raw(element, options?.context);

                alert(content);

                return this.continue(ev, element, options);
            }

            protected continue(ev: Event, element: HTMLElement, options?: LoadElementOptions): boolean {
                let dataUrl = this.attribute.resolve<DataUrl>(Attv.DataUrl.Key);
                let url = dataUrl.raw(element, options?.context);

                if (url && (element?.tagName?.equalsIgnoreCase('a'))) {
                    let target = element.attvAttr('target');
                    Attv.DataWall.navigate(url || '', target);
                } else {
                    let dataCallback = this.attribute.resolve<DataCallback>(Attv.DataCallback.Key);
                    dataCallback.callback(element);
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

            protected click(ev: Event, element: HTMLElement, options?: LoadElementOptions): boolean {
                let dataContent = this.attribute.resolve(Attv.DataContent.Key);
                let content = dataContent.raw(element, options?.context);

                if (confirm(content)) {
                    return this.continue(ev, element, options);
                } else {
                    ev.stopPropagation();
                    ev.preventDefault();
                }

                return false;
            }
        }
        
        /**
         * Navigate to an URL
         * @param url the url to navigate
         * @param target target if any
         */
        export function navigate(url: any, target?: string) {	
            if (target) {	
                window.open(url, target);	
            } else {	
                window.location.href = url;	
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