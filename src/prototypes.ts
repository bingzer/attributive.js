////////////////////////////////////////////////////////////////////////////////////
//////////////////////// HTMLElement.Prototypes ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

interface HTMLElement  {

    /**
     * Gets/Sets html.
     * Will execute javascript inside also
     */
    attvHtml: (html?: string) => string | any;

    /**
     * Attribute helper.
     * value can be an object
     */
    attvAttr: (name?: string | Attv.Attribute, value?: any) => HTMLElement | any;

    /**
     * Show
     */
    attvShow: () => any;

    /**
     * HIde
     */
    attvHide: () => any;
}

HTMLElement.prototype.attvHtml = function (html?: string): string | any {
    let element = this as HTMLElement;

    if (Attv.isUndefined(html)) {
        return element.innerHTML;
    } else {
        element.innerHTML = html;
    }
}

HTMLElement.prototype.attvShow = function () {
    let element = this as HTMLElement;
    
    // just remove display:none if any
    let display = element.style.display;
    if (display.equalsIgnoreCase("none")) {
        element.style.removeProperty("display");
    }
}

HTMLElement.prototype.attvHide = function () {
    let element = this as HTMLElement;
    
    element.style.display = "none";
}

HTMLElement.prototype.attvAttr = function (name: string | Attv.Attribute, value?: any): HTMLElement | any {
    if (name instanceof Attv.Attribute) {
        let att = name as Attv.Attribute;
        return this.attvAttr(att.name, value);
    }

    name = name?.toString()?.replace('[', '')?.replace(']', '');

    let element = this as HTMLElement;
    let datasetName = name?.startsWith('data-') && name.replace(/^data\-/, '').dashToCamelCase();

    // GETTER: element.attr()
    if (Attv.isUndefined(name)) {
        let atts = {};
        for (let i = 0; i < element.attributes.length; i++) {
            let attName = element.attributes[i].name;
            let value = Attv.parseJsonOrElse(element.attributes[i].value);

            atts[attName] = value;
        }
        // returns all attributes
        return atts;
    }
    // SETTER: element.attr('data-xxx', 'value')
    else if (name === 'data') {
        if (Attv.isUndefined(value)) {
            // get all data 
            let keys = Object.keys(element.dataset);
            let data = {};
            keys.map(key => data[key] = element.dataset[key]);

            return data;
        }
        else if (Attv.isObject(value)){
            let keys = Object.keys(element.dataset);
            keys.forEach(key => delete element.dataset[key]);

            let newKeys = Object.keys(value);
            newKeys.forEach(key => element.dataset[key] = value[key]);
        } else {
            throw Error('Only object can be assigned to dataset');
        }
    }
    // SETTER: element.attr('name', 'value')
    else if (Attv.isDefined(value)) {
        if (datasetName) {
            if (Attv.isObject(value)) {
                value = JSON.stringify(value);
            }
    
            element.dataset[datasetName] = value;
            return this;
        } else {
            // just attribute
            element.setAttribute(name, value);
        }

        return element;
    } 
    // GETTER: element.attr('name')
    else {
        value = element.dataset[datasetName];

        if (Attv.isUndefined(value)) {
            // get from the attrbitue
            value = element.getAttribute(name) || undefined;
        }

        return Attv.parseJsonOrElse(value);
    }
}

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// String.Prototypes //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

interface String {
    contains: (text: string) => boolean;
    equalsIgnoreCase: (other: string) => boolean;
    camelCaseToDash: () => string;
    dashToCamelCase: () => string;
    underscoreToDash: () => string;
}

if (typeof String.prototype.contains !== 'function') {
    String.prototype.contains = function (text: string): boolean {
        let obj: string = this as string;
    
        return obj.indexOf(text) >= 0;
    }
}

if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (text: string): boolean {
        let obj: string = this as string;

        return obj.indexOf(text) == 0;
    }
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (text: string): boolean {
        let obj: string = this as string;

        return obj.indexOf(text, this.length - text.length) !== -1;
    }
}

if (typeof String.prototype.camelCaseToDash !== 'function') {
    String.prototype.camelCaseToDash = function (): string {
        let text: string = this as string;

        if (/^[A-Z]/.test(text as string)) {
            text = '-' + text;
        }

        return text.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
    }
}

if (typeof String.prototype.dashToCamelCase !== 'function') {
    String.prototype.dashToCamelCase = function (): string {
        let text: string = this as string;

        return text.toLowerCase().replace(/-(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    }
}

if (typeof String.prototype.underscoreToDash !== 'function') {
    String.prototype.underscoreToDash = function (): string {
        let text: string = this as string;

        return text.replace( /_/g, '-' ).toLowerCase();
    }
}

if (typeof String.prototype.equalsIgnoreCase !== 'function') {
    String.prototype.equalsIgnoreCase = function (other: string): boolean {
        let text: string = this as string;

        return text?.toLowerCase() === other?.toLowerCase();
    }
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IE polyfill ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

if (typeof NodeList.prototype.forEach !== 'function') {
    (NodeList as any).prototype.forEach = Array.prototype.forEach
}

if (!Element.prototype.matches) {
    Element.prototype.matches = (<any>Element.prototype).msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.append) {
    Element.prototype.append = Element.prototype.appendChild || Element.prototype.insertBefore;
}

if (!Element.prototype.remove) {
    Element.prototype.remove = function () {
        this.parentNode.removeChild(this);
    }
}

if (!Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedOptions')) {
    Object.defineProperty(HTMLSelectElement.prototype, 'selectedOptions', { 
        get: function () {
            let options = [].slice.call(this.options);
            let selectedOptions = options.filter((opt: HTMLOptionElement) => opt.selected);
            return selectedOptions;
        }
    });
}

// -- CustomEvent polyfill
(() => {
    if (typeof window.CustomEvent === 'function')
        return;

    function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		let evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    (window as any).CustomEvent = CustomEvent;
})();