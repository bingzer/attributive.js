
namespace Attv {

    /**
     * [data-url]='*'
     */
    export class DataUrl extends Attv.Attribute {
        static readonly UniqueId = 'DataUrl';

        constructor (name: string) {
            super(DataUrl.UniqueId, name);

            this.dependency.requires.push(DataMethod.UniqueId, DataData.UniqueId, DataCache.UniqueId);
        }

        getUrl(element: HTMLElement): string {
            let attributeValue = this.getValue(element);
            let url = attributeValue.getRawValue(element);

            // [data-method]
            let dataMethod = attributeValue.resolver.resolve<DataMethod>(DataMethod.UniqueId);
            let method = dataMethod.getMethod(element);

            if (method === 'get') {
                // [data-data]
                let dataData = attributeValue.resolver.resolve<DataData>(DataData.UniqueId);
                let data = dataData.getData(element);

                url = Attv.Ajax.buildUrl({ url: url, method: method, data: data });
            }

            // [data-cache]
            let dataCache = attributeValue.resolver.resolve<DataCache>(DataCache.UniqueId);
            if (!dataCache.useCache(element)) {
                if (url.contains('?')) {
                    url += `&_=${Date.now()}`;
                } else {
                    url += `?_=${Date.now()}`;
                }
            }

            return url;
        }
    }

    export namespace DataUrl {

        export class DefaultAttributeValue extends AttributeValue {
            constructor (attribute: Attribute) {
                super(undefined, attribute);
            }

            getRawValue(element: HTMLElement): string {
                let rawValue = super.getRawValue(element);

                // <form action='/'></form>
                if (!rawValue && element?.tagName?.equalsIgnoreCase('form')) {
                    // get from action attribute
                    rawValue = element.attr('action');
                }

                // <a href='/'></form>
                if (!rawValue && element?.tagName?.equalsIgnoreCase('a')) {
                    rawValue = element.attr('href');
                }

                return rawValue;
            }
        }
    }

    /**
     * [data-method]='*'
     */
    export class DataMethod extends Attv.Attribute {
        static readonly UniqueId = 'DataMethod';
        static readonly DefaultMethod = 'get';

        constructor (name: string) {
            super(DataMethod.UniqueId, name);
        }

        getMethod(element: HTMLElement): Ajax.AjaxMethod {
            return this.getValue(element).getRawValue(element) as Ajax.AjaxMethod;
        }
    }
    export namespace DataMethod {
        export class DefaultAttributeValue extends AttributeValue {
            constructor (attribute: Attribute) {
                super(undefined, attribute)
            }

            getRawValue(element: HTMLElement): string {
                let rawValue = super.getRawValue(element);

                if (!rawValue && element?.tagName?.equalsIgnoreCase('form')) {
                    // get from method attribute
                    rawValue = element.attr('method');
                }

                if (!rawValue) {
                    rawValue = DataMethod.DefaultMethod;
                }

                return rawValue;
            }
        }
    }

    /**
     * [data-cache]='true|false'
     */
    export class DataCache extends Attv.Attribute {
        static readonly UniqueId = 'DataCache';

        constructor (name: string) {
            super(DataCache.UniqueId, name);
        }

        useCache(element: HTMLElement): boolean {
            let value = this.getValue(element).getRawValue(element);
            if (isUndefined(value) || value === null)
                return true;
            return value === 'true';
        }
    }

    /**
     * [data-callback]='*'
     */
    export class DataCallback extends Attv.Attribute {
        static readonly UniqueId = 'DataCallback';

        constructor (name: string) {
            super(DataCallback.UniqueId, name);
        }

        callback(element: HTMLElement): any {
            let jsFunction = this.getValue(element).getRawValue(element);
            return Attv.eval(jsFunction);
        }
    }

    /**
     * [data-loading]='*'
     */
    export class DataLoading extends Attv.Attribute {
        static readonly UniqueId = 'DataLoading';

        constructor (name: string) {
            super(DataLoading.UniqueId, name);
        }
    }

    /**
     * [data-content]='*'
     */
    export class DataContent extends Attv.Attribute {
        static readonly UniqueId = 'DataContent';

        constructor (name: string) {
            super(DataContent.UniqueId, name);
        }

        getContent(element: HTMLElement): any {
            let rawValue = this.getValue(element).getRawValue(element);

            return rawValue;
        }
    }

    /**
     * [data-target]='*'
     */
    export class DataTarget extends Attv.Attribute {
        static readonly UniqueId = 'DataTarget';

        constructor (name: string) {
            super(DataTarget.UniqueId, name);
        }

