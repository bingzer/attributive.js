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
        function DataTemplate(attributeName) {
            var _this = _super.call(this, attributeName, true) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataTemplate.prototype.renderTemplate = function (sourceElementOrSelectorOrContent, model, renderer) {
            var sourceElement = sourceElementOrSelectorOrContent;
            if (Attv.isString(sourceElementOrSelectorOrContent)) {
                sourceElement = document.querySelector(sourceElementOrSelectorOrContent);
            }
            // find renderer
            if (!renderer && sourceElement.attr('data-renderer')) {
                var rendererName = sourceElement.attr('data-renderer');
                renderer = this.findRendererByName(rendererName);
            }
            var attributeValue = sourceElement.attr(this.attributeName);
            var dataAttributeValue = Attv.getDataAttributeValue(attributeValue, this);
            var templateHtmlElement = dataAttributeValue.getTemplate(sourceElement);
            return this.renderContent(templateHtmlElement.innerHTML, model, renderer);
        };
        DataTemplate.prototype.renderContent = function (content, model, renderer) {
            if (!renderer) {
                renderer = new DataTemplate.Renderers.DefaultRenderer();
            }
            return renderer.render(content, model);
        };
        DataTemplate.prototype.findRendererByName = function (name) {
            switch (name.toLocaleLowerCase()) {
                case "simple":
                    return new DataTemplate.Renderers.SimpleRenderer();
                default:
                    return new DataTemplate.Renderers.DefaultRenderer();
            }
        };
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
                DefaultAttributeValue.prototype.getTemplate = function (element) {
                    var html = element.attr('data-template-html');
                    return Attv.createHTMLElement(html);
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
                ScriptAttributeValue.prototype.getTemplate = function (element) {
                    var html = element.innerHTML;
                    return Attv.createHTMLElement(html);
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
                DefaultRenderer.prototype.render = function (content, model) {
                    return content;
                };
                return DefaultRenderer;
            }());
            Renderers.DefaultRenderer = DefaultRenderer;
            var SimpleRenderer = /** @class */ (function () {
                function SimpleRenderer() {
                }
                SimpleRenderer.prototype.render = function (content, model) {
                    var templateElement = Attv.createHTMLElement(content);
                    var rootElement = Attv.createHTMLElement('');
                    this.bind(rootElement, templateElement, model);
                    return rootElement.innerHTML;
                };
                SimpleRenderer.prototype.bind = function (element, template, model) {
                    // -- Array
                    if (model instanceof Array) {
                        element.innerHTML = '';
                        var array = model;
                        for (var i = 0; i < array.length; i++) {
                            var foreachElement = this.findByAttribute(template, 'data-bind-foreach', true)[0];
                            if (!foreachElement)
                                return;
                            var forEachBind = foreachElement.cloneNode(true);
                            this.bind(element, forEachBind, array[i]);
                        }
                    }
                    // -- Object
                    else {
                        var bindElements = this.findByAttribute(template, 'data-bind');
                        for (var i = 0; i < bindElements.length; i++) {
                            var bindElement = bindElements[i];
                            // if the direct parent is the 'template'
                            if (bindElement.closest('[data-bind-foreach]') === template) {
                                // bind the value
                                var propName = bindElement.attr('data-bind');
                                var propValue = this.getPropertyValue(propName, model);
                                bindElement.innerHTML = propValue; // TODO: sanitize
                            }
                            else {
                                // another loop
                                var foreachChild = bindElement.closest('[data-bind-foreach]');
                                var foreachChildName = foreachChild.attr('data-bind-foreach');
                                var foreachChildValue = this.getPropertyValue(foreachChildName, model);
                                var foreachChildTemplate = foreachChild.cloneNode(true);
                                this.bind(element, foreachChildTemplate, foreachChildValue);
                            }
                        }
                        element.append(template);
                    }
                };
                SimpleRenderer.prototype.findByAttribute = function (element, attributeName, includeSelf) {
                    if (includeSelf === void 0) { includeSelf = false; }
                    var elements = element.querySelectorAll("[" + attributeName + "]");
                    if (includeSelf && element.attr(attributeName)) {
                        elements.push(element);
                    }
                    return elements;
                };
                SimpleRenderer.prototype.getPropertyValue = function (propertyName, any) {
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