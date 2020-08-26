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
            var _this = _super.call(this, DataUrl.UniqueId, name, false) || this;
            _this.dependency.requires.push(DataMethod.UniqueId, DataData.UniqueId, DataCache.UniqueId);
            return _this;
        }
        DataUrl.prototype.getUrl = function (element) {
            var attributeValue = this.getValue(element);
            var url = attributeValue.getRawValue(element);
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
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attribute) {
                return _super.call(this, undefined, attribute) || this;
            }
            DefaultAttributeValue.prototype.getRawValue = function (element) {
                var _a, _b;
                var rawValue = _super.prototype.getRawValue.call(this, element);
                // <form action='/'></form>
                if (!rawValue && ((_a = element === null || element === void 0 ? void 0 : element.tagName) === null || _a === void 0 ? void 0 : _a.equalsIgnoreCase('form'))) {
                    // get from action attribute
                    rawValue = element.attr('action');
                }
                // <a href='/'></form>
                if (!rawValue && ((_b = element === null || element === void 0 ? void 0 : element.tagName) === null || _b === void 0 ? void 0 : _b.equalsIgnoreCase('a'))) {
                    rawValue = element.attr('href');
                }
                return rawValue;
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        DataUrl.DefaultAttributeValue = DefaultAttributeValue;
    })(DataUrl = Attv.DataUrl || (Attv.DataUrl = {}));
    /**
     * [data-method]='*'
     */
    var DataMethod = /** @class */ (function (_super) {
        __extends(DataMethod, _super);
        function DataMethod(name) {
            return _super.call(this, DataMethod.UniqueId, name, false) || this;
        }
        DataMethod.prototype.getMethod = function (element) {
            return this.getValue(element).getRawValue(element);
        };
        DataMethod.UniqueId = 'DataMethod';
        DataMethod.DefaultMethod = 'get';
        return DataMethod;
    }(Attv.Attribute));
    Attv.DataMethod = DataMethod;
    (function (DataMethod) {
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attribute) {
                return _super.call(this, undefined, attribute) || this;
            }
            DefaultAttributeValue.prototype.getRawValue = function (element) {
                var _a;
                var rawValue = _super.prototype.getRawValue.call(this, element);
                if (!rawValue && ((_a = element === null || element === void 0 ? void 0 : element.tagName) === null || _a === void 0 ? void 0 : _a.equalsIgnoreCase('form'))) {
                    // get from method attribute
                    rawValue = element.attr('method');
                }
                if (!rawValue) {
                    rawValue = DataMethod.DefaultMethod;
                }
                return rawValue;
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        DataMethod.DefaultAttributeValue = DefaultAttributeValue;
    })(DataMethod = Attv.DataMethod || (Attv.DataMethod = {}));
    /**
     * [data-cache]='true|false'
     */
    var DataCache = /** @class */ (function (_super) {
        __extends(DataCache, _super);
        function DataCache(name) {
            return _super.call(this, DataCache.UniqueId, name, false) || this;
        }
        DataCache.prototype.useCache = function (element) {
            var value = this.getValue(element).getRawValue(element);
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
            return _super.call(this, DataCallback.UniqueId, name, false) || this;
        }
        DataCallback.prototype.callback = function (element) {
            var jsFunction = this.getValue(element).getRawValue(element);
            return Attv.eval(jsFunction);
        };
        DataCallback.UniqueId = 'DataCallback';
        return DataCallback;
    }(Attv.Attribute));
    Attv.DataCallback = DataCallback;
    /**
     * [data-loading]='*'
     */
    var DataLoading = /** @class */ (function (_super) {
        __extends(DataLoading, _super);
        function DataLoading(name) {
            return _super.call(this, DataLoading.UniqueId, name, false) || this;
        }
        DataLoading.UniqueId = 'DataLoading';
        return DataLoading;
    }(Attv.Attribute));
    Attv.DataLoading = DataLoading;
    /**
     * [data-content]='*'
     */
    var DataContent = /** @class */ (function (_super) {
        __extends(DataContent, _super);
        function DataContent(name) {
            return _super.call(this, DataContent.UniqueId, name, false) || this;
        }
        DataContent.prototype.getContent = function (element) {
            var rawValue = this.getValue(element).getRawValue(element);
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
            return _super.call(this, DataTarget.UniqueId, name, false) || this;
        }
        DataTarget.prototype.getTargetElement = function (element) {
            var selector = this.getValue(element).getRawValue(element);
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
            return _super.call(this, DataTimeout.UniqueId, name, false) || this;
        }
        DataTimeout.prototype.timeout = function (element, fn) {
            var ms = parseInt(this.getValue(element).getRawValue(element));
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
            return _super.call(this, DataInterval.UniqueId, name, false) || this;
        }
        DataInterval.prototype.interval = function (element, fn) {
            var ms = parseInt(this.getValue(element).getRawValue(element));
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
            return _super.call(this, DataData.UniqueId, name, false) || this;
        }
        DataData.prototype.getData = function (element) {
            var rawValue = this.getValue(element).getRawValue(element);
            if (Attv.isEvaluatable(rawValue)) {
                //do eval
                rawValue = Attv.eval(rawValue);
            }
            return Attv.parseJsonOrElse(rawValue);
        };
        DataData.UniqueId = 'DataData';
        return DataData;
    }(Attv.Attribute));
    Attv.DataData = DataData;
    /**
     * [data-options]='*'
     */
    var DataOptions = /** @class */ (function (_super) {
        __extends(DataOptions, _super);
        function DataOptions(name) {
            return _super.call(this, DataOptions.UniqueId, name, false) || this;
        }
        /**
         * Returns the option object (json)
         * @param element the element
         */
        DataOptions.prototype.getOptions = function (element) {
            var rawValue = this.getValue(element).getRawValue(element);
            if (Attv.isEvaluatable(rawValue)) {
                //do eval
                rawValue = Attv.eval(rawValue);
            }
            var options = Attv.parseJsonOrElse(rawValue) || {};
            return options;
        };
        DataOptions.UniqueId = 'DataOptions';
        return DataOptions;
    }(Attv.Attribute));
    Attv.DataOptions = DataOptions;
    /**
     * [data-title]='*'
     */
    var DataTitle = /** @class */ (function (_super) {
        __extends(DataTitle, _super);
        function DataTitle(name) {
            return _super.call(this, DataTitle.UniqueId, name, false) || this;
        }
        DataTitle.prototype.getTitle = function (element) {
            var title = this.getValue(element).getRawValue(element);
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
            return _super.call(this, DataBind.UniqueId, name, false) || this;
        }
        DataBind.prototype.bind = function (element, any) {
            element.html((any === null || any === void 0 ? void 0 : any.toString()) || '');
        };
        DataBind.UniqueId = 'DataBind';
        return DataBind;
    }(Attv.Attribute));
    Attv.DataBind = DataBind;
    /**
     * [data-active]='*'
     */
    var DataActive = /** @class */ (function (_super) {
        __extends(DataActive, _super);
        function DataActive(name) {
            return _super.call(this, DataActive.UniqueId, name, false) || this;
        }
        DataActive.prototype.isActive = function (element) {
            var rawValue = this.getValue(element).getRawValue(element);
            return rawValue === 'true';
        };
        DataActive.UniqueId = 'DataActive';
        return DataActive;
    }(Attv.Attribute));
    Attv.DataActive = DataActive;
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-url', function (name) { return new Attv.DataUrl(name); }, function (attribute, list) {
        list.push(new Attv.DataUrl.DefaultAttributeValue(attribute));
    });
    Attv.registerAttribute('data-method', function (name) { return new Attv.DataMethod(name); }, function (attribute, list) {
        list.push(new Attv.DataMethod.DefaultAttributeValue(attribute));
    });
    Attv.registerAttribute('data-callback', function (name) { return new Attv.DataCallback(name); });
    Attv.registerAttribute('data-loading', function (name) { return new Attv.DataLoading(name); });
    Attv.registerAttribute('data-target', function (name) { return new Attv.DataTarget(name); });
    Attv.registerAttribute('data-content', function (name) { return new Attv.DataContent(name); });
    Attv.registerAttribute('data-timeout', function (name) { return new Attv.DataTimeout(name); });
    Attv.registerAttribute('data-interval', function (name) { return new Attv.DataInterval(name); });
    Attv.registerAttribute('data-data', function (name) { return new Attv.DataData(name); });
    Attv.registerAttribute('data-options', function (name) { return new Attv.DataOptions(name); });
    Attv.registerAttribute('data-cache', function (name) { return new Attv.DataCache(name); });
    Attv.registerAttribute('data-title', function (name) { return new Attv.DataTitle(name); });
    Attv.registerAttribute('data-bind', function (name) { return new Attv.DataBind(name); });
    Attv.registerAttribute('data-active', function (name) { return new Attv.DataActive(name); });
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
            return _super.call(this, DataRenderer.UniqueId, name, false) || this;
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
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attributeValue, attribute) {
                return _super.call(this, attributeValue, attribute) || this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                return true;
            };
            DefaultAttributeValue.prototype.render = function (content, model, element) {
                return content;
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        DataRenderer.DefaultAttributeValue = DefaultAttributeValue;
        /**
         * [data-renderer]='json2html'
         */
        var Json2HtmlAttributeValue = /** @class */ (function (_super) {
            __extends(Json2HtmlAttributeValue, _super);
            function Json2HtmlAttributeValue(attribute) {
                var _this = _super.call(this, 'json2html', attribute) || this;
                _this.resolver.requires.push(Attv.DataBind.UniqueId);
                _this.dataBind = _this.resolver.resolve(Attv.DataBind.UniqueId);
                return _this;
            }
            Json2HtmlAttributeValue.prototype.loadElement = function (element) {
                return true;
            };
            Json2HtmlAttributeValue.prototype.render = function (templatedContent, model) {
                model = Attv.parseJsonOrElse(model);
                var templateElement = Attv.createHTMLElement(templatedContent);
                var rootElement = Attv.createHTMLElement('');
                this.bind(rootElement, templateElement, model);
                return rootElement.html();
            };
            Json2HtmlAttributeValue.prototype.bind = function (parent, template, model) {
                var allbinds = template.querySelectorAll(this.dataBind.toString());
                for (var i = 0; i < allbinds.length; i++) {
                    var bindElement = allbinds[i];
                    var propName = bindElement.attr(this.dataBind);
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
            Json2HtmlAttributeValue.prototype.getPropertyValue = function (propertyName, any) {
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
            return Json2HtmlAttributeValue;
        }(DefaultAttributeValue));
        DataRenderer.Json2HtmlAttributeValue = Json2HtmlAttributeValue;
    })(DataRenderer = Attv.DataRenderer || (Attv.DataRenderer = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-renderer', function (name) { return new Attv.DataRenderer(name); }, function (attribute, list) {
        list.push(new Attv.DataRenderer.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
        list.push(new Attv.DataRenderer.Json2HtmlAttributeValue(attribute));
    });
});
//# sourceMappingURL=data-attributes.js.map