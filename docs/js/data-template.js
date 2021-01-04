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
            _this.wildcard = "none";
            return _this;
        }
        DataTemplate.prototype.renderTemplate = function (elementOrSelector, modelOrContent) {
            var sourceElement = elementOrSelector;
            if (Attv.isString(elementOrSelector)) {
                sourceElement = document.querySelector(elementOrSelector);
            }
            // find the 'default'
            // getValue() doesn't like when sourceElement is null
            var attributeValue = this.values.filter(function (val) { return val.getRaw(sourceElement) === Attv.configuration.defaultTag; })[0];
            if (sourceElement) {
                attributeValue = this.getValue(sourceElement);
            }
            return attributeValue.render(sourceElement, modelOrContent);
        };
        DataTemplate.UniqueId = 'DataTemplate';
        return DataTemplate;
    }(Attv.Attribute));
    Attv.DataTemplate = DataTemplate;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTemplate;
    (function (DataTemplate) {
        /**
         * [data-template]='default'
         */
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = []; }
                var _this = _super.call(this, attributeValue, attribute, validators) || this;
                _this.resolver.uses.push(Attv.DataRenderer.UniqueId);
                _this.resolver.internals.push(Attv.DataTemplateHtml.UniqueId);
                return _this;
            }
            DefaultValue.prototype.loadElement = function (element) {
                var templateHtml = element.attvHtml();
                this.resolver.addAttribute(Attv.DataTemplateHtml.UniqueId, element, templateHtml);
                element.attvHtml('');
                return true;
            };
            DefaultValue.prototype.getTemplate = function (element) {
                var html = this.resolver.resolve(Attv.DataTemplateHtml.UniqueId).getValue(element).getRaw(element);
                return html;
            };
            DefaultValue.prototype.render = function (element, modelOrContent) {
                var content = this.getTemplate(element) || modelOrContent;
                var dataRenderer = this.resolver.resolve(Attv.DataRenderer.UniqueId);
                return dataRenderer.render(content, modelOrContent, element);
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataTemplate.DefaultValue = DefaultValue;
        /**
         * [data-template]='script'
         */
        var ScriptValue = /** @class */ (function (_super) {
            __extends(ScriptValue, _super);
            function ScriptValue(attribute) {
                return _super.call(this, 'script', attribute, [
                    new Attv.Validators.RequiredElement(['script']),
                    new Attv.Validators.RequiredAttributeWithValue([{ name: 'type', value: 'text/html' }])
                ]) || this;
            }
            ScriptValue.prototype.loadElement = function (element) {
                // we don't need to do anything
                return true;
            };
            ScriptValue.prototype.getTemplate = function (element) {
                return element.attvHtml();
            };
            return ScriptValue;
        }(DefaultValue));
        DataTemplate.ScriptValue = ScriptValue;
    })(DataTemplate = Attv.DataTemplate || (Attv.DataTemplate = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// DataTemplateHtml //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
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
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// DataTemplateSource /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    /**
     * [data-template-source]="*"
     */
    var DataTemplateSource = /** @class */ (function (_super) {
        __extends(DataTemplateSource, _super);
        function DataTemplateSource(name) {
            var _this = _super.call(this, DataTemplateSource.UniqueId, name, false) || this;
            _this.name = name;
            _this.wildcard = "<querySelector>";
            return _this;
        }
        DataTemplateSource.prototype.renderTemplate = function (element, model) {
            var templateElement = this.getSourceElement(element);
            var dataTemplate = this.getValue(element).resolver.resolve(Attv.DataTemplate.UniqueId);
            return dataTemplate.renderTemplate(templateElement, model);
        };
        DataTemplateSource.prototype.getSourceElement = function (element) {
            var selector = this.getValue(element).getRaw(element);
            if (selector === 'this') {
                return element;
            }
            return document.querySelector(selector);
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
        var attributeValue = new Attv.Attribute.Value(undefined, attribute);
        attributeValue.resolver.uses.push(Attv.DataTemplate.UniqueId);
        list.push(attributeValue);
    });
    Attv.registerAttribute('data-template', function (attributeName) { return new Attv.DataTemplate(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTemplate.DefaultValue(Attv.configuration.defaultTag, attribute));
        list.push(new Attv.DataTemplate.ScriptValue(attribute));
    });
});

//# sourceMappingURL=data-template.js.map
