///////////////////// DataMethod ///////////////////////////////////
namespace Attv {
    export class DataUrl extends Attv.Attribute {
        static readonly Key: string = 'data-url';

        constructor() {
            super(Attv.DataUrl.Key);
        }

        raw(element: HTMLElement): string {
            let rawValue = super.raw(element);

            // <form action='/'></form>
            if (!rawValue && element?.tagName?.equalsIgnoreCase('form')) {
                // get from action attribute
                rawValue = element.attvAttr('action');
            }

            // <a href='/'></form>
            if (!rawValue && element?.tagName?.equalsIgnoreCase('a')) {
                rawValue = element.attvAttr('href');
            }

            return rawValue;
        }

        getUrl(element: HTMLElement): string {
            let url = this.raw(element);

            // [data-method]
            let method = this.resolve<DataMethod>(DataMethod.Key).getMethod(element);

            if (method.equalsIgnoreCase('get')) {
                // [data-data]
                let data = this.resolve<DataData>(DataData.Key).getData(element);

                url = Attv.Ajax.buildUrl({ url: url, method: method, data: data });
            }

            // [data-cache]
            if (!this.resolve<DataCache>(DataCache.Key).useCache(element)) {
                if (url.contains('?')) {
                    url += `&_=${Date.now()}`;
                } else {
                    url += `?_=${Date.now()}`;
                }
            }

            return url;
        }
    } 
}

Attv.register(() => new Attv.DataUrl());