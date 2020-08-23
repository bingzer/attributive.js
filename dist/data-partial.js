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
    var DataPartial = /** @class */ (function (_super) {
        __extends(DataPartial, _super);
        function DataPartial(attributeName, renderer) {
            if (renderer === void 0) { renderer = new Attv.DataTemplate.Renderers.DefaultRenderer(); }
            var _this = _super.call(this, attributeName, true) || this;
            _this.attributeName = attributeName;
            _this.renderer = renderer;
            return _this;
        }
        DataPartial.prototype.renderPartial = function (element, content) {
            if (Attv.isString(element)) {
                element = document.querySelector(element);
            }
            var htmlElement = element;
            // must get the content somehow
            var attributeValue = htmlElement.attr(this.attributeName);
            var dataAttributeValue = Attv.getDataAttributeValue(attributeValue, this);
            dataAttributeValue.render(htmlElement, content);
        };
        DataPartial.prototype.sendAjax = function (options) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (e) {
                var xhr = this;
                if (xhr.readyState == 4) {
                    var wasSuccessful = this.status >= 200 && this.status < 400;
                    options._internalCallback(options, wasSuccessful, xhr);
                }
            };
            xhr.onerror = function (e) {
                options._internalCallback(options, false, xhr);
            };
            xhr.open(options.method, options.url, true);
            xhr.send();
        };
        return DataPartial;
    }(Attv.DataAttribute));
    Attv.DataPartial = DataPartial;
    // --- AttributeValues
    (function (DataPartial) {
        var Attributes;
        (function (Attributes) {
            var DefaultAttributeValue = /** @class */ (function (_super) {
                __extends(DefaultAttributeValue, _super);
                function DefaultAttributeValue(attributeValue, dataAttribute, validators) {
                    if (validators === void 0) { validators = [
                        new Attv.Validators.RequiredAttributeValidator(['data-url'])
                    ]; }
                    return _super.call(this, attributeValue, dataAttribute, validators) || this;
                }
                DefaultAttributeValue.prototype.loadElement = function (element) {
                    this.render(element);
                    return true;
                };
                DefaultAttributeValue.prototype.render = function (element, content) {
                    var dataPartial = this.dataAttribute;
                    var renderer = dataPartial.renderer;
                    // get content
                    if (!content) {
                        var options = element.attr('data');
                        options._internalCallback = function (ajaxOptions, wasSuccessful, xhr) {
                            if (ajaxOptions.callback) {
                                ajaxOptions.callback(wasSuccessful, xhr);
                            }
                            content = xhr.response;
                            renderer.render(dataPartial, element, content);
                        };
                        this.sendAjax(options);
                    }
                    else {
                        renderer.render(dataPartial, element, content);
                    }
                };
                DefaultAttributeValue.prototype.sendAjax = function (options) {
                    options.method = options.method || 'get';
                    var dataPartial = this.dataAttribute;
                    dataPartial.sendAjax(options);
                };
                return DefaultAttributeValue;
            }(Attv.DataAttributeValue));
            Attributes.DefaultAttributeValue = DefaultAttributeValue;
            var AutoAttributeValue = /** @class */ (function (_super) {
                __extends(AutoAttributeValue, _super);
                function AutoAttributeValue(dataAttribute) {
                    return _super.call(this, 'auto', dataAttribute) || this;
                }
                return AutoAttributeValue;
            }(DefaultAttributeValue));
            Attributes.AutoAttributeValue = AutoAttributeValue;
            var ClickAttributeValue = /** @class */ (function (_super) {
                __extends(ClickAttributeValue, _super);
                function ClickAttributeValue(dataAttribute) {
                    return _super.call(this, 'click', dataAttribute) || this;
                }
                return ClickAttributeValue;
            }(DefaultAttributeValue));
            Attributes.ClickAttributeValue = ClickAttributeValue;
            var FormAttributeValue = /** @class */ (function (_super) {
                __extends(FormAttributeValue, _super);
                function FormAttributeValue(dataAttribute) {
                    return _super.call(this, 'form', dataAttribute) || this;
                }
                return FormAttributeValue;
            }(DefaultAttributeValue));
            Attributes.FormAttributeValue = FormAttributeValue;
        })(Attributes = DataPartial.Attributes || (DataPartial.Attributes = {}));
    })(DataPartial = Attv.DataPartial || (Attv.DataPartial = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerDataAttribute('data-partial', function (attributeName) { return new Attv.DataPartial(attributeName); });
    Attv.registerAttributeValue('data-partial', function (dataAttribute) { return new Attv.DataPartial.Attributes.AutoAttributeValue(dataAttribute); });
    Attv.registerAttributeValue('data-partial', function (dataAttribute) { return new Attv.DataPartial.Attributes.ClickAttributeValue(dataAttribute); });
    Attv.registerAttributeValue('data-partial', function (dataAttribute) { return new Attv.DataPartial.Attributes.FormAttributeValue(dataAttribute); });
    Attv.registerAttributeValue('data-partial', function (dataAttribute) { return new Attv.DataPartial.Attributes.DefaultAttributeValue('default', dataAttribute); });
    Attv.registerAttributeValue('data-partial', function (dataAttribute) { return new Attv.DataPartial.Attributes.DefaultAttributeValue('lazy', dataAttribute); });
});
//# sourceMappingURL=data-partial.js.map