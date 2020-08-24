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
            var _this = _super.call(this, DataTemplate.UniqueId, attributeName, DataTemplate.Description, true) || this;
            _this.attributeName = attributeName;
            _this.dependencies.requires.push(Attv.DataRenderer.UniqueId, DataTemplateHtml.UniqueId);
            return _this;
        }
        DataTemplate.prototype.renderTemplate = function (sourceElementOrSelectorOrContent, model) {
            var sourceElement = sourceElementOrSelectorOrContent;
            if (Attv.isString(sourceElementOrSelectorOrContent)) {
                sourceElement = document.querySelector(sourceElementOrSelectorOrContent);
            }
            var attributeValue = this.getDataAttributeValue(sourceElement);
            var content = attributeValue.getTemplate(sourceElement).innerHTML;
            var dataRenderer = this.dependencies.getDataAttribute(Attv.DataRenderer.UniqueId);
            return dataRenderer.render(content, model, sourceElement);
        };
        DataTemplate.prototype.renderContent = function (content, model) {
            var dataRenderer = this.dependencies.getDataAttribute(Attv.DataRenderer.UniqueId);
            return dataRenderer.render(content, model);
        };
        DataTemplate.UniqueId = 'DataTemplate';
        DataTemplate.Description = '';
        return DataTemplate;
    }(Attv.DataAttribute));
    Attv.DataTemplate = DataTemplate;
    // --- AttributeValues
    (function (DataTemplate) {
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
                this.dataAttribute.addDependencyDataAttribute(element, DataTemplateHtml.UniqueId, templateHtml);
                element.innerHTML = '';
                return true;
            };
            DefaultAttributeValue.prototype.getTemplate = function (element) {
                this.dataAttribute.getDependencyDataAttribute(element, DataTemplateHtml.UniqueId);
                var html = element.attr('data-template-html');
                return Attv.createHTMLElement(html);
            };
            return DefaultAttributeValue;
        }(Attv.DataAttributeValue));
        DataTemplate.DefaultAttributeValue = DefaultAttributeValue;
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
        DataTemplate.ScriptAttributeValue = ScriptAttributeValue;
    })(DataTemplate = Attv.DataTemplate || (Attv.DataTemplate = {}));
    var DataTemplateHtml = /** @class */ (function (_super) {
        __extends(DataTemplateHtml, _super);
        function DataTemplateHtml(attributeName) {
            var _this = _super.call(this, DataTemplateHtml.UniqueId, attributeName, DataTemplateHtml.Description, false) || this;
            _this.attributeName = attributeName;
            return _this;
        }
        DataTemplateHtml.UniqueId = 'DataTemplateHtml';
        DataTemplateHtml.Description = '';
        return DataTemplateHtml;
    }(Attv.RawDataAttribute));
    Attv.DataTemplateHtml = DataTemplateHtml;
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerDataAttribute('data-template-html', function (attributeName) { return new Attv.DataTemplateHtml(attributeName); });
    Attv.registerDataAttribute('data-template', function (attributeName) { return new Attv.DataTemplate(attributeName); }, function (dataAttribute, list) {
        list.push(new Attv.DataTemplate.DefaultAttributeValue(dataAttribute));
        list.push(new Attv.DataTemplate.ScriptAttributeValue(dataAttribute));
    });
});
//# sourceMappingURL=data-template.js.map