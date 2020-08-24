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
    * Base class for data-attribute-values
    */
    var RawDataAttributeValue = /** @class */ (function (_super) {
        __extends(RawDataAttributeValue, _super);
        function RawDataAttributeValue(attributeValue, dataAttribute) {
            return _super.call(this, attributeValue, dataAttribute) || this;
        }
        RawDataAttributeValue.prototype.loadElement = function (element) {
            return true;
        };
        return RawDataAttributeValue;
    }(Attv.DataAttributeValue));
    Attv.RawDataAttributeValue = RawDataAttributeValue;
    /**
    * Base class for raw-data-attributes
    */
    var RawDataAttribute = /** @class */ (function (_super) {
        __extends(RawDataAttribute, _super);
        function RawDataAttribute() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns the current attribute value
         * @param element the element
         */
        RawDataAttribute.prototype.getDataAttributeValue = function (element) {
            var rawAttributeValue = element.attr(this.attributeName);
            var attributeValue = new RawDataAttributeValue(rawAttributeValue, this);
            return attributeValue;
        };
        return RawDataAttribute;
    }(Attv.DataAttribute));
    Attv.RawDataAttribute = RawDataAttribute;
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
        DataUrl.UniqueId = 'DataUrl';
        DataUrl.Description = '';
        return DataUrl;
    }(RawDataAttribute));
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
        DataMethod.UniqueId = 'DataMethod';
        DataMethod.Description = '';
        return DataMethod;
    }(RawDataAttribute));
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
    }(RawDataAttribute));
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
    }(RawDataAttribute));
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
    }(RawDataAttribute));
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
        DataBind.UniqueId = 'DataBind';
        DataBind.Description = '';
        return DataBind;
    }(RawDataAttribute));
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
        DataTarget.UniqueId = 'DataTarget';
        DataTarget.Description = '';
        return DataTarget;
    }(RawDataAttribute));
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
    }(RawDataAttribute));
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
    }(RawDataAttribute));
    Attv.DataData = DataData;
    /**
    * data-bind-foreach
    */
    var DataBindForEach = /** @class */ (function (_super) {
        __extends(DataBindForEach, _super);
        function DataBindForEach(attributeName) {
            var _this = _super.call(this, DataBindForEach.UniqueId, attributeName, DataBindForEach.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataBindForEach.UniqueId = 'DataBindForEach';
        DataBindForEach.Description = '';
        return DataBindForEach;
    }(RawDataAttribute));
    Attv.DataBindForEach = DataBindForEach;
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
    Attv.registerDataAttribute('data-bind-foreach', function (attributeName) { return new Attv.DataBindForEach(attributeName); });
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
            _this.dependencies.uses.push(Attv.DataBindForEach.UniqueId, Attv.DataBind.UniqueId);
            return _this;
        }
        DataRenderer.prototype.getDefaultAttributeValue = function () {
            return this.attributeValues.filter(function (att) { return att.attributeValue === 'default'; })[0];
        };
        DataRenderer.prototype.render = function (content, model, element) {
            var dataRendererValue;
            if (element) {
                dataRendererValue = this.getDataAttributeValue(element);
            }
            if (!dataRendererValue) {
                dataRendererValue = this.getDefaultAttributeValue();
            }
            return dataRendererValue.render(content, model);
        };
        DataRenderer.UniqueId = 'DataRenderer';
        DataRenderer.Description = 'For rendering stuffs';
        return DataRenderer;
    }(Attv.DataAttribute));
    Attv.DataRenderer = DataRenderer;
    (function (DataRenderer) {
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
        var SimpleAttributeValue = /** @class */ (function (_super) {
            __extends(SimpleAttributeValue, _super);
            function SimpleAttributeValue(dataAttribute) {
                var _this = _super.call(this, 'simple', dataAttribute) || this;
                _this.dataBind = _this.dataAttribute.dependencies.getDataAttribute(Attv.DataBind.UniqueId);
                _this.dataBindForEach = _this.dataAttribute.dependencies.getDataAttribute(Attv.DataBindForEach.UniqueId);
                return _this;
            }
            SimpleAttributeValue.prototype.loadElement = function (element) {
                return true;
            };
            SimpleAttributeValue.prototype.render = function (templatedContent, model) {
                var templateElement = Attv.createHTMLElement(templatedContent);
                var rootElement = Attv.createHTMLElement('');
                this.bind(rootElement, templateElement, model);
                return rootElement.innerHTML;
            };
            SimpleAttributeValue.prototype.bind = function (element, template, model) {
                // -- Array
                if (model instanceof Array) {
                    element.innerHTML = '';
                    var array = model;
                    for (var i = 0; i < array.length; i++) {
                        var foreachElement = this.findByAttribute(template, this.dataBindForEach.attributeName, true)[0];
                        if (!foreachElement)
                            return;
                        var forEachBind = foreachElement.cloneNode(true);
                        this.bind(element, forEachBind, array[i]);
                    }
                }
                // -- Object
                else {
                    var bindElements = this.findByAttribute(template, this.dataBind.attributeName);
                    for (var i = 0; i < bindElements.length; i++) {
                        var bindElement = bindElements[i];
                        // if the direct parent is the 'template'
                        if (bindElement.closest("[" + this.dataBindForEach.attributeName + "]") === template) {
                            // bind the value
                            var propName = bindElement.attr(this.dataBind.attributeName);
                            var propValue = this.getPropertyValue(propName, model);
                            bindElement.innerHTML = propValue; // TODO: sanitize
                        }
                        else {
                            // another loop
                            var foreachChild = bindElement.closest("[" + this.dataBindForEach.attributeName + "]");
                            var foreachChildName = foreachChild.attr(this.dataBindForEach.attributeName);
                            var foreachChildValue = this.getPropertyValue(foreachChildName, model);
                            var foreachChildTemplate = foreachChild.cloneNode(true);
                            this.bind(element, foreachChildTemplate, foreachChildValue);
                        }
                    }
                    element.append(template);
                }
            };
            SimpleAttributeValue.prototype.findByAttribute = function (element, attributeName, includeSelf) {
                if (includeSelf === void 0) { includeSelf = false; }
                var elements = element.querySelectorAll("[" + attributeName + "]");
                if (includeSelf && element.attr(attributeName)) {
                    elements.push(element);
                }
                return elements;
            };
            SimpleAttributeValue.prototype.getPropertyValue = function (propertyName, any) {
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
                        propertyValue = propertyValue[propertyChilds[j]];
                    }
                }
                return Attv.parseJsonOrElse(propertyValue);
            };
            return SimpleAttributeValue;
        }(DefaultAttributeValue));
        DataRenderer.SimpleAttributeValue = SimpleAttributeValue;
    })(DataRenderer = Attv.DataRenderer || (Attv.DataRenderer = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerDataAttribute('data-renderer', function (attributeName) { return new Attv.DataRenderer(attributeName); }, function (dataAttribute, list) {
        list.push(new Attv.DataRenderer.DefaultAttributeValue('default', dataAttribute));
        list.push(new Attv.DataRenderer.SimpleAttributeValue(dataAttribute));
    });
});
//# sourceMappingURL=data-attributes.js.map