        getTargetElement(element: HTMLElement): HTMLElement {
            let selector = this.getValue(element).getRawValue(element);

            return document.querySelector(selector) as HTMLElement;
        }
    }

    /**
     * [data-timeout]='*'
     */
    export class DataTimeout extends Attv.Attribute {
        static readonly UniqueId = 'DataTimeout';

        constructor (name: string) {
            super(DataTimeout.UniqueId, name);
        }

        timeout(element: HTMLElement, fn: () => void) {
            let ms = parseInt(this.getValue(element).getRawValue(element));

            if (ms) {
                window.setTimeout(fn, ms);
            } else {
                fn();
            }
        }
    }

    /**
     * [data-interval]='*'
     */
    export class DataInterval extends Attv.Attribute {
        static readonly UniqueId = 'DataInterval';

        constructor (name: string) {
            super(DataInterval.UniqueId, name);
        }

        interval(element: HTMLElement, fn: () => void) {
            let ms = parseInt(this.getValue(element).getRawValue(element));

            if (ms) {
                let timer = new DataInterval.IntervalTimer(ms, fn);
                DataInterval.step(timer, ms);
            } else {
                fn();
            }
        }

        private static step(intervalTimer: DataInterval.IntervalTimer, timestamp: number) {
            if (intervalTimer.start == undefined) {
                intervalTimer.start = timestamp;
            }

            const elapsed = timestamp - intervalTimer.start;
            if (elapsed > intervalTimer.timer) {
                intervalTimer.fn();
                intervalTimer.start = timestamp;
                DataInterval.requestAnimationFrame(intervalTimer);
            }

            DataInterval.requestAnimationFrame(intervalTimer);
        }

        private static requestAnimationFrame(intervalTimer: DataInterval.IntervalTimer) {
            window.requestAnimationFrame(timestamp => {
                this.step(intervalTimer, timestamp);
            });
        }
    }
    export namespace DataInterval {
        export class IntervalTimer {
            constructor (public timer: number, public fn: () => void, public start?: number) {
                // do nothing
            }
        }
    }

    /**
     * [data-data]='*'
     */
    export class DataData extends Attv.Attribute {
        static readonly UniqueId = 'DataData';

        constructor (name: string) {
            super(DataData.UniqueId, name);
        }
        
        getData(element: HTMLElement): any {
            let rawValue = this.getValue(element).getRawValue(element);

            if (Attv.isEvaluatable(rawValue)) {
                //do eval
                rawValue = Attv.eval(rawValue);
            }

            return parseJsonOrElse(rawValue);
        }
    }

    /**
     * [data-options]='*'
     */
    export class DataOptions extends Attv.Attribute {
        static readonly UniqueId = 'DataOptions';

        constructor (name: string) {
            super(DataOptions.UniqueId, name);
        }
        
        /**
         * Returns the option object (json)
         * @param element the element
         */
        getOptions<TOptions>(element: HTMLElement): TOptions {
            let rawValue = this.getValue(element).getRawValue(element);

            if (Attv.isEvaluatable(rawValue)) {
                //do eval
                rawValue = Attv.eval(rawValue);
            }

            let options = parseJsonOrElse(rawValue) || {} as TOptions;

            return options;
        }
    }

    /**
     * [data-title]='*'
     */
    export class DataTitle extends Attv.Attribute {
        static readonly UniqueId = 'DataTitle';

        constructor (name: string) {
            super(DataTitle.UniqueId, name);
        }
        
        getTitle(element: HTMLElement): string {
            let title = this.getValue(element).getRawValue(element);
            return title;
        }
    }

    /**
     * [data-bind]='*'
     */
    export class DataBind extends Attv.Attribute {
        static readonly UniqueId = 'DataBind';

        constructor (name: string) {
            super(DataBind.UniqueId, name);
        }

        bind(element: HTMLElement, any: any) {
            element.html(any?.toString() || '');
        }
    }

    /**
     * [data-active]='*'
     */
    export class DataActive extends Attv.Attribute {
        static readonly UniqueId = 'DataActive';

        constructor (name: string) {
            super(DataActive.UniqueId, name);
        }
        
