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
    var DataTemplate = /** @class */ (function (_super) {
        __extends(DataTemplate, _super);
        function DataTemplate(attributeName, renderer) {
            if (renderer === void 0) { renderer = new DataTemplate.Renderers.DefaultRenderer(); }
            var _this = _super.call(this, attributeName, true) || this;
            _this.attributeName = attributeName;
            _this.renderer = renderer;
            return _this;
        }
        return DataTemplate;
    }(Attv.DataAttribute));
    Attv.DataTemplate = DataTemplate;
    // --- AttributeValues
    (function (DataTemplate) {
        var Attributes;
        (function (Attributes) {
            /**
             * [data-template]='default'
             */
            var DefaultAttributeValue = /** @class */ (function (_super) {
                __extends(DefaultAttributeValue, _super);
                function DefaultAttributeValue(dataAttribute) {
                    return _super.call(this, 'default', dataAttribute) || this;
                }
                DefaultAttributeValue.prototype.loadElement = function (element) {
                    var templateHtml = element.innerHTML;
                    element.attr('data-template-html', templateHtml);
                    element.innerHTML = '';
                    return true;
                };
                DefaultAttributeValue.prototype.render = function (element, template, model) {
                    if (model instanceof Array) {
                        var elements = this.findByAttribute(template, 'data-bind');
                    }
                    else {
                    }
                };
                DefaultAttributeValue.prototype.findByAttribute = function (element, attributeName) {
                    var elements = element.querySelectorAll("[" + attributeName + "]");
                    if (element.attr(attributeName)) {
                        elements.push(element);
                    }
                    return elements;
                };
                return DefaultAttributeValue;
            }(Attv.DataAttributeValue));
            Attributes.DefaultAttributeValue = DefaultAttributeValue;
            /**
             * [data-template]='script'
             */
            var ScriptAttributeValue = /** @class */ (function (_super) {
                __extends(ScriptAttributeValue, _super);
                function ScriptAttributeValue(dataAttribute) {
                    return _super.call(this, 'script', dataAttribute, [
                        new Attv.Validators.RequiredElementValidator(['script']),
                        new Attv.Validators.RequiredAttributeValidatorWithValue([{ name: 'type', value: 'text/html' }])
                    ]) || this;
                }
                ScriptAttributeValue.prototype.loadElement = function (element) {
                    // we don't need to do anything
                    return true;
                };
                return ScriptAttributeValue;
            }(Attv.DataAttributeValue));
            Attributes.ScriptAttributeValue = ScriptAttributeValue;
        })(Attributes = DataTemplate.Attributes || (DataTemplate.Attributes = {}));
    })(DataTemplate = Attv.DataTemplate || (Attv.DataTemplate = {}));
    // --- DataPartial Renderer
    (function (DataTemplate) {
        var Renderers;
        (function (Renderers) {
            var DefaultRenderer = /** @class */ (function () {
                function DefaultRenderer() {
                }
                DefaultRenderer.prototype.render = function (dataAttribute, element, content) {
                    element.innerHTML = content;
                    Attv.loadElements(element);
                };
                return DefaultRenderer;
            }());
            Renderers.DefaultRenderer = DefaultRenderer;
            var SimpleRenderer = /** @class */ (function () {
                function SimpleRenderer() {
                }
                SimpleRenderer.prototype.render = function (dataAttribute, element, content) {
                    var model = content;
                    if (Attv.isString(content)) {
                        model = Attv.parseJsonOrElse(content);
                    }
                };
                return SimpleRenderer;
            }());
            Renderers.SimpleRenderer = SimpleRenderer;
        })(Renderers = DataTemplate.Renderers || (DataTemplate.Renderers = {}));
    })(DataTemplate = Attv.DataTemplate || (Attv.DataTemplate = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerDataAttribute('data-template', function (attributeName) { return new Attv.DataTemplate(attributeName); });
    Attv.registerAttributeValue('data-template', function (dataAttribute) { return new Attv.DataTemplate.Attributes.DefaultAttributeValue(dataAttribute); });
    Attv.registerAttributeValue('data-template', function (dataAttribute) { return new Attv.DataTemplate.Attributes.ScriptAttributeValue(dataAttribute); });
});
//# sourceMappingURL=data-template.js.map