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
     * [data-partial]
     */
    var DataPartial = /** @class */ (function (_super) {
        __extends(DataPartial, _super);
        function DataPartial(name) {
            var _this = _super.call(this, DataPartial.UniqueId, name, true) || this;
            _this.name = name;
            _this.isStrict = true;
            _this.dependency.requires.push(Attv.DataUrl.UniqueId);
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
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataPartial;
    (function (DataPartial) {
        /**
         * [data-partial]="lazy"
         */
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attributeValue, attribute, settingsFn, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredAttributeValidator([Attv.DataUrl.UniqueId])
                ]; }
                var _this = _super.call(this, attributeValue, attribute, settingsFn, validators) || this;
                _this.resolver.uses.push(Attv.DataTemplateSource.UniqueId, Attv.DataTimeout.UniqueId, Attv.DataMethod.UniqueId, Attv.DataCallback.UniqueId, Attv.DataTarget.UniqueId, Attv.DataInterval.UniqueId);
                return _this;
            }
            DefaultValue.prototype.render = function (element, content, options) {
                var _this = this;
                // get content
                if (!content) {
                    // data-url
                    if (!options) {
                        options = {};
                    }
                    // [data-url]
                    options.url = this.resolver.resolve(Attv.DataUrl.UniqueId).getUrl(element);
                    options.method = this.resolver.resolve(Attv.DataMethod.UniqueId).getMethod(element);
                    options._internalCallback = function (ajaxOptions, wasSuccessful, xhr) {
                        content = xhr.response;
                        _this.doRender(element, content, options);
                        // [data-callback]
                        var dataCallback = _this.resolver.resolve(Attv.DataCallback.UniqueId);
                        dataCallback.callback(element);
                    };
                    this.sendAjax(element, options);
                }
                else {
                    this.doRender(element, content, options);
                }
            };
            DefaultValue.prototype.doRender = function (element, content, options) {
                var html = this.getTemplate(element, content);
                var targetElement = this.getTargetElement(element);
                targetElement.html(html);
                Attv.loadElements(targetElement);
            };
            DefaultValue.prototype.getTemplate = function (element, content) {
                // [data-template-source]           
                var dataTemplateSource = this.resolver.resolve(Attv.DataTemplateSource.UniqueId);
                var html = dataTemplateSource.renderTemplate(element, content);
                return html;
            };
            DefaultValue.prototype.getTargetElement = function (element) {
                // [data-target]           
                var dataTarget = this.resolver.resolve(Attv.DataTarget.UniqueId);
                var targetElement = dataTarget.getTargetElement(element) || element;
                return targetElement;
            };
            DefaultValue.prototype.sendAjax = function (element, options) {
                var _this = this;
                // [data-timeout]
                var dataTimeout = this.resolver.resolve(Attv.DataTimeout.UniqueId);
                dataTimeout.timeout(element, function () {
                    var dataInterval = _this.resolver.resolve(Attv.DataInterval.UniqueId);
                    dataInterval.interval(element, function () {
                        Attv.Ajax.sendAjax(options);
                    });
                });
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataPartial.DefaultValue = DefaultValue;
        /**
         * [data-partial]="auto"
         */
        var AutoValue = /** @class */ (function (_super) {
            __extends(AutoValue, _super);
            function AutoValue(attribute) {
                return _super.call(this, 'auto', attribute) || this;
            }
            AutoValue.prototype.loadElement = function (element) {
                this.render(element);
                return true;
            };
            return AutoValue;
        }(DefaultValue));
        DataPartial.AutoValue = AutoValue;
        /**
         * [data-partial]="click"
         */
        var ClickValue = /** @class */ (function (_super) {
            __extends(ClickValue, _super);
            function ClickValue(attribute) {
                return _super.call(this, 'click', attribute, undefined, [
                    new Attv.Validators.RequiredAttributeValidator([Attv.DataUrl.UniqueId]),
                    new Attv.Validators.RequiredAnyElementsValidator(['button', 'a'])
                ]) || this;
            }
            ClickValue.prototype.loadElement = function (element) {
                var _this = this;
                element.onclick = function (ev) {
                    _this.render(element);
                    return false;
                };
                return true;
            };
            return ClickValue;
        }(DefaultValue));
        DataPartial.ClickValue = ClickValue;
        /**
         * [data-partial]="click"
         */
        var FormValue = /** @class */ (function (_super) {
            __extends(FormValue, _super);
            function FormValue(attribute) {
                return _super.call(this, 'form', attribute, undefined, [
                    new Attv.Validators.RequiredAttributeValidator([Attv.DataUrl.UniqueId]),
                    new Attv.Validators.RequiredElementValidator(['form'])
                ]) || this;
            }
            FormValue.prototype.loadElement = function (element) {
                var _this = this;
                var formElement = element;
                formElement.onsubmit = function (ev) {
                    _this.render(formElement);
                    return false;
                };
                return true;
            };
            return FormValue;
        }(DefaultValue));
        DataPartial.FormValue = FormValue;
    })(DataPartial = Attv.DataPartial || (Attv.DataPartial = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-partial', function (attributeName) { return new Attv.DataPartial(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataPartial.DefaultValue(Attv.configuration.defaultTag, attribute));
        list.push(new Attv.DataPartial.DefaultValue('lazy', attribute));
        list.push(new Attv.DataPartial.AutoValue(attribute));
        list.push(new Attv.DataPartial.ClickValue(attribute));
        list.push(new Attv.DataPartial.FormValue(attribute));
    });
});
