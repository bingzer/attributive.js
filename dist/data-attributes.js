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
    * data-url
    */
    var DataUrl = /** @class */ (function (_super) {
        __extends(DataUrl, _super);
        function DataUrl(attributeName) {
            var _this = _super.call(this, DataUrl.UniqueId, attributeName, DataUrl.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        /**
         * Returns the current attribute value
         * @param element the element
         */
        DataUrl.prototype.getDataAttributeValue = function (element) {
            var attributeValue = _super.prototype.getDataAttributeValue.call(this, element);
            if (!(attributeValue === null || attributeValue === void 0 ? void 0 : attributeValue.attributeValue) && (element === null || element === void 0 ? void 0 : element.tagName.equalsIgnoreCase('form'))) {
                // get it from the 'action' attribute
                var actionAttributeValue = element.attr('action');
                attributeValue = new Attv.DataAttributeValue(actionAttributeValue, this);
            }
            return attributeValue;
        };
        DataUrl.UniqueId = 'DataUrl';
        DataUrl.Description = '';
        return DataUrl;
    }(Attv.DataAttribute));
    Attv.DataUrl = DataUrl;
    /**
    * data-method
    */
    var DataMethod = /** @class */ (function (_super) {
        __extends(DataMethod, _super);
        function DataMethod(attributeName) {
            var _this = _super.call(this, DataMethod.UniqueId, attributeName, DataMethod.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        /**
         * Returns the current attribute value
         * @param element the element
         */
        DataMethod.prototype.getDataAttributeValue = function (element) {
            var attributeValue = _super.prototype.getDataAttributeValue.call(this, element);
            if (!(attributeValue === null || attributeValue === void 0 ? void 0 : attributeValue.attributeValue) && (element === null || element === void 0 ? void 0 : element.tagName.equalsIgnoreCase('form'))) {
                // get it from the 'method' attribute
                var actionAttributeValue = element.attr('method');
                attributeValue = new Attv.DataAttributeValue(actionAttributeValue, this);
            }
            // otherwise
            if (!(attributeValue === null || attributeValue === void 0 ? void 0 : attributeValue.attributeValue)) {
                attributeValue = new Attv.DataAttributeValue(DataMethod.DefaultMethod, this);
            }
            return attributeValue;
        };
        DataMethod.UniqueId = 'DataMethod';
        DataMethod.Description = '';
        DataMethod.DefaultMethod = 'get';
        return DataMethod;
    }(Attv.DataAttribute));
    Attv.DataMethod = DataMethod;
    /**
    * data-callback
    */
    var DataCallback = /** @class */ (function (_super) {
        __extends(DataCallback, _super);
        function DataCallback(attributeName) {
            var _this = _super.call(this, DataCallback.UniqueId, attributeName, DataCallback.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataCallback.UniqueId = 'DataCallback';
        DataCallback.Description = '';
        return DataCallback;
    }(Attv.DataAttribute));
    Attv.DataCallback = DataCallback;
    /**
    * data-loading
    */
    var DataLoading = /** @class */ (function (_super) {
        __extends(DataLoading, _super);
        function DataLoading(attributeName) {
            var _this = _super.call(this, DataLoading.UniqueId, attributeName, DataLoading.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataLoading.UniqueId = 'DataLoading';
        DataLoading.Description = '';
        return DataLoading;
    }(Attv.DataAttribute));
    Attv.DataLoading = DataLoading;
    /**
    * data-message
    */
    var DataMessage = /** @class */ (function (_super) {
        __extends(DataMessage, _super);
        function DataMessage(attributeName) {
            var _this = _super.call(this, DataMessage.UniqueId, attributeName, DataMessage.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataMessage.UniqueId = 'DataMessage';
        DataMessage.Description = '';
        return DataMessage;
    }(Attv.DataAttribute));
    Attv.DataMessage = DataMessage;
    /**
    * data-bind
    */
    var DataBind = /** @class */ (function (_super) {
        __extends(DataBind, _super);
        function DataBind(attributeName) {
            var _this = _super.call(this, DataBind.UniqueId, attributeName, DataBind.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataBind.prototype.bind = function (element, any) {
            var _a;
            element.innerHTML = (_a = any === null || any === void 0 ? void 0 : any.toString()) !== null && _a !== void 0 ? _a : '';
        };
        DataBind.UniqueId = 'DataBind';
        DataBind.Description = '';
        return DataBind;
    }(Attv.DataAttribute));
    Attv.DataBind = DataBind;
    /**
    * data-target
    */
    var DataTarget = /** @class */ (function (_super) {
        __extends(DataTarget, _super);
        function DataTarget(attributeName) {
            var _this = _super.call(this, DataTarget.UniqueId, attributeName, DataTarget.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataTarget.prototype.getTargetElement = function (element) {
            var targetElementSelector = this.getDataAttributeValue(element).attributeValue;
            return document.querySelector(targetElementSelector);
        };
        DataTarget.UniqueId = 'DataTarget';
        DataTarget.Description = '';
        return DataTarget;
    }(Attv.DataAttribute));
    Attv.DataTarget = DataTarget;
    /**
    * data-timeout
    */
    var DataTimeout = /** @class */ (function (_super) {
        __extends(DataTimeout, _super);
        function DataTimeout(attributeName) {
            var _this = _super.call(this, DataTimeout.UniqueId, attributeName, DataTimeout.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataTimeout.UniqueId = 'DataTimeout';
        DataTimeout.Description = '';
        return DataTimeout;
    }(Attv.DataAttribute));
    Attv.DataTimeout = DataTimeout;
    /**
    * data-data
    */
    var DataData = /** @class */ (function (_super) {
        __extends(DataData, _super);
        function DataData(attributeName) {
            var _this = _super.call(this, DataData.UniqueId, attributeName, DataData.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataData.UniqueId = 'DataData';
        DataData.Description = '';
        return DataData;
    }(Attv.DataAttribute));
    Attv.DataData = DataData;
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerDataAttribute('data-url', function (attributeName) { return new Attv.DataUrl(attributeName); });
    Attv.registerDataAttribute('data-method', function (attributeName) { return new Attv.DataMethod(attributeName); });
    Attv.registerDataAttribute('data-callback', function (attributeName) { return new Attv.DataCallback(attributeName); });
    Attv.registerDataAttribute('data-loading', function (attributeName) { return new Attv.DataLoading(attributeName); });
    Attv.registerDataAttribute('data-target', function (attributeName) { return new Attv.DataTarget(attributeName); });
    Attv.registerDataAttribute('data-message', function (attributeName) { return new Attv.DataMethod(attributeName); });
    Attv.registerDataAttribute('data-data', function (attributeName) { return new Attv.DataData(attributeName); });
    Attv.registerDataAttribute('data-timeout', function (attributeName) { return new Attv.DataTimeout(attributeName); });
    Attv.registerDataAttribute('data-bind', function (attributeName) { return new Attv.DataBind(attributeName); });
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
        function DataRenderer(attributeName) {
            var _this = _super.call(this, DataRenderer.UniqueId, attributeName, DataRenderer.Description, false) || this;
            _this.attributeName = attributeName;
            _this.dependencies.uses.push(Attv.DataBind.UniqueId);
            return _this;
        }
        DataRenderer.prototype.render = function (content, model, element, dataRendererValue) {
            if (!dataRendererValue) {
                dataRendererValue = this.getDataAttributeValue(element);
            }
            return dataRendererValue.render(content, model);
        };
        DataRenderer.UniqueId = 'DataRenderer';
        DataRenderer.Description = 'For rendering stuffs';
        return DataRenderer;
    }(Attv.DataAttribute));
    Attv.DataRenderer = DataRenderer;
    (function (DataRenderer) {
        /**
         * [data-renderer]='default'
         */
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attributeValue, dataAttribute) {
                return _super.call(this, attributeValue, dataAttribute) || this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                return true;
            };
            DefaultAttributeValue.prototype.render = function (templatedContent, model) {
                return templatedContent;
            };
            return DefaultAttributeValue;
        }(Attv.DataAttributeValue));
        DataRenderer.DefaultAttributeValue = DefaultAttributeValue;
        /**
         * [data-renderer]='json2html'
         */
        var Json2HtmlAttributeValue = /** @class */ (function (_super) {
            __extends(Json2HtmlAttributeValue, _super);
            function Json2HtmlAttributeValue(dataAttribute) {
                var _this = _super.call(this, 'json2html', dataAttribute) || this;
                _this.dataBind = _this.dataAttribute.dependencies.getDataAttribute(Attv.DataBind.UniqueId);
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
    Attv.registerDataAttribute('data-renderer', function (attributeName) { return new Attv.DataRenderer(attributeName); }, function (dataAttribute, list) {
        list.push(new Attv.DataRenderer.DefaultAttributeValue(Attv.configuration.defaultTag, dataAttribute));
        list.push(new Attv.DataRenderer.Json2HtmlAttributeValue(dataAttribute));
    });
});
//# sourceMappingURL=data-attributes.js.map