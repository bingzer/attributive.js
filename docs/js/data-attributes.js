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
var Attv;
(function (Attv) {
    /**
     * [data-url]='*'
     */
    var DataUrl = /** @class */ (function (_super) {
        __extends(DataUrl, _super);
        function DataUrl(name) {
            var _this = _super.call(this, DataUrl.UniqueId, name) || this;
            _this.dependency.requires.push(DataMethod.UniqueId, DataData.UniqueId, DataCache.UniqueId);
            return _this;
        }
        DataUrl.prototype.getUrl = function (element) {
            var attributeValue = this.getValue(element);
            var url = attributeValue.getRaw(element);
            // [data-method]
            var dataMethod = attributeValue.resolver.resolve(DataMethod.UniqueId);
            var method = dataMethod.getMethod(element);
            if (method === 'get') {
                // [data-data]
                var dataData = attributeValue.resolver.resolve(DataData.UniqueId);
                var data = dataData.getData(element);
                url = Attv.Ajax.buildUrl({ url: url, method: method, data: data });
            }
            // [data-cache]
            var dataCache = attributeValue.resolver.resolve(DataCache.UniqueId);
            if (!dataCache.useCache(element)) {
                if (url.contains('?')) {
                    url += "&_=" + Date.now();
                }
                else {
                    url += "?_=" + Date.now();
                }
            }
            return url;
        };
        DataUrl.UniqueId = 'DataUrl';
        return DataUrl;
    }(Attv.Attribute));
    Attv.DataUrl = DataUrl;
    (function (DataUrl) {
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attribute) {
                return _super.call(this, undefined, attribute) || this;
            }
            DefaultValue.prototype.getRaw = function (element) {
                var _a, _b;
                var rawValue = _super.prototype.getRaw.call(this, element);
                // <form action='/'></form>
                if (!rawValue && ((_a = element === null || element === void 0 ? void 0 : element.tagName) === null || _a === void 0 ? void 0 : _a.equalsIgnoreCase('form'))) {
                    // get from action attribute
                    rawValue = element.attvAttr('action');
                }
                // <a href='/'></form>
                if (!rawValue && ((_b = element === null || element === void 0 ? void 0 : element.tagName) === null || _b === void 0 ? void 0 : _b.equalsIgnoreCase('a'))) {
                    rawValue = element.attvAttr('href');
                }
                return rawValue;
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataUrl.DefaultValue = DefaultValue;
    })(DataUrl = Attv.DataUrl || (Attv.DataUrl = {}));
    /**
     * [data-method]='*'
     */
    var DataMethod = /** @class */ (function (_super) {
        __extends(DataMethod, _super);
        function DataMethod(name) {
            return _super.call(this, DataMethod.UniqueId, name) || this;
        }
        DataMethod.prototype.getMethod = function (element) {
            return this.getValue(element).getRaw(element);
        };
        DataMethod.UniqueId = 'DataMethod';
        DataMethod.DefaultMethod = 'get';
        return DataMethod;
    }(Attv.Attribute));
    Attv.DataMethod = DataMethod;
    (function (DataMethod) {
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attribute) {
                return _super.call(this, undefined, attribute) || this;
            }
            DefaultValue.prototype.getRaw = function (element) {
                var _a;
                var rawValue = _super.prototype.getRaw.call(this, element);
                if (!rawValue && ((_a = element === null || element === void 0 ? void 0 : element.tagName) === null || _a === void 0 ? void 0 : _a.equalsIgnoreCase('form'))) {
                    // get from method attribute
                    rawValue = element.attvAttr('method');
                }
                if (!rawValue) {
                    rawValue = DataMethod.DefaultMethod;
                }
                return rawValue;
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataMethod.DefaultValue = DefaultValue;
    })(DataMethod = Attv.DataMethod || (Attv.DataMethod = {}));
    /**
     * [data-cache]='true|false'
     */
    var DataCache = /** @class */ (function (_super) {
        __extends(DataCache, _super);
        function DataCache(name) {
            return _super.call(this, DataCache.UniqueId, name) || this;
        }
        DataCache.prototype.useCache = function (element) {
            var value = this.getValue(element).getRaw(element);
            if (Attv.isUndefined(value) || value === null)
                return true;
            return value === 'true';
        };
        DataCache.UniqueId = 'DataCache';
        return DataCache;
    }(Attv.Attribute));
    Attv.DataCache = DataCache;
    /**
     * [data-callback]='*'
     */
    var DataCallback = /** @class */ (function (_super) {
        __extends(DataCallback, _super);
        function DataCallback(name) {
            return _super.call(this, DataCallback.UniqueId, name) || this;
        }
        DataCallback.prototype.callback = function (element) {
            var jsFunction = this.getValue(element).getRaw(element);
            return Attv.eval(jsFunction);
        };
        DataCallback.UniqueId = 'DataCallback';
        return DataCallback;
    }(Attv.Attribute));
    Attv.DataCallback = DataCallback;
    /**
     * [data-content]='*'
     */
    var DataContent = /** @class */ (function (_super) {
        __extends(DataContent, _super);
        function DataContent(name) {
            return _super.call(this, DataContent.UniqueId, name) || this;
        }
        DataContent.prototype.getContent = function (element) {
            var rawValue = this.getValue(element).getRaw(element);
            return rawValue;
        };
        DataContent.UniqueId = 'DataContent';
        return DataContent;
    }(Attv.Attribute));
    Attv.DataContent = DataContent;
    /**
     * [data-target]='*'
     */
    var DataTarget = /** @class */ (function (_super) {
        __extends(DataTarget, _super);
        function DataTarget(name) {
            return _super.call(this, DataTarget.UniqueId, name) || this;
        }
        DataTarget.prototype.getTargetElement = function (element) {
            var selector = this.getValue(element).getRaw(element);
            return document.querySelector(selector);
        };
        DataTarget.UniqueId = 'DataTarget';
        return DataTarget;
    }(Attv.Attribute));
    Attv.DataTarget = DataTarget;
    /**
     * [data-timeout]='*'
     */
    var DataTimeout = /** @class */ (function (_super) {
        __extends(DataTimeout, _super);
        function DataTimeout(name) {
            return _super.call(this, DataTimeout.UniqueId, name) || this;
        }
        DataTimeout.prototype.timeout = function (element, fn) {
            var ms = parseInt(this.getValue(element).getRaw(element));
            if (ms) {
                window.setTimeout(fn, ms);
            }
            else {
                fn();
            }
        };
        DataTimeout.UniqueId = 'DataTimeout';
        return DataTimeout;
    }(Attv.Attribute));
    Attv.DataTimeout = DataTimeout;
    /**
     * [data-interval]='*'
     */
    var DataInterval = /** @class */ (function (_super) {
        __extends(DataInterval, _super);
        function DataInterval(name) {
            return _super.call(this, DataInterval.UniqueId, name) || this;
        }
        DataInterval.prototype.interval = function (element, fn) {
            var ms = parseInt(this.getValue(element).getRaw(element));
            if (ms) {
                var timer = new DataInterval.IntervalTimer(ms, fn);
                DataInterval.step(timer, ms);
            }
            else {
                fn();
            }
        };
        DataInterval.step = function (intervalTimer, timestamp) {
            if (intervalTimer.start == undefined) {
                intervalTimer.start = timestamp;
            }
            var elapsed = timestamp - intervalTimer.start;
            if (elapsed > intervalTimer.timer) {
                intervalTimer.fn();
                intervalTimer.start = timestamp;
                DataInterval.requestAnimationFrame(intervalTimer);
            }
            DataInterval.requestAnimationFrame(intervalTimer);
        };
        DataInterval.requestAnimationFrame = function (intervalTimer) {
            var _this = this;
            window.requestAnimationFrame(function (timestamp) {
                _this.step(intervalTimer, timestamp);
            });
        };
        DataInterval.UniqueId = 'DataInterval';
        return DataInterval;
    }(Attv.Attribute));
    Attv.DataInterval = DataInterval;
    (function (DataInterval) {
        var IntervalTimer = /** @class */ (function () {
            function IntervalTimer(timer, fn, start) {
                this.timer = timer;
                this.fn = fn;
                this.start = start;
                // do nothing
            }
            return IntervalTimer;
        }());
        DataInterval.IntervalTimer = IntervalTimer;
    })(DataInterval = Attv.DataInterval || (Attv.DataInterval = {}));
    /**
     * [data-data]='*'
     */
    var DataData = /** @class */ (function (_super) {
        __extends(DataData, _super);
        function DataData(name) {
            return _super.call(this, DataData.UniqueId, name) || this;
        }
        DataData.prototype.getData = function (element) {
            var rawValue = this.getValue(element).getRaw(element);
            return Attv.parseJsonOrElse(rawValue);
        };
        DataData.UniqueId = 'DataData';
        return DataData;
    }(Attv.Attribute));
    Attv.DataData = DataData;
    /**
     * [data-title]='*'
     */
    var DataTitle = /** @class */ (function (_super) {
        __extends(DataTitle, _super);
        function DataTitle(name) {
            return _super.call(this, DataTitle.UniqueId, name) || this;
        }
        DataTitle.prototype.getTitle = function (element) {
            var title = this.getValue(element).getRaw(element);
            return title;
        };
        DataTitle.UniqueId = 'DataTitle';
        return DataTitle;
    }(Attv.Attribute));
    Attv.DataTitle = DataTitle;
    /**
     * [data-bind]='*'
     */
    var DataBind = /** @class */ (function (_super) {
        __extends(DataBind, _super);
        function DataBind(name) {
            return _super.call(this, DataBind.UniqueId, name) || this;
        }
        DataBind.prototype.bind = function (element, any) {
            element.attvHtml((any === null || any === void 0 ? void 0 : any.toString()) || '');
        };
        DataBind.UniqueId = 'DataBind';
        return DataBind;
    }(Attv.Attribute));
    Attv.DataBind = DataBind;
    /**
     * [data-bind-when]='*'
     */
    var DataBindWhen = /** @class */ (function (_super) {
        __extends(DataBindWhen, _super);
        function DataBindWhen(name) {
            return _super.call(this, DataBindWhen.UniqueId, name) || this;
        }
        DataBindWhen.prototype.bind = function (element, any) {
            element.attvHtml((any === null || any === void 0 ? void 0 : any.toString()) || '');
        };
        DataBindWhen.UniqueId = 'DataBindWhen';
        return DataBindWhen;
    }(Attv.Attribute));
    Attv.DataBindWhen = DataBindWhen;
    /**
     * [data-enabled]='true|false'
     */
    var DataEnabled = /** @class */ (function (_super) {
        __extends(DataEnabled, _super);
        function DataEnabled(name) {
            return _super.call(this, DataEnabled.UniqueId, name) || this;
        }
        /**
         * Assume everything is enabled except when specifically set to 'false'
         * @param element the element
         */
        DataEnabled.prototype.isEnabled = function (element) {
            var rawValue = this.getValue(element).getRaw(element);
            return !(rawValue === null || rawValue === void 0 ? void 0 : rawValue.equalsIgnoreCase('false'));
        };
        DataEnabled.UniqueId = 'DataEnabled';
        return DataEnabled;
    }(Attv.Attribute));
    Attv.DataEnabled = DataEnabled;
    /**
     * [data-active]='*'
     */
    var DataActive = /** @class */ (function (_super) {
        __extends(DataActive, _super);
        function DataActive(name) {
            return _super.call(this, DataActive.UniqueId, name) || this;
        }
        DataActive.prototype.isActive = function (element) {
            var rawValue = this.getValue(element).getRaw(element);
            return rawValue === 'true';
        };
        DataActive.prototype.setActive = function (element, isActive) {
            element.attvAttr(this, isActive);
        };
        DataActive.UniqueId = 'DataActive';
        return DataActive;
    }(Attv.Attribute));
    Attv.DataActive = DataActive;
    /**
     * [data-route]='*'
     * Just like for SPA
     */
    var DataRoute = /** @class */ (function (_super) {
        __extends(DataRoute, _super);
        function DataRoute(name) {
            return _super.call(this, DataRoute.UniqueId, name) || this;
        }
        DataRoute.prototype.getRoute = function (element) {
            var rawValue = this.getValue(element).getRaw(element);
            return rawValue;
        };
        DataRoute.prototype.getLocationRoute = function () {
            return this.cleanHash(window.location.hash);
        };
        DataRoute.prototype.appendHash = function () {
            var _this = this;
            var _a;
            var hash = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                hash[_i] = arguments[_i];
            }
            var result = (_a = hash === null || hash === void 0 ? void 0 : hash.map(function (h) { return _this.cleanHash(h); })) === null || _a === void 0 ? void 0 : _a.join('/');
            return this.cleanHash(result);
        };
        DataRoute.prototype.setRoute = function (hash) {
            if (Attv.isUndefined(hash)) {
                return;
            }
            window.location.hash = this.cleanHash(hash);
        };
        DataRoute.prototype.getHash = function (hash) {
            if (!(hash === null || hash === void 0 ? void 0 : hash.startsWith('#'))) {
                hash = '#' + hash;
            }
            return hash;
        };
        /**
         * Checks if location route matches/starts-with hash
         * @param hash the hash
         */
        DataRoute.prototype.matches = function (hash) {
            hash = this.cleanHash(hash);
            var locationRoute = this.getLocationRoute();
            // TODO: refactor
            if (locationRoute.startsWith(hash)) {
                // make sure
                if (locationRoute === hash) {
                    return true;
                }
                else {
                    // makes sure there's / after the index
                    var nextChar = locationRoute.substr(locationRoute.indexOf(hash) + hash.length, 1);
                    return nextChar === '/';
                }
            }
            return false;
        };
        DataRoute.prototype.cleanHash = function (hash) {
            var _a;
            return (_a = hash === null || hash === void 0 ? void 0 : hash.replace('#', '')) === null || _a === void 0 ? void 0 : _a.replace(/\/\//, '/');
        };
        DataRoute.UniqueId = 'DataRoute';
        return DataRoute;
    }(Attv.Attribute));
    Attv.DataRoute = DataRoute;
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-url', function (name) { return new Attv.DataUrl(name); }, function (attribute, list) {
        list.push(new Attv.DataUrl.DefaultValue(attribute));
    });
    Attv.registerAttribute('data-method', function (name) { return new Attv.DataMethod(name); }, function (attribute, list) {
        list.push(new Attv.DataMethod.DefaultValue(attribute));
    });
    Attv.registerAttribute('data-callback', function (name) { return new Attv.DataCallback(name); });
    Attv.registerAttribute('data-target', function (name) { return new Attv.DataTarget(name); });
    Attv.registerAttribute('data-content', function (name) { return new Attv.DataContent(name); });
    Attv.registerAttribute('data-timeout', function (name) { return new Attv.DataTimeout(name); });
    Attv.registerAttribute('data-interval', function (name) { return new Attv.DataInterval(name); });
    Attv.registerAttribute('data-data', function (name) { return new Attv.DataData(name); });
    Attv.registerAttribute('data-settings', function (name) { return new Attv.DataSettings(name); });
    Attv.registerAttribute('data-cache', function (name) { return new Attv.DataCache(name); });
    Attv.registerAttribute('data-title', function (name) { return new Attv.DataTitle(name); });
    Attv.registerAttribute('data-bind', function (name) { return new Attv.DataBind(name); });
    Attv.registerAttribute('data-active', function (name) { return new Attv.DataActive(name); });
    Attv.registerAttribute('data-enabled', function (name) { return new Attv.DataEnabled(name); });
    Attv.registerAttribute('data-route', function (name) { return new Attv.DataRoute(name); });
});
////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// DataLoading ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    /**
     * [data-loading]='*'
     */
    var DataLoading = /** @class */ (function (_super) {
        __extends(DataLoading, _super);
        function DataLoading(name) {
            var _this = _super.call(this, DataLoading.UniqueId, name, true) || this;
            _this.isStrict = true;
            return _this;
        }
        DataLoading.UniqueId = 'DataLoading';
        return DataLoading;
    }(Attv.Attribute));
    Attv.DataLoading = DataLoading;
    (function (DataLoading) {
        /**
         * [data-loading]='default'
         */
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attributeValue, attribute) {
                return _super.call(this, attributeValue, attribute) || this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                return this.loadSettings(element, function (settings) {
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
                });
            };
            return DefaultAttributeValue;
        }(Attv.Attribute.Value));
        DataLoading.DefaultAttributeValue = DefaultAttributeValue;
        var SpinnerSettings;
        (function (SpinnerSettings) {
            // https://codepen.io/mandelid/pen/vwKoe
            SpinnerSettings.DefaultOuterColor = "#c0c0c0";
            SpinnerSettings.DefaultInnerColor = "#000000";
            SpinnerSettings.DefaultWidth = "25px";
            SpinnerSettings.DefaultHeight = "25px";
            // https://codepen.io/mandelid/pen/vwKoe
            function getStyle(settings) {
                return "\n[data-loading='spinner'],\n[data-loading='default'] {\n    display: inline-block;\n    width: " + settings.width + ";\n    height: " + settings.height + ";\n    border: 3px solid " + settings.outerColor + ";\n    border-radius: 50%;\n    border-top-color: " + settings.innerColor + ";\n    animation: spin 1s ease-in-out infinite;\n    -webkit-animation: spin 1s ease-in-out infinite;\n}\n\n@keyframes spin {\n    to { -webkit-transform: rotate(360deg); }\n}\n@-webkit-keyframes spin {\n    to { -webkit-transform: rotate(360deg); }\n}\n";
            }
            SpinnerSettings.getStyle = getStyle;
        })(SpinnerSettings = DataLoading.SpinnerSettings || (DataLoading.SpinnerSettings = {}));
    })(DataLoading = Attv.DataLoading || (Attv.DataLoading = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-loading', function (name) { return new Attv.DataLoading(name); }, function (attribute, list) {
        list.push(new Attv.DataLoading.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
    });
});
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// DataRenderer ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    /**
    * data-renderer
    */
    var DataRenderer = /** @class */ (function (_super) {
        __extends(DataRenderer, _super);
        function DataRenderer(name) {
            return _super.call(this, DataRenderer.UniqueId, name) || this;
        }
        DataRenderer.prototype.render = function (content, model, element, attributeValue) {
            if (!attributeValue) {
                attributeValue = this.getValue(element);
            }
            return attributeValue.render(content, model);
        };
        DataRenderer.UniqueId = 'DataRenderer';
        return DataRenderer;
    }(Attv.Attribute));
    Attv.DataRenderer = DataRenderer;
    (function (DataRenderer) {
        /**
         * [data-renderer]='default'
         */
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attributeValue, attribute) {
                return _super.call(this, attributeValue, attribute) || this;
            }
            DefaultValue.prototype.loadElement = function (element) {
                return true;
            };
            DefaultValue.prototype.render = function (content, model, element) {
                return content;
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataRenderer.DefaultValue = DefaultValue;
        /**
         * [data-renderer]='json2html'
         */
        var Json2HtmlValue = /** @class */ (function (_super) {
            __extends(Json2HtmlValue, _super);
            function Json2HtmlValue(attributeValue, attribute) {
                if (attributeValue === void 0) { attributeValue = 'json2html'; }
                var _this = _super.call(this, attributeValue, attribute) || this;
                _this.resolver.requires.push(Attv.DataBind.UniqueId);
                _this.dataBind = _this.resolver.resolve(Attv.DataBind.UniqueId);
                return _this;
            }
            Json2HtmlValue.prototype.loadElement = function (element) {
                return true;
            };
            Json2HtmlValue.prototype.render = function (templatedContent, model) {
                model = Attv.parseJsonOrElse(model);
                var templateElement = Attv.createHTMLElement(templatedContent);
                var rootElement = Attv.createHTMLElement('');
                this.bind(rootElement, templateElement, model);
                return rootElement.attvHtml();
            };
            Json2HtmlValue.prototype.bind = function (parent, template, model) {
                var allbinds = template.querySelectorAll(this.dataBind.toString());
                for (var i = 0; i < allbinds.length; i++) {
                    var bindElement = allbinds[i];
                    var propName = bindElement.attvAttr(this.dataBind);
                    var propValue = this.getPropertyValue(propName, model);
                    if (Array.isArray(propValue)) {
                        var array = propValue;
                        var parentOfBindElement = bindElement.parentElement;
                        bindElement.remove();
                        for (var j = 0; j < array.length; j++) {
                            var clonedBindElement = bindElement.cloneNode(true);
                            this.bind(parentOfBindElement, clonedBindElement, array[j]);
                        }
                    }
                    else {
                        // bind
                        this.dataBind.bind(bindElement, propValue);
                        parent.append(template);
                    }
                }
            };
            Json2HtmlValue.prototype.getPropertyValue = function (propertyName, any) {
                var propertyValue = any;
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
                    var propertyChilds = propertyName.split('.');
                    for (var j = 0; j < propertyChilds.length; j++) {
                        try {
                            propertyValue = propertyValue[propertyChilds[j]];
                        }
                        catch (e) {
                            // ignore
                        }
                    }
                }
                return Attv.parseJsonOrElse(propertyValue);
            };
            return Json2HtmlValue;
        }(DefaultValue));
        DataRenderer.Json2HtmlValue = Json2HtmlValue;
    })(DataRenderer = Attv.DataRenderer || (Attv.DataRenderer = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-renderer', function (name) { return new Attv.DataRenderer(name); }, function (attribute, list) {
        list.push(new Attv.DataRenderer.DefaultValue(Attv.configuration.defaultTag, attribute));
        list.push(new Attv.DataRenderer.Json2HtmlValue('json2Html', attribute));
    });
});

//# sourceMappingURL=data-attributes.js.map
