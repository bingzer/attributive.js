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
        function DataPartial(name) {
            var _this = _super.call(this, DataPartial.UniqueId, name, true) || this;
            _this.name = name;
            return _this;
        }
        DataPartial.prototype.renderPartial = function (element, content) {
            if (Attv.isString(element)) {
                element = document.querySelector(element);
            }
            var htmlElement = element;
            var attributeValue = this.getValue(htmlElement);
            attributeValue.render(htmlElement, content);
        };
        DataPartial.UniqueId = "DataPartial";
        return DataPartial;
    }(Attv.Attribute));
    Attv.DataPartial = DataPartial;
    // --- AttributeValues
    (function (DataPartial) {
        /**
         * [data-partial]="lazy"
         */
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredAttributeValidator([Attv.DataUrl.UniqueId])
                ]; }
                var _this = _super.call(this, attributeValue, attribute, validators) || this;
                _this.resolver.requires.push(Attv.DataUrl.UniqueId);
                _this.resolver.uses.push(Attv.DataTemplateSource.UniqueId, Attv.DataTimeout.UniqueId, Attv.DataMethod.UniqueId, Attv.DataCallback.UniqueId, Attv.DataTarget.UniqueId);
                return _this;
            }
            DefaultAttributeValue.prototype.render = function (element, content) {
                var _this = this;
                // get content
                if (!content) {
                    // data-url
                    var options = {};
                    // [data-url]
                    options.url = this.resolver.resolve(Attv.DataUrl.UniqueId).getUrl(element);
                    options.method = this.resolver.resolve(Attv.DataMethod.UniqueId).getMethod(element);
                    options._internalCallback = function (ajaxOptions, wasSuccessful, xhr) {
                        content = xhr.response;
                        _this.doRender(element, content);
                        // [data-callback]
                        var dataCallback = _this.resolver.resolve(Attv.DataCallback.UniqueId);
                        dataCallback.callback(element);
                    };
                    this.sendAjax(element, options);
                }
                else {
                    this.doRender(element, content);
                }
            };
            DefaultAttributeValue.prototype.doRender = function (element, content) {
                // [data-template-source]                
                var html = this.resolver.resolve(Attv.DataTemplateSource.UniqueId).renderTemplate(element, content);
                // [data-target]
                var targetElement = this.resolver.resolve(Attv.DataTarget.UniqueId).getTargetElement(element) || element;
                targetElement.innerHTML = html;
                Attv.loadElements(targetElement);
            };
            DefaultAttributeValue.prototype.sendAjax = function (element, options) {
                // [data-timeout]
                var dataTimeout = this.resolver.resolve(Attv.DataTimeout.UniqueId);
                dataTimeout.timeout(element, function () {
                    Attv.Ajax.sendAjax(options);
                });
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        DataPartial.DefaultAttributeValue = DefaultAttributeValue;
        /**
         * [data-partial]="auto"
         */
        var AutoAttributeValue = /** @class */ (function (_super) {
            __extends(AutoAttributeValue, _super);
            function AutoAttributeValue(attribute) {
                return _super.call(this, 'auto', attribute) || this;
            }
            AutoAttributeValue.prototype.loadElement = function (element) {
                this.render(element);
                return true;
            };
            return AutoAttributeValue;
        }(DefaultAttributeValue));
        DataPartial.AutoAttributeValue = AutoAttributeValue;
        /**
         * [data-partial]="click"
         */
        var ClickAttributeValue = /** @class */ (function (_super) {
            __extends(ClickAttributeValue, _super);
            function ClickAttributeValue(attribute) {
                return _super.call(this, 'click', attribute, [
                    new Attv.Validators.RequiredAttributeValidator([Attv.DataUrl.UniqueId]),
                    new Attv.Validators.RequiredAnyElementsValidator(['button', 'a'])
                ]) || this;
            }
            ClickAttributeValue.prototype.loadElement = function (element) {
                var _this = this;
                element.onclick = function (ev) {
                    _this.render(element);
                    return false;
                };
                return true;
            };
            return ClickAttributeValue;
        }(DefaultAttributeValue));
        DataPartial.ClickAttributeValue = ClickAttributeValue;
        /**
         * [data-partial]="click"
         */
        var FormAttributeValue = /** @class */ (function (_super) {
            __extends(FormAttributeValue, _super);
            function FormAttributeValue(attribute) {
                return _super.call(this, 'form', attribute, [
                    new Attv.Validators.RequiredAttributeValidator([Attv.DataUrl.UniqueId]),
                    new Attv.Validators.RequiredElementValidator(['form'])
                ]) || this;
            }
            FormAttributeValue.prototype.loadElement = function (element) {
                var _this = this;
                var formElement = element;
                formElement.onsubmit = function (ev) {
                    _this.render(formElement);
                    return false;
                };
                return true;
            };
            return FormAttributeValue;
        }(DefaultAttributeValue));
        DataPartial.FormAttributeValue = FormAttributeValue;
    })(DataPartial = Attv.DataPartial || (Attv.DataPartial = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-partial', function (attributeName) { return new Attv.DataPartial(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataPartial.AutoAttributeValue(attribute));
        list.push(new Attv.DataPartial.ClickAttributeValue(attribute));
        list.push(new Attv.DataPartial.FormAttributeValue(attribute));
        list.push(new Attv.DataPartial.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
        list.push(new Attv.DataPartial.DefaultAttributeValue('lazy', attribute));
    });
});
//# sourceMappingURL=data-partial.js.map