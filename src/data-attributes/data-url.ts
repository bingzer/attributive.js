///////////////////// DataMethod ///////////////////////////////////
namespace Attv {
    export class DataUrl extends Attv.Attribute {
        static readonly Key: string = 'data-url';

        constructor() {
            super(Attv.DataUrl.Key);
            this.isAutoLoad = false;
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
            let method = this.resolve<DataMethod>(Attv.DataMethod.Key).getMethod(element);

            if (method.equalsIgnoreCase('get')) {
                // [data-data]
                let data = this.resolve(Attv.DataData.Key).parseRaw(element);

                url = Attv.Ajax.buildUrl({ url: url, method: method, data: data });
            }

            // [data-cache]
            if (!this.resolve<DataCache>(Attv.DataCache.Key).useCache(element)) {
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