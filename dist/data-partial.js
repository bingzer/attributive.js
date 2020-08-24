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
        function DataPartial(attributeName) {
            var _this = _super.call(this, DataPartial.UniqueId, attributeName, DataPartial.Description, true) || this;
            _this.attributeName = attributeName;
            _this.dependencies.requires.push(Attv.DataUrl.UniqueId);
            _this.dependencies.uses.push(Attv.DataTemplate.UniqueId, Attv.DataMethod.UniqueId, Attv.DataCallback.UniqueId, Attv.DataTarget.UniqueId);
            return _this;
        }
        DataPartial.prototype.renderPartial = function (element, content) {
            if (Attv.isString(element)) {
                element = document.querySelector(element);
            }
            var htmlElement = element;
            var dataAttributeValue = this.getDataAttributeValue(htmlElement);
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
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attributeValue, dataAttribute, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredAttributeValidator([Attv.DataUrl.UniqueId])
                ]; }
                return _super.call(this, attributeValue, dataAttribute, validators) || this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                this.render(element);
                return true;
            };
            DefaultAttributeValue.prototype.render = function (element, content) {
                var _this = this;
                // get content
                if (!content) {
                    //let options = element.attr('data') as AjaxOptions;
                    var options = this.dataAttribute.getFlattenDataAttributeNames(element);
                    options._internalCallback = function (ajaxOptions, wasSuccessful, xhr) {
                        if (ajaxOptions.callback) {
                            ajaxOptions.callback(wasSuccessful, xhr);
                        }
                        content = xhr.response;
                        _this.doRender(element, content);
                    };
                    this.sendAjax(options);
                }
                else {
                    this.doRender(element, content);
                }
            };
            DefaultAttributeValue.prototype.doRender = function (element, content) {
                var dataTemplate = this.dataAttribute.dependencies.getDataAttribute(Attv.DataTemplate.UniqueId);
                var html = dataTemplate.renderContent(content, {});
                element.innerHTML = html;
                Attv.loadElements(element);
            };
            DefaultAttributeValue.prototype.sendAjax = function (options) {
                options.method = options.method || 'get';
                var dataPartial = this.dataAttribute;
                dataPartial.sendAjax(options);
            };
            return DefaultAttributeValue;
        }(Attv.DataAttributeValue));
        DataPartial.DefaultAttributeValue = DefaultAttributeValue;
        var AutoAttributeValue = /** @class */ (function (_super) {
            __extends(AutoAttributeValue, _super);
            function AutoAttributeValue(dataAttribute) {
                return _super.call(this, 'auto', dataAttribute) || this;
            }
            return AutoAttributeValue;
        }(DefaultAttributeValue));
        DataPartial.AutoAttributeValue = AutoAttributeValue;
        var ClickAttributeValue = /** @class */ (function (_super) {
            __extends(ClickAttributeValue, _super);
            function ClickAttributeValue(dataAttribute) {
                return _super.call(this, 'click', dataAttribute) || this;
            }
            return ClickAttributeValue;
        }(DefaultAttributeValue));
        DataPartial.ClickAttributeValue = ClickAttributeValue;
        var FormAttributeValue = /** @class */ (function (_super) {
            __extends(FormAttributeValue, _super);
            function FormAttributeValue(dataAttribute) {
                return _super.call(this, 'form', dataAttribute) || this;
            }
            return FormAttributeValue;
        }(DefaultAttributeValue));
        DataPartial.FormAttributeValue = FormAttributeValue;
    })(DataPartial = Attv.DataPartial || (Attv.DataPartial = {}));
    (function (DataPartial) {
        DataPartial.UniqueId = "DataPartial";
        DataPartial.Description = "Data partial for ajax and stuffs";
    })(DataPartial = Attv.DataPartial || (Attv.DataPartial = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerDataAttribute('data-partial', function (attributeName) { return new Attv.DataPartial(attributeName); }, function (dataAttribute, list) {
        list.push(new Attv.DataPartial.AutoAttributeValue(dataAttribute));
        list.push(new Attv.DataPartial.ClickAttributeValue(dataAttribute));
        list.push(new Attv.DataPartial.FormAttributeValue(dataAttribute));
        list.push(new Attv.DataPartial.DefaultAttributeValue('default', dataAttribute));
        list.push(new Attv.DataPartial.DefaultAttributeValue('lazy', dataAttribute));
    });
});
//# sourceMappingURL=data-partial.js.map