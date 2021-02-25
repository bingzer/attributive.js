///////////////////// DataMethod ///////////////////////////////////
namespace Attv {
    export class DataUrl extends Attv.Attribute {
        static readonly Key: string = 'data-url';

        constructor() {
            super(Attv.DataUrl.Key);
            this.isAutoLoad = false;

            this.deps.uses = [
                Attv.DataMethod.Key, 
                Attv.DataCache.Key,
                Attv.DataData.Key
            ];
        }

        raw(element: HTMLElement, context?: any, arg?: any): string {
            let url = super.raw(element, context, arg);
            context = this.getContext(element, context, arg);

            // <form action='/'></form>
            if (!url && element?.tagName?.equalsIgnoreCase('form')) {
                // get from action attribute
                url = Attv.Expressions.replaceVar(element.attvAttr('action'), context);
            }

            // <a href='/'></a>
            if (!url && element?.tagName?.equalsIgnoreCase('a')) {
                url = Attv.Expressions.replaceVar(element.attvAttr('href'), context);
            }

            // [data-method]
            let method = this.resolve<DataMethod>(Attv.DataMethod.Key).parseRaw<Ajax.AjaxMethod>(element);

            if (method.equalsIgnoreCase('get')) {
                // [data-data]
                let data = this.resolve(Attv.DataData.Key).parseRaw<any>(element);

                url = Attv.Ajax.buildUrl({ url: url, method: method, data: data });
            }

            // [data-cache]
            let useCache = this.resolve<DataCache>(Attv.DataCache.Key).parseRaw<boolean>(element);
            if (Attv.isUndefined(useCache) ? false : useCache) {
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