        isActive(element: HTMLElement) {
            let rawValue = this.getValue(element).getRawValue(element);

            return rawValue === 'true';
        }
    }

}

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-url', 
        (name: string) => new Attv.DataUrl(name),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataUrl.DefaultAttributeValue(attribute));
        });
    Attv.registerAttribute('data-method', 
        (name: string) => new Attv.DataMethod(name),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataMethod.DefaultAttributeValue(attribute));
        });
    Attv.registerAttribute('data-callback', (name: string) => new Attv.DataCallback(name));
    Attv.registerAttribute('data-loading', (name: string) => new Attv.DataLoading(name));
    Attv.registerAttribute('data-target',  (name: string) => new Attv.DataTarget(name));
    Attv.registerAttribute('data-content', (name: string) => new Attv.DataContent(name));
    Attv.registerAttribute('data-timeout', (name: string) => new Attv.DataTimeout(name));
    Attv.registerAttribute('data-interval', (name: string) => new Attv.DataInterval(name));
    Attv.registerAttribute('data-data', (name: string) => new Attv.DataData(name));
    Attv.registerAttribute('data-options', (name: string) => new Attv.DataOptions(name));
    Attv.registerAttribute('data-cache', (name: string) => new Attv.DataCache(name));
    Attv.registerAttribute('data-title', (name: string) => new Attv.DataTitle(name));
    Attv.registerAttribute('data-bind', (name: string) => new Attv.DataBind(name));
    Attv.registerAttribute('data-active', (name: string) => new Attv.DataActive(name));
});

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// DataRenderer ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {

    /**
    * data-renderer
    */
    export class DataRenderer extends Attv.Attribute {
        static readonly UniqueId = 'DataRenderer';

        constructor (name: string) {
            super(DataRenderer.UniqueId, name);
        }

        render(content: string, model: any, element?: HTMLElement, attributeValue?: DataRenderer.DefaultAttributeValue): string {       
            if (!attributeValue) {
                attributeValue = this.getValue<DataRenderer.DefaultAttributeValue>(element);
            }

            return attributeValue.render(content, model);
        }
    }

    export namespace DataRenderer {

        /**
         * [data-renderer]='default'
         */
        export class DefaultAttributeValue extends Attv.AttributeValue  {
            
            constructor (attributeValue: string, attribute: Attv.Attribute) {
                super(attributeValue, attribute);
            }
    
            loadElement(element: HTMLElement): boolean {
                return true;
            }
            

            render(content: string, model: any, element?: HTMLElement): string {  
                return content;
            }
        }

        /**
         * [data-renderer]='json2html'
         */
        export class Json2HtmlAttributeValue extends DefaultAttributeValue {
    
            private dataBind: DataBind;
            
            constructor (attribute: Attv.Attribute) {
                super('json2html', attribute);

                this.resolver.requires.push(DataBind.UniqueId);
                this.dataBind = this.resolver.resolve<DataBind>(DataBind.UniqueId);
            }
    
            loadElement(element: HTMLElement): boolean {
                return true;
            }
            
            render(templatedContent: string, model?: any): string {
                model = Attv.parseJsonOrElse(model);

                let templateElement = Attv.createHTMLElement(templatedContent);
                let rootElement = Attv.createHTMLElement('');
    
                this.bind(rootElement, templateElement, model);
    
                return rootElement.html();
            }
    
            protected bind(parent: HTMLElement, template: HTMLElement, model: any) {
                let allbinds = template.querySelectorAll(this.dataBind.toString());
                for (let i = 0; i < allbinds.length; i++) {
                    let bindElement = allbinds[i] as HTMLElement;
                    
                    let propName = bindElement.attr(this.dataBind);
                    let propValue = this.getPropertyValue(propName, model);

                    if (Array.isArray(propValue)) {
                        let array = propValue as [];
                        let parentOfBindElement = bindElement.parentElement;

                        bindElement.remove();

                        for (let j = 0; j < array.length; j++) {
                            let clonedBindElement = bindElement.cloneNode(true) as HTMLElement;
                            this.bind(parentOfBindElement, clonedBindElement, array[j]);
                        }
                    }
                    else {
                        // bind
                        this.dataBind.bind(bindElement, propValue);
                        
                        parent.append(template);
                    }
                }
            }
    
            private getPropertyValue(propertyName: string, any: any) {
                let propertyValue = any;
    
                if (Attv.isUndefined(any))
                    return undefined;
    
                if (propertyName === '$' || propertyName === '$root') {
                    propertyValue = any;
                }
                else if (propertyName === '$json') {
                    propertyValue = JSON.stringify(propertyValue);
                    return propertyValue;
                }
                else {
                    let propertyChilds = propertyName.split('.');
                    for (var j = 0; j < propertyChilds.length; j++) {
                        try
                        {
                            propertyValue = propertyValue[propertyChilds[j]];
                        }
                        catch (e) {
                            // ignore
                        }
                    }
                }
    
                return parseJsonOrElse(propertyValue);
            }
        }
    }
   
}

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-renderer', 
        (name: string) => new Attv.DataRenderer(name),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataRenderer.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
            list.push(new Attv.DataRenderer.Json2HtmlAttributeValue(attribute));
        });
});