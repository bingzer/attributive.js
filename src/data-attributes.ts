
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
            let url = attributeValue.getRaw(element);

            // [data-method]
            let dataMethod = attributeValue.resolver.resolve<DataMethod>(DataMethod.UniqueId);
            let method = dataMethod.getMethod(element);

            if (method.equalsIgnoreCase('get')) {
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

        export class DefaultValue extends Attribute.Value {
            constructor (attribute: Attribute) {
                super(undefined, attribute);
            }

            getRaw(element: HTMLElement): string {
                let rawValue = super.getRaw(element);

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
            return this.getValue(element).getRaw(element) as Ajax.AjaxMethod;
        }
    }
    export namespace DataMethod {
        export class DefaultValue extends Attribute.Value {
            constructor (attribute: Attribute) {
                super(undefined, attribute)
            }

            getRaw(element: HTMLElement): string {
                let rawValue = super.getRaw(element);

                if (!rawValue && element?.tagName?.equalsIgnoreCase('form')) {
                    // get from method attribute
                    rawValue = element.attvAttr('method');
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
            let value = this.getValue(element).getRaw(element);
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
            let jsFunction = this.getValue(element).getRaw(element);
            return Attv.eval(jsFunction);
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
            let rawValue = this.getValue(element).getRaw(element);

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
            return this.getValue<Attv.Attribute.QuerySelectorValue>(element).getTargetElement(element);
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
            let ms = this.getValue<Attv.Attribute.NumberValue>(element).getNumber(element);

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
            let ms = this.getValue<Attv.Attribute.NumberValue>(element).getNumber(element);

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
            let rawValue = this.getValue(element).getRaw(element);
            return parseJsonOrElse<any>(rawValue);
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
            let title = this.getValue(element).getRaw(element);
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
            element.attvHtml(any?.toString() || '');
        }
    }

    /**
     * [data-enabled]='true|false'
     */
    export class DataEnabled extends Attv.Attribute {
        static readonly UniqueId = 'DataEnabled';

        constructor (name: string) {
            super(DataEnabled.UniqueId, name);
        }

        /**
         * Assume everything is enabled except when specifically set to 'false'
         * @param element the element
         */
        isEnabled(element: HTMLElement) {
            let rawValue = this.getValue(element).getRaw(element);

            return !rawValue?.equalsIgnoreCase('false');
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
            let rawValue = this.getValue(element).getRaw(element);

            return rawValue === 'true';
        }

        setActive(element: HTMLElement, isActive: boolean) {
            element.attvAttr(this, isActive);
        }
    }

    /**
     * [data-route]='*'
     * Just like for SPA
     */
    export class DataRoute extends Attv.Attribute {
        static readonly UniqueId = 'DataRoute';

        constructor (name: string) {
            super(DataRoute.UniqueId, name);
        }

        getRoute(element: HTMLElement) {
            let rawValue = this.getValue(element).getRaw(element);

            return rawValue;
        }

        getLocationRoute(): string {
            return this.cleanHash(window.location.hash);
        }

        appendHash(...hash: string[]) {
            let result = hash?.map(h => this.cleanHash(h))?.join('/');
            return this.cleanHash(result);
        }

        setRoute(hash: string) {
            if (isUndefined(hash)) {
                return;
            }

            window.location.hash = this.cleanHash(hash);
        }

        getHash(hash: string): string {
            if (!hash?.startsWith('#')) {
                hash = '#' + hash;
            } 

            return hash;
        }

        /**
         * Checks if location route matches/starts-with hash
         * @param hash the hash
         */
        matches(hash: string) {
            hash = this.cleanHash(hash);
            let locationRoute = this.getLocationRoute();

            // TODO: refactor
            if (locationRoute.startsWith(hash)) {
                // make sure
                if (locationRoute === hash) {
                    return true;
                } else {
                    // makes sure there's / after the index
                    let nextChar = locationRoute.substr(locationRoute.indexOf(hash) + hash.length, 1);
                    return nextChar === '/';
                }
            }

            return false;
        }

        private cleanHash(hash: string): string {
            return hash?.replace('#', '')?.replace(/\/\//, '/');
        }
    }

}

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-url', 
        (name: string) => new Attv.DataUrl(name),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataUrl.DefaultValue(attribute));
        });
    Attv.registerAttribute('data-method', 
        (name: string) => new Attv.DataMethod(name),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataMethod.DefaultValue(attribute));
        });
    Attv.registerAttribute('data-callback', 
        (name: string) => new Attv.DataCallback(name),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.Attribute.JsExpressionValue(attribute))
        }
    );
    Attv.registerAttribute('data-target',  
        (name: string) => new Attv.DataTarget(name),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.Attribute.QuerySelectorValue(attribute))
        }
    );
    Attv.registerAttribute('data-timeout', 
        (name: string) => new Attv.DataTimeout(name),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.Attribute.NumberValue(attribute))
        }
    );
    Attv.registerAttribute('data-interval', 
        (name: string) => new Attv.DataInterval(name),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.Attribute.NumberValue(attribute))
        }
    );
    Attv.registerAttribute('data-content', (name: string) => new Attv.DataContent(name));
    Attv.registerAttribute('data-data', (name: string) => new Attv.DataData(name));
    Attv.registerAttribute('data-cache', (name: string) => new Attv.DataCache(name));
    Attv.registerAttribute('data-title', (name: string) => new Attv.DataTitle(name));
    Attv.registerAttribute('data-bind', (name: string) => new Attv.DataBind(name));
    Attv.registerAttribute('data-active', (name: string) => new Attv.DataActive(name));
    Attv.registerAttribute('data-enabled', (name: string) => new Attv.DataEnabled(name));
    Attv.registerAttribute('data-route', (name: string) => new Attv.DataRoute(name));
});

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// DataLoading ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

