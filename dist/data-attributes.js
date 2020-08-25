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
            return _super.call(this, DataUrl.UniqueId, name, false) || this;
        }
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
                var _a;
                var rawValue = _super.prototype.getRawValue.call(this, element);
                if (!rawValue && ((_a = element === null || element === void 0 ? void 0 : element.tagName) === null || _a === void 0 ? void 0 : _a.equalsIgnoreCase('form'))) {
                    // get from action attribute
                    rawValue = element.attr('action');
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
                    rawValue = element.attr('method') || DataMethod.DefaultMethod;
                }
                return rawValue;
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        DataMethod.DefaultAttributeValue = DefaultAttributeValue;
    })(DataMethod = Attv.DataMethod || (Attv.DataMethod = {}));
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
            return eval(jsFunction);
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
     * [data-nessage]='*'
     */
    var DataMessage = /** @class */ (function (_super) {
        __extends(DataMessage, _super);
        function DataMessage(name) {
            return _super.call(this, DataMessage.UniqueId, name, false) || this;
        }
        DataMessage.prototype.getTargetElement = function (element) {
            var selector = this.getValue(element).getRawValue(element);
            return document.querySelector(selector);
        };
        DataMessage.UniqueId = 'DataMessage';
        return DataMessage;
    }(Attv.Attribute));
    Attv.DataMessage = DataMessage;
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
        DataTimeout.UniqueId = 'DataTimeout';
        return DataTimeout;
    }(Attv.Attribute));
    Attv.DataTimeout = DataTimeout;
    /**
     * [data-timeout]='*'
     */
    var DataData = /** @class */ (function (_super) {
        __extends(DataData, _super);
        function DataData(name) {
            return _super.call(this, DataData.UniqueId, name, false) || this;
        }
        DataData.UniqueId = 'DataData';
        return DataData;
    }(Attv.Attribute));
    Attv.DataData = DataData;
    /**
     * [data-timeout]='*'
     */
    var DataBind = /** @class */ (function (_super) {
        __extends(DataBind, _super);
        function DataBind(name) {
            return _super.call(this, DataBind.UniqueId, name, false) || this;
        }
        DataBind.prototype.bind = function (element, any) {
            var _a;
            element.innerHTML = (_a = any === null || any === void 0 ? void 0 : any.toString()) !== null && _a !== void 0 ? _a : '';
        };
        DataBind.UniqueId = 'DataBind';
        return DataBind;
    }(Attv.Attribute));
    Attv.DataBind = DataBind;
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
    Attv.registerAttribute('data-message', function (name) { return new Attv.DataMessage(name); });
    Attv.registerAttribute('data-timeout', function (name) { return new Attv.DataTimeout(name); });
    Attv.registerAttribute('data-data', function (name) { return new Attv.DataData(name); });
    Attv.registerAttribute('data-bind', function (name) { return new Attv.DataBind(name); });
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
                return rootElement.innerHTML;
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