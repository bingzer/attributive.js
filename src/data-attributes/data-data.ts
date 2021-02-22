namespace Attv {
    export class DataData extends Attv.Attribute {
        static readonly Key: string = 'data-data';

        constructor() {
            super(Attv.DataData.Key);
            this.wildcard = "<json>";
            this.isAutoLoad = false;
        }

        parseRaw<TAny>(element: HTMLElement, context?: any, arg?: any): TAny {
            let data = super.parseRaw<TAny>(element);
            
            // <form action='/'></form>
            if (!data && element?.tagName?.equalsIgnoreCase('form')) {
                data = {} as TAny;
                let form = element as HTMLFormElement;
                let formData = new FormData(form);
                formData.forEach((value, key) => {
                    data[key] = value;
                });
            }

            return data;
        }
    } 
}

Attv.register(() => new Attv.DataData());