namespace Attv {
    /**
     * [data-loading]='*'
     */
    export class DataLoading extends Attv.Attribute {
        static readonly UniqueId = 'DataLoading';

        constructor (name: string) {
            super(DataLoading.UniqueId, name, true);

            this.isStrict = true;
        }
    }

    export namespace DataLoading {

        /**
         * [data-loading]='default'
         */
        export class DefaultAttributeValue extends Attv.Attribute.Value  {
            
            constructor (attributeValue: string, 
                attribute: Attv.Attribute) {
                super(attributeValue, attribute);
            }
    
            loadElement(element: HTMLElement): boolean {
                return this.loadSettings<SpinnerSettings>(
                    element,
                    settings => {
                        settings.outerColor = settings.outerColor || Attv.DataLoading.SpinnerSettings.DefaultOuterColor;
                        settings.innerColor = settings.innerColor || Attv.DataLoading.SpinnerSettings.DefaultInnerColor;
                        settings.width = settings.width || Attv.DataLoading.SpinnerSettings.DefaultWidth;
                        settings.height = settings.height || Attv.DataLoading.SpinnerSettings.DefaultHeight;
                        settings.style = SpinnerSettings.getStyle(settings);

                        // apply to the element
                        element.style.borderColor = settings.outerColor;
                        element.style.borderTopColor = settings.innerColor;
                        element.style.height = settings.width;
                        element.style.width = settings.height;
                    }
                );
            }
        }

        export interface SpinnerSettings extends Attv.Attribute.Settings {
            outerColor: string;
            innerColor: string;
            width: string;
            height: string;
        }

        export namespace SpinnerSettings {
            // https://codepen.io/mandelid/pen/vwKoe
            export const DefaultOuterColor = "#c0c0c0"
            export const DefaultInnerColor = "#000000";
            export const DefaultWidth = "25px";
            export const DefaultHeight = "25px";
            // https://codepen.io/mandelid/pen/vwKoe
            export function getStyle(settings: Attv.DataLoading.SpinnerSettings) {
                return `
[data-loading='spinner'],
[data-loading='default'] {
    display: inline-block;
    width: ${settings.width};
    height: ${settings.height};
    border: 3px solid ${settings.outerColor};
    border-radius: 50%;
    border-top-color: ${settings.innerColor};
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
    to { -webkit-transform: rotate(360deg); }
}
`;
            }
        }
    }
}

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-loading', 
        (name: string) => new Attv.DataLoading(name),
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataLoading.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
        });
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

        render(content: string, model: any, element?: HTMLElement, attributeValue?: DataRenderer.DefaultValue): string {       
            if (!attributeValue) {
                attributeValue = this.getValue<DataRenderer.DefaultValue>(element);
            }

            return attributeValue.render(content, model);
        }
    }

    export namespace DataRenderer {

        /**
         * [data-renderer]='default'
         */
        export class DefaultValue extends Attv.Attribute.Value  {
            
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
        export class Json2HtmlValue extends DefaultValue {
    
            private dataBind: DataBind;
            
            constructor (attributeValue: string = 'json2html', attribute: Attv.Attribute) {
                super(attributeValue, attribute);

                this.resolver.requires.push(DataBind.UniqueId);
                this.dataBind = this.resolver.resolve<DataBind>(DataBind.UniqueId);
            }
    
            loadElement(element: HTMLElement): boolean {
                return true;
            }
            
            render(templatedContent: string, model?: any): string {
                model = Attv.parseJsonOrElse<any>(model);

                let templateElement = Attv.createHTMLElement(templatedContent);
                let rootElement = Attv.createHTMLElement('');
    
                this.bind(rootElement, templateElement, model);
    
                return rootElement.attvHtml();
            }
    
            protected bind(parent: HTMLElement, template: HTMLElement, model: any) {
                let allbinds = template.querySelectorAll(this.dataBind.toString());
                for (let i = 0; i < allbinds.length; i++) {
                    let bindElement = allbinds[i] as HTMLElement;
                    
                    let propName = bindElement.attvAttr(this.dataBind);
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
        (attribute: Attv.Attribute, list: Attv.Attribute.Value[]) => {
            list.push(new Attv.DataRenderer.DefaultValue(Attv.configuration.defaultTag, attribute));
            list.push(new Attv.DataRenderer.Json2HtmlValue('json2Html', attribute));
        });
});