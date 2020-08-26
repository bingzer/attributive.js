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
     * [data-template]
     */
    var DataTemplate = /** @class */ (function (_super) {
        __extends(DataTemplate, _super);
        function DataTemplate(name) {
            var _this = _super.call(this, DataTemplate.UniqueId, name, true) || this;
            _this.name = name;
            return _this;
        }
        DataTemplate.prototype.renderTemplate = function (sourceElementOrSelector, modelOrContent) {
            var sourceElement = sourceElementOrSelector;
            if (Attv.isString(sourceElementOrSelector)) {
                sourceElement = document.querySelector(sourceElementOrSelector);
            }
            var attributeValue = this.getValue(sourceElement);
            return attributeValue.render(sourceElement, modelOrContent);
        };
        DataTemplate.UniqueId = 'DataTemplate';
        return DataTemplate;
    }(Attv.Attribute));
    Attv.DataTemplate = DataTemplate;
    // --- AttributeValues
    (function (DataTemplate) {
        /**
         * [data-template]='default'
         */
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = []; }
                var _this = _super.call(this, attributeValue, attribute, validators) || this;
                _this.resolver.uses.push(Attv.DataRenderer.UniqueId);
                _this.resolver.internals.push(DataTemplateHtml.UniqueId);
                return _this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                var templateHtml = element.html();
                this.resolver.addAttribute(DataTemplateHtml.UniqueId, element, templateHtml);
                element.html('');
                return true;
            };
            DefaultAttributeValue.prototype.getTemplate = function (element) {
                var html = this.resolver.resolve(DataTemplateHtml.UniqueId).getValue(element).getRawValue(element);
                return Attv.createHTMLElement(html);
            };
            DefaultAttributeValue.prototype.render = function (element, modelOrContent) {
                var _a;
                var content = ((_a = this.getTemplate(element)) === null || _a === void 0 ? void 0 : _a.html()) || modelOrContent;
                var dataRenderer = this.resolver.resolve(Attv.DataRenderer.UniqueId);
                return dataRenderer.render(content, modelOrContent, element);
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        DataTemplate.DefaultAttributeValue = DefaultAttributeValue;
        /**
         * [data-template]='script'
         */
        var ScriptAttributeValue = /** @class */ (function (_super) {
            __extends(ScriptAttributeValue, _super);
            function ScriptAttributeValue(attribute) {
                return _super.call(this, 'script', attribute, [
                    new Attv.Validators.RequiredElementValidator(['script']),
                    new Attv.Validators.RequiredAttributeValidatorWithValue([{ name: 'type', value: 'text/html' }])
                ]) || this;
            }
            ScriptAttributeValue.prototype.loadElement = function (element) {
                // we don't need to do anything
                return true;
            };
            ScriptAttributeValue.prototype.getTemplate = function (element) {
                var html = element.html();
                return Attv.createHTMLElement(html);
            };
            return ScriptAttributeValue;
        }(DefaultAttributeValue));
        DataTemplate.ScriptAttributeValue = ScriptAttributeValue;
    })(DataTemplate = Attv.DataTemplate || (Attv.DataTemplate = {}));
    /**
     * [data-template-html]="*"
     */
    var DataTemplateHtml = /** @class */ (function (_super) {
        __extends(DataTemplateHtml, _super);
        function DataTemplateHtml(name) {
            var _this = _super.call(this, DataTemplateHtml.UniqueId, name, false) || this;
            _this.name = name;
            return _this;
        }
        DataTemplateHtml.UniqueId = 'DataTemplateHtml';
        return DataTemplateHtml;
    }(Attv.Attribute));
    Attv.DataTemplateHtml = DataTemplateHtml;
    /**
     * [data-template-source]="*"
     */
    var DataTemplateSource = /** @class */ (function (_super) {
        __extends(DataTemplateSource, _super);
        function DataTemplateSource(name) {
            var _this = _super.call(this, DataTemplateSource.UniqueId, name, false) || this;
            _this.name = name;
            return _this;
        }
        DataTemplateSource.prototype.renderTemplate = function (element, model) {
            var templateElement = this.getSourceElement(element);
            var dataTemplate = this.getValue(element).resolver.resolve(DataTemplate.UniqueId);
            return dataTemplate.renderTemplate(templateElement, model);
        };
        DataTemplateSource.prototype.getSourceElement = function (element) {
            var sourceElementSelector = this.getValue(element).getRawValue(element);
            return document.querySelector(sourceElementSelector);
        };
        DataTemplateSource.UniqueId = 'DataTemplateSource';
        return DataTemplateSource;
    }(Attv.Attribute));
    Attv.DataTemplateSource = DataTemplateSource;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-template-html', function (attributeName) { return new Attv.DataTemplateHtml(attributeName); });
    Attv.registerAttribute('data-template-source', function (attributeName) { return new Attv.DataTemplateSource(attributeName); }, function (attribute, list) {
        var attributeValue = new Attv.AttributeValue(undefined, attribute);
        attributeValue.resolver.uses.push(Attv.DataTemplate.UniqueId);
        list.push(attributeValue);
    });
    Attv.registerAttribute('data-template', function (attributeName) { return new Attv.DataTemplate(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTemplate.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
        list.push(new Attv.DataTemplate.ScriptAttributeValue(attribute));
    });
});
//# sourceMappingURL=data-template.js.map