var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Attv;
(function (Attv) {
    /**
     * Version. This should be replaced and updated by the CI/CD process
     */
    Attv.version = '0.0.1';
})(Attv || (Attv = {}));
Element.prototype.attvHtml = function (html) {
    var _a, _b;
    var element = this;
    if (Attv.isUndefined(html)) {
        return element.innerHTML;
    }
    else {
        element.innerHTML = html;
        if (html) {
            // look for scripts
            var innerHtmlElement = Attv.createHTMLElement(html);
            var scripts = innerHtmlElement.querySelectorAll('script');
            for (var i = 0; i < scripts.length; i++) {
                if ((_b = (_a = scripts[i].type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.contains('javascript')) {
                    eval(scripts[i].text);
                }
            }
        }
    }
};
HTMLElement.prototype.attvShow = function () {
    var element = this;
    var dataStyle = Attv.parseJsonOrElse(element.attvAttr('data-style')) || {};
    if (dataStyle.display) {
        element.style.display = dataStyle === null || dataStyle === void 0 ? void 0 : dataStyle.display;
    }
    else {
        element.style.display = 'block';
    }
};
HTMLElement.prototype.attvHide = function () {
    var element = this;
    var dataStyle = Attv.parseJsonOrElse(element.attvAttr('data-style')) || {};
    if (element.style.display !== 'none') {
        dataStyle.display = element.style.display;
        element.attvAttr('data-style', dataStyle);
    }
    element.style.display = 'none';
};
HTMLElement.prototype.attvAttr = function (name, value) {
    var _a, _b;
    name = (_b = (_a = name === null || name === void 0 ? void 0 : name.toString()) === null || _a === void 0 ? void 0 : _a.replace('[', '')) === null || _b === void 0 ? void 0 : _b.replace(']', '');
    var element = this;
    var datasetName = (name === null || name === void 0 ? void 0 : name.startsWith('data-')) && name.replace(/^data\-/, '').dashToCamelCase();
    // element.attr()
    if (Attv.isUndefined(name)) {
        var atts = {};
        for (var i = 0; i < element.attributes.length; i++) {
            var attName = element.attributes[i].name;
            var value_1 = Attv.parseJsonOrElse(element.attributes[i].value);
            atts[attName] = value_1;
        }
        // returns all attributes
        return atts;
    }
    // element.attr('data')
    if (name === 'data') {
        if (Attv.isUndefined(value)) {
            // get all data 
            var keys = Object.keys(element.dataset);
            var data_1 = {};
            keys.map(function (key) { return data_1[key] = element.dataset[key]; });
            return data_1;
        }
        else if (Attv.isObject(value)) {
            var keys = Object.keys(element.dataset);
            keys.forEach(function (key) { return delete element.dataset[key]; });
            var newKeys = Object.keys(value);
            newKeys.forEach(function (key) { return element.dataset[key] = value[key]; });
        }
        else {
            throw Error('Only object can be assigned to dataset');
        }
    }
    // element.attr('name')
    else if (Attv.isDefined(value)) {
        if (datasetName) {
            if (Attv.isObject(value)) {
                value = JSON.stringify(value);
            }
            element.dataset[datasetName] = value;
            return this;
        }
        else {
            // just attribute
            element.setAttribute(name, value);
        }
        return element;
    }
    // element.attr('name', 'value')
    else {
        value = element.dataset[datasetName];
        if (!value) {
            // get from the attrbitue
            value = element.getAttribute(name) || undefined;
        }
        return Attv.parseJsonOrElse(value);
    }
};
String.prototype.contains = function (text) {
    var obj = this;
    return obj.indexOf(text) >= 0;
};
String.prototype.startsWith = function (text) {
    var obj = this;
    return obj.indexOf(text) == 0;
};
String.prototype.endsWith = function (text) {
    var obj = this;
    return obj.indexOf(text, this.length - text.length) !== -1;
};
String.prototype.camelCaseToDash = function () {
    var text = this;
    return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
String.prototype.dashToCamelCase = function () {
    var text = this;
    return text.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
    });
};
String.prototype.equalsIgnoreCase = function (other) {
    var text = this;
    return (text === null || text === void 0 ? void 0 : text.toLowerCase()) === (other === null || other === void 0 ? void 0 : other.toLowerCase());
};
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Attv.Ajax ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Ajax;
    (function (Ajax) {
        function sendAjax(options) {
            var _a;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (e) {
                var xhr = this;
                if (xhr.readyState == 4) {
                    var wasSuccessful = this.status >= 200 && this.status < 400;
                    options === null || options === void 0 ? void 0 : options._internalCallback(options, wasSuccessful, xhr);
                }
            };
            xhr.onerror = function (e) {
                options === null || options === void 0 ? void 0 : options._internalCallback(options, false, xhr);
            };
            // header
            (_a = options.headers) === null || _a === void 0 ? void 0 : _a.forEach(function (header) { return xhr.setRequestHeader(header.name, header.value); });
            // last check
            if (Attv.isUndefined(options.url))
                throw new Error('url is empty');
            xhr.open(options.method, options.url, true);
            xhr.send();
        }
        Ajax.sendAjax = sendAjax;
        function buildUrl(option) {
            if (Attv.isUndefined(option.url))
                return undefined;
            var url = option.url;
            if (option.method === 'get') {
                url += "?" + objectToQuerystring(option.data);
            }
            return url;
        }
        Ajax.buildUrl = buildUrl;
        function objectToQuerystring(any) {
            if (!any)
                return '';
            if (Attv.isString(any)) {
                any = Attv.parseJsonOrElse(any);
                if (Attv.isString(any)) {
                    return any;
                }
            }
            return Object.keys(any)
                .sort()
                .map(function (key) {
                return window.encodeURIComponent(key)
                    + '='
                    + window.encodeURIComponent(any[key]);
            })
                .join('&');
        }
        Ajax.objectToQuerystring = objectToQuerystring;
    })(Ajax = Attv.Ajax || (Attv.Ajax = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Base classes ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    /**
    * Base class for data-attributes
    */
    var Attribute = /** @class */ (function () {
        /**
         *
         * @param uniqueId unique id
         * @param name  the attribute name
         * @param description description
         * @param isAutoLoad is auto-load
         */
        function Attribute(uniqueId, name, isAutoLoad) {
            if (isAutoLoad === void 0) { isAutoLoad = false; }
            this.uniqueId = uniqueId;
            this.name = name;
            this.isAutoLoad = isAutoLoad;
            this.values = [];
            this.dependency = new Attribute.Dependency();
            /**
             * zero-index priority
             */
            this.priority = 1;
            /**
             * When set to true. All attribute values needs to be registered.
             * NO wildcard.
             */
            this.isStrict = false;
            this.loadedName = this.name + "-loaded";
            this.settingsName = this.name + "-settings";
            this.dependency.internals.push(Attv.DataSettings.UniqueId);
        }
        /**
         * Register attribute values
         * @param attributeValues attribute values
         */
        Attribute.prototype.registerAttributeValues = function (attributeValues) {
            var _a, _b, _c, _d;
            // add dependency
            for (var i = 0; i < attributeValues.length; i++) {
                // add dependency
                (_a = attributeValues[i].resolver.requires).push.apply(_a, this.dependency.requires);
                (_b = attributeValues[i].resolver.uses).push.apply(_b, this.dependency.uses);
                (_c = attributeValues[i].resolver.internals).push.apply(_c, this.dependency.internals);
            }
            (_d = this.values).push.apply(_d, attributeValues);
        };
        /**
         * Checks to see if this attribute exists in this element
         * @param element the element
         */
        Attribute.prototype.exists = function (element) {
            return !!(element === null || element === void 0 ? void 0 : element.attvAttr(this.name));
        };
        /**
         * Returns the current attribute value
         * @param element the element
         */
        Attribute.prototype.getValue = function (element) {
            var value = element === null || element === void 0 ? void 0 : element.attvAttr(this.name);
            var attributeValue = this.values.filter(function (val) { var _a; return (_a = val.getRaw(element)) === null || _a === void 0 ? void 0 : _a.equalsIgnoreCase(value); })[0];
            // Print/throw an error
            // when no 'attributeValue' found and there's 'element' to evaluate and isStrict is marked true
            if (!attributeValue && this.isStrict) {
                Attv.log('fatal', this + "='" + (value || '') + "' is not valid", element);
            }
            // #1. if attribute is undefined
            // find the one with the default tag
            if (!attributeValue) {
                attributeValue = this.values.filter(function (val) { var _a; return (_a = val.getRaw(element)) === null || _a === void 0 ? void 0 : _a.equalsIgnoreCase(Attv.configuration.defaultTag); })[0];
            }
            // #2. find the first attribute
            if (!attributeValue) {
                attributeValue = this.values[0];
            }
            // #3. generic attribute
            if (!attributeValue) {
                var rawAttributeValue = element === null || element === void 0 ? void 0 : element.attvAttr(this.name);
                attributeValue = new Attribute.Value(rawAttributeValue, this);
            }
            return attributeValue;
        };
        /**
         * Checks to see if element is loaded
         * @param element element to check
         */
        Attribute.prototype.isElementLoaded = function (element) {
            var isLoaded = element.attvAttr(this.loadedName);
            return isLoaded === 'true' || !!isLoaded;
        };
        /**
         * Mark element as loaded or not loaded
         * @param element the element to mark
         * @param isLoaded is loaded?
         */
        Attribute.prototype.markElementLoaded = function (element, isLoaded) {
            element.attvAttr(this.loadedName, isLoaded);
            return isLoaded;
        };
        /**
         * String representation
         */
        Attribute.prototype.toString = function () {
            return "[" + this.name + "]";
        };
        return Attribute;
    }());
    Attv.Attribute = Attribute;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Attv.Attributes /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Attribute;
    (function (Attribute) {
        /**
         * Base class for attribute-value
         */
        var Value = /** @class */ (function () {
            function Value(value, attribute, validators) {
                if (validators === void 0) { validators = []; }
                this.value = value;
                this.attribute = attribute;
                this.validators = validators;
                this.resolver = new Resolver(this);
            }
            /**
             * Returns raw string
             */
            Value.prototype.getRaw = function (element) {
                var _a;
                return ((_a = this.value) === null || _a === void 0 ? void 0 : _a.toString()) || (element === null || element === void 0 ? void 0 : element.attvAttr(this.attribute.name));
            };
            /**
             * Load element
             * @param element the Element
             */
            Value.prototype.loadElement = function (element) {
                return true;
            };
            /**
             *
             * @param element the element
             * @param orDefault (optional) default settings
             */
            Value.prototype.loadSettings = function (element, callback) {
                var dataSettings = this.resolver.resolve(Attv.DataSettings.UniqueId);
                this.settings = dataSettings.getSettingsForValue(this, element);
                if (this.settings) {
                    if (callback) {
                        callback(this.settings);
                    }
                    Attv.Attribute.Settings.commit(this.settings);
                }
                return true;
            };
            /**
             * To string
             */
            Value.prototype.toString = function (prettyPrint) {
                if (prettyPrint) {
                    return "[" + this.attribute.name + "]='" + (this.value || '*') + "'";
                }
                else {
                    return "[" + this.attribute.name + "]" + (this.value ? "=" + this.value : '');
                }
            };
            return Value;
        }());
        Attribute.Value = Value;
        var Dependency = /** @class */ (function () {
            function Dependency() {
                /**
                 * List of attribute Ids that we require
                 */
                this.requires = [];
                /**
                 * List of attribute Id that we use
                 */
                this.uses = [];
                /**
                 * List of attribute Id that we internvally use
                 */
                this.internals = [];
            }
            /**
             * List of all dependencies
             */
            Dependency.prototype.allDependencies = function () {
                return this.requires.concat(this.uses).concat(this.internals);
            };
            return Dependency;
        }());
        Attribute.Dependency = Dependency;
        var Resolver = /** @class */ (function (_super) {
            __extends(Resolver, _super);
            function Resolver(attributeValue) {
                var _this = _super.call(this) || this;
                _this.attributeValue = attributeValue;
                return _this;
            }
            /**
             * Returns the data attribute
             * @param attributeId id
             */
            Resolver.prototype.resolve = function (attributeId) {
                var attribute = Attv.getAttribute(attributeId);
                if (!this.allDependencies().some(function (dep) { return dep === attributeId; })) {
                    Attv.log('warning', (attribute || attributeId) + " should be declared as the dependant in " + this.attributeValue.attribute + ". This is for documentation purposes");
                }
                if (!attribute) {
                    throw new Error((attribute || attributeId) + " can not be found. Did you register " + (attribute || attributeId) + "?");
                }
                return attribute;
            };
            /**
             * Adds a dependency data attribute to the 'element'
             * @param element the element
             * @param value the value
             */
            Resolver.prototype.addAttribute = function (uniqueId, element, any) {
                var attribute = this.resolve(uniqueId);
                element.attvAttr(attribute.name, any);
            };
            return Resolver;
        }(Dependency));
        Attribute.Resolver = Resolver;
    })(Attribute = Attv.Attribute || (Attv.Attribute = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////// Attv.Attribute.Settings /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Attribute;
    (function (Attribute) {
        var Settings;
        (function (Settings) {
            function commit(settings) {
                var apply = true;
                if (settings.style) {
                    var elementId = 'style-' + settings.attributeValue.attribute.settingsName;
                    var styleElement = document.querySelector("style#" + elementId);
                    apply = settings.override || !styleElement;
                    if (!styleElement) {
                        styleElement = Attv.createHTMLElement('<style>');
                        styleElement.id = elementId;
                        document.head.append(styleElement);
                    }
                    if (apply) {
                        styleElement.innerHTML = settings.style;
                    }
                }
                if (settings.styleUrls) {
                    settings.styleUrls.forEach(function (styleUrl) {
                        var _a, _b;
                        var elementId = "link-" + styleUrl.name + "-" + settings.attributeValue.attribute.settingsName;
                        var linkElement = document.querySelector("link#" + elementId);
                        apply = settings.override || !linkElement;
                        if (!linkElement) {
                            linkElement = Attv.createHTMLElement('<link>');
                            document.head.append(linkElement);
                        }
                        if (apply) {
                            linkElement.id = elementId;
                            linkElement.rel = "stylesheet";
                            linkElement.href = styleUrl.url;
                            linkElement.integrity = (_a = styleUrl.options) === null || _a === void 0 ? void 0 : _a.integrity;
                            linkElement.crossOrigin = (_b = styleUrl.options) === null || _b === void 0 ? void 0 : _b.crossorigin;
                        }
                    });
                }
                if (settings.jsUrls) {
                    settings.jsUrls.forEach(function (jsUrl) {
                        var _a, _b;
                        var elementId = "script-" + jsUrl.name + "-" + settings.attributeValue.attribute.settingsName;
                        var scriptElement = document.querySelector("script#" + elementId);
                        apply = settings.override || !scriptElement;
                        if (!scriptElement) {
                            scriptElement = Attv.createHTMLElement('<script>');
                            document.body.append(scriptElement);
                        }
                        if (apply) {
                            scriptElement.id = elementId;
                            scriptElement.src = jsUrl.url;
                            scriptElement.integrity = (_a = jsUrl.options) === null || _a === void 0 ? void 0 : _a.integrity;
                            scriptElement.crossOrigin = (_b = jsUrl.options) === null || _b === void 0 ? void 0 : _b.crossorigin;
                            scriptElement.onload = function () { return Attv.loadElements(); };
                        }
                    });
                }
            }
            Settings.commit = commit;
        })(Settings = Attribute.Settings || (Attribute.Settings = {}));
    })(Attribute = Attv.Attribute || (Attv.Attribute = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
///////////////////////// 1st class attributes /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    /**
     * [data-settings]='*|json'
     */
    var DataSettings = /** @class */ (function (_super) {
        __extends(DataSettings, _super);
        function DataSettings(name) {
            return _super.call(this, DataSettings.UniqueId, name) || this;
        }
        /**
         * Returns the option object (json)
         * @param element the element
         */
        DataSettings.prototype.getSettings = function (element) {
            var rawValue = this.getValue(element).getRaw(element);
            var settings = DataSettings.parseSettings(rawValue);
            return settings;
        };
        DataSettings.prototype.getSettingsForValue = function (value, element) {
            var rawValue = element.attvAttr(value.attribute.settingsName);
            var settings = DataSettings.parseSettings(rawValue);
            settings.attributeValue = settings.attributeValue || value;
            return settings;
        };
        DataSettings.parseSettings = function (rawValue) {
            // does it look like json?
            if ((rawValue === null || rawValue === void 0 ? void 0 : rawValue.startsWith('{')) && (rawValue === null || rawValue === void 0 ? void 0 : rawValue.endsWith('}'))) {
                rawValue = "(" + rawValue + ")";
            }
            // json ex: ({ name: 'value' }). so we just 
            if (Attv.isEvaluatable(rawValue)) {
                //do eval
                rawValue = Attv.eval(rawValue);
            }
            return Attv.parseJsonOrElse(rawValue) || {};
        };
        DataSettings.UniqueId = 'DataSettings';
        return DataSettings;
    }(Attv.Attribute));
    Attv.DataSettings = DataSettings;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Validators //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Validators;
    (function (Validators) {
        /**
         * DOM is required to have an attribute specified by attribute ids
         */
        var RequiredAttribute = /** @class */ (function () {
            function RequiredAttribute(requiredAttributeIds) {
                this.requiredAttributeIds = requiredAttributeIds;
                // do nothing
            }
            RequiredAttribute.prototype.validate = function (value, element) {
                var isValidated = true;
                var attributes = this.requiredAttributeIds.map(function (attId) { return Attv.getAttribute(attId); });
                // check for other require attributes
                for (var i = 0; i < attributes.length; i++) {
                    var attribute = attributes[i];
                    var attributeValue = attribute.getValue(element);
                    if (!(attributeValue === null || attributeValue === void 0 ? void 0 : attributeValue.getRaw(element))) {
                        Attv.log('error', value.toString(true) + " is requiring " + attribute + " to be present in DOM", element);
                    }
                    isValidated = isValidated && !!attribute;
                }
                return isValidated;
            };
            return RequiredAttribute;
        }());
        Validators.RequiredAttribute = RequiredAttribute;
        /**
         * DOM is required to have an attribute of [name]=[value]
         */
        var RequiredAttributeWithValue = /** @class */ (function () {
            function RequiredAttributeWithValue(requiredAttributes) {
                this.requiredAttributes = requiredAttributes;
                // do nothing
            }
            RequiredAttributeWithValue.prototype.validate = function (value, element) {
                var isValidated = true;
                // check for other require attributes
                for (var i = 0; i < this.requiredAttributes.length; i++) {
                    var attribute = this.requiredAttributes[i];
                    var requiredAttribute = element.attvAttr(attribute.name);
                    if (!requiredAttribute.equalsIgnoreCase(attribute.value)) {
                        Attv.log('error', value.toString(true) + " is requiring [" + attribute.name + "]='" + attribute.value + "' to be present in DOM", element);
                    }
                    isValidated = isValidated && !!requiredAttribute;
                }
                return isValidated;
            };
            return RequiredAttributeWithValue;
        }());
        Validators.RequiredAttributeWithValue = RequiredAttributeWithValue;
        /**
         * Requirement Any element
         */
        var RequiredElement = /** @class */ (function () {
            function RequiredElement(elementTagNames) {
                this.elementTagNames = elementTagNames;
                // do nothing
            }
            RequiredElement.prototype.validate = function (value, element) {
                var isValidated = false;
                // check for element that this attribute belongs to
                for (var i = 0; i < this.elementTagNames.length; i++) {
                    var elementName = this.elementTagNames[i];
                    if (element.tagName.equalsIgnoreCase(elementName)) {
                        isValidated = true;
                        break;
                    }
                }
                if (!isValidated) {
                    Attv.log('error', value.toString(true) + " can only be attached to elements [" + this.elementTagNames + "]", element);
                }
                return isValidated;
            };
            return RequiredElement;
        }());
        Validators.RequiredElement = RequiredElement;
    })(Validators = Attv.Validators || (Attv.Validators = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Configuration ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DefaultConfiguration = /** @class */ (function () {
        function DefaultConfiguration() {
            this.isDebug = true;
            this.isLoggingEnabled = true;
        }
        Object.defineProperty(DefaultConfiguration.prototype, "defaultTag", {
            get: function () {
                return "default";
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DefaultConfiguration.prototype, "logLevels", {
            get: function () {
                return ['log', 'warning', 'error', 'debug', 'fatal'];
            },
            enumerable: false,
            configurable: true
        });
        return DefaultConfiguration;
    }());
    Attv.DefaultConfiguration = DefaultConfiguration;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Attv.DomParser ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Dom;
    (function (Dom) {
        Dom.htmlTags = [
            { tag: 'tr', parentTag: 'tbody' },
            { tag: 'th', parentTag: 'thead' },
            { tag: 'td', parentTag: 'tr' },
        ];
        function getParentTag(elementOrTag) {
            var _a, _b;
            var tagName = ((_a = elementOrTag) === null || _a === void 0 ? void 0 : _a.tagName) || elementOrTag;
            var parentTag = (_b = Attv.Dom.htmlTags.filter(function (tag) { return tag.tag.equalsIgnoreCase(tagName); })[0]) === null || _b === void 0 ? void 0 : _b.parentTag;
            if (!parentTag) {
                parentTag = 'div';
            }
            return parentTag;
        }
        Dom.getParentTag = getParentTag;
        function createHTMLElement(tagName, innerHtml) {
            var parentTag = getParentTag(tagName);
            var htmlElement = document.createElement(parentTag);
            htmlElement.innerHTML = innerHtml;
            return htmlElement;
        }
        Dom.createHTMLElement = createHTMLElement;
        function parseDom(any) {
            if (Attv.isString(any)) {
                var text = any;
                var htmlElement = void 0;
                var tag = text.toString();
                if (tag.startsWith('<') && tag.endsWith('>')) {
                    var tempTag = tag.substring(1, tag.length - 1);
                    try {
                        htmlElement = window.document.createElement(tempTag);
                    }
                    catch (e) {
                        // ignore
                    }
                }
                if (!htmlElement) {
                    try {
                        if (!Attv.Dom.domParser) {
                            Attv.Dom.domParser = new DOMParser();
                        }
                        var domDocument = Attv.Dom.domParser.parseFromString(text, 'text/xml');
                        tag = domDocument.firstElementChild.tagName;
                        if (domDocument.querySelector('parsererror')) {
                            tag = 'div';
                        }
                    }
                    catch (e) {
                        // ignore
                    }
                    htmlElement = Attv.Dom.createHTMLElement(tag, text);
                }
                any = htmlElement;
            }
            return any;
        }
        Dom.parseDom = parseDom;
    })(Dom = Attv.Dom || (Attv.Dom = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Helper functions ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var idCounter = 0;
    function isUndefined(any) {
        return isType(any, 'undefined');
    }
    Attv.isUndefined = isUndefined;
    function isDefined(any) {
        return !isType(any, 'undefined');
    }
    Attv.isDefined = isDefined;
    function isString(any) {
        return isType(any, 'string');
    }
    Attv.isString = isString;
    function isObject(any) {
        return isType(any, 'object');
    }
    Attv.isObject = isObject;
    function isType(any, expectedType) {
        return typeof (any) === expectedType;
    }
    Attv.isType = isType;
    function isEvaluatable(any) {
        return (any === null || any === void 0 ? void 0 : any.startsWith('(')) && (any === null || any === void 0 ? void 0 : any.endsWith(')'));
    }
    Attv.isEvaluatable = isEvaluatable;
    function eval(any) {
        return window.eval(any);
    }
    Attv.eval = eval;
    function navigate(url, target) {
        if (target) {
            window.open(url, target);
        }
        else {
            window.location.href = url;
        }
    }
    Attv.navigate = navigate;
    function createHTMLElement(any) {
        return Attv.Dom.parseDom(any);
    }
    Attv.createHTMLElement = createHTMLElement;
    function parseJsonOrElse(any) {
        try {
            any = JSON.parse(any);
        }
        catch (_a) {
            // nothing
        }
        return any;
    }
    Attv.parseJsonOrElse = parseJsonOrElse;
    function generateElementId(attributeId) {
        attributeId = attributeId.camelCaseToDash();
        idCounter++;
        return attributeId + '-' + idCounter;
    }
    Attv.generateElementId = generateElementId;
    function log() {
        var _a;
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (!Attv.configuration.isLoggingEnabled && data[0] !== 'fatal') {
            return;
        }
        var level = data[0];
        if (((_a = Attv.configuration.logLevels) === null || _a === void 0 ? void 0 : _a.indexOf(level)) >= 0) {
            data = data.splice(1);
        }
        if (level === 'warning') {
            console.warn.apply(console, data);
        }
        else if (level === 'error') {
            console.error.apply(console, data);
        }
        else if (level === 'fatal') {
            console.error.apply(console, data);
            throw new (Error.bind.apply(Error, __spreadArrays([void 0], data)))();
        }
        else if (level === 'debug') {
            console.debug.apply(console, data);
        }
        else {
            console.log.apply(console, data);
        }
    }
    Attv.log = log;
    function onDocumentReady(fn) {
        // without jQuery (doesn't work in older IEs)
        document.addEventListener('DOMContentLoaded', fn, false);
    }
    Attv.onDocumentReady = onDocumentReady;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Attv Functions ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    Attv.attributes = [];
    Attv.loader = {
        init: [],
        pre: [],
        post: []
    };
    function loadElements(root) {
        if (Attv.isUndefined(root)) {
            root = document.querySelector('html');
        }
        Attv.log('debug', 'Loading element', root);
        // auto load all attvs that are marked auto load
        Attv.attributes.filter(function (attribute) { return attribute.isAutoLoad; }).sort(function (a, b) { return a.priority < b.priority ? -1 : 0; }).forEach(function (attribute, index) {
            var elements = root.querySelectorAll("" + attribute);
            elements.forEach(function (element, index) {
                try {
                    // #1. If it's already loaded return
                    if (attribute.isElementLoaded(element))
                        return;
                    var attributeValue = attribute.getValue(element);
                    // #2. Check if the attribute value is supported
                    if (!attributeValue) {
                        var attributeValue_1 = element.attvAttr(attribute.name);
                        Attv.log('warning', attribute + " does not support " + attribute + "='" + attributeValue_1 + "'", element);
                        return;
                    }
                    // #3. Validate
                    var isValidated = true;
                    for (var i = 0; i < attributeValue.validators.length; i++) {
                        var validator = attributeValue.validators[i];
                        isValidated = isValidated = validator.validate(attributeValue, element);
                    }
                    if (!isValidated) {
                        return;
                    }
                    // #4. Load the stuff!
                    var isLoaded = attributeValue.loadElement(element);
                    if (isLoaded) {
                        attribute.markElementLoaded(element, isLoaded);
                    }
                }
                catch (error) {
                    Attv.log('error', "Unexpected error occurred when loading " + attribute, error, element);
                }
            });
        });
    }
    Attv.loadElements = loadElements;
    function getAttribute(id) {
        return Attv.attributes.filter(function (att) { return att.uniqueId == id; })[0];
    }
    Attv.getAttribute = getAttribute;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Attv Registrations ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var attributeRegistrar = [];
    var valueRegistrar = [];
    function registerAttribute(attributeName, fn, valuesFn) {
        var registry = new AttributeRegistration(attributeName, fn, valuesFn);
        attributeRegistrar.push(registry);
    }
    Attv.registerAttribute = registerAttribute;
    function registerAttributeValue(id, valuesFn) {
        var registry = new ValueRegistration(id, valuesFn);
        valueRegistrar.push(registry);
    }
    Attv.registerAttributeValue = registerAttributeValue;
    /**
     * This only work during loader.pre
     * @param attributeName attribute name
     */
    function unregisterAttribute(attributeName) {
        var attributes = attributeRegistrar.filter(function (factory) { return factory.attributeName !== attributeName; });
        attributeRegistrar.splice(0, attributeRegistrar.length);
        attributeRegistrar.push.apply(attributeRegistrar, attributes);
    }
    Attv.unregisterAttribute = unregisterAttribute;
    var AttributeRegistration = /** @class */ (function () {
        function AttributeRegistration(attributeName, fn, valuesFn) {
            this.attributeName = attributeName;
            this.fn = fn;
            this.valuesFn = valuesFn;
            // do nothing
        }
        AttributeRegistration.prototype.register = function () {
            var attribute = this.fn(this.attributeName);
            Attv.log('debug', "" + attribute, attribute);
            var attributeValues = [];
            if (this.valuesFn) {
                this.valuesFn(attribute, attributeValues);
            }
            // from valueRegistrar
            valueRegistrar.filter(function (r) { return r.attributeUniqueId === attribute.uniqueId; }).forEach(function (r) {
                r.register(attribute, attributeValues);
            });
            var values = attributeValues.reverse();
            attribute.registerAttributeValues(values);
            if (attributeValues.length > 0) {
                Attv.log('debug', "" + attributeValues.map(function (v) { return v.toString(true); }), attributeValues);
            }
            return attribute;
        };
        return AttributeRegistration;
    }());
    var ValueRegistration = /** @class */ (function () {
        function ValueRegistration(attributeUniqueId, register) {
            this.attributeUniqueId = attributeUniqueId;
            this.register = register;
            // do nothing
        }
        return ValueRegistration;
    }());
    function initialize() {
        if (!Attv.configuration) {
            Attv.configuration = new Attv.DefaultConfiguration();
        }
    }
    function preRegister() {
        Attv.log('Attv v.' + Attv.version);
    }
    function register() {
        for (var i = 0; i < attributeRegistrar.length; i++) {
            var attribute = attributeRegistrar[i].register();
            Attv.attributes.push(attribute);
        }
    }
    function cleanup() {
        attributeRegistrar = [];
        valueRegistrar = [];
    }
    Attv.loader.init.push(initialize);
    Attv.loader.pre.push(preRegister);
    Attv.loader.post.push(register);
    Attv.loader.post.push(Attv.loadElements);
    Attv.loader.post.push(cleanup);
})(Attv || (Attv = {}));
Attv.onDocumentReady(function () {
    for (var i = 0; i < Attv.loader.init.length; i++) {
        Attv.loader.init[i]();
    }
    for (var i = 0; i < Attv.loader.pre.length; i++) {
        Attv.loader.pre[i]();
    }
    for (var i = 0; i < Attv.loader.post.length; i++) {
        Attv.loader.post[i]();
    }
    Attv.loader.init = [];
    Attv.loader.pre = [];
    Attv.loader.post = [];
});

//# sourceMappingURL=attv.js.map
