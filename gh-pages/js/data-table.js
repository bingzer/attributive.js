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
     * [data-tab]
     */
    var DataTable = /** @class */ (function (_super) {
        __extends(DataTable, _super);
        function DataTable(name) {
            var _this = _super.call(this, DataTable.UniqueId, name, true) || this;
            _this.name = name;
            _this.isStrict = true;
            return _this;
        }
        DataTable.UniqueId = 'DataTable';
        return DataTable;
    }(Attv.Attribute));
    Attv.DataTable = DataTable;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTable;
    (function (DataTable) {
        /**
         * [data-table]="default"
         */
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attributeValue, attribute, settingsFn, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredElementValidator(['table'])
                ]; }
                var _this = _super.call(this, attributeValue, attribute, settingsFn, validators) || this;
                _this.resolver.uses.push(Attv.DataTemplate.UniqueId, Attv.DataPartial.UniqueId);
                return _this;
            }
            /**
             * Find all element and construct
             * @param root the root
             */
            DefaultValue.prototype.loadElement = function (element) {
                if (!this.attribute.isElementLoaded(element)) {
                    var dataTemplate = this.resolver.resolve(Attv.DataTemplate.UniqueId);
                    var dataPartial = this.resolver.resolve(Attv.DataPartial.UniqueId);
                    dataTemplate.getValue(element).loadElement(element);
                    dataPartial.getValue(element).loadElement(element);
                    this.attribute.markElementLoaded(element, true);
                }
                return true;
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataTable.DefaultValue = DefaultValue;
    })(DataTable = Attv.DataTable || (Attv.DataTable = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DataPartial //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTable;
    (function (DataTable) {
        var DataPartialTableValue = /** @class */ (function (_super) {
            __extends(DataPartialTableValue, _super);
            function DataPartialTableValue(attribute, settingsFn, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredAttributeValidator([Attv.DataUrl.UniqueId])
                ]; }
                var _this = _super.call(this, 'table', attribute, settingsFn, validators) || this;
                _this.resolver.uses.push(Attv.DataTemplateSource.UniqueId, Attv.DataTimeout.UniqueId, Attv.DataMethod.UniqueId, Attv.DataCallback.UniqueId, Attv.DataTarget.UniqueId, Attv.DataInterval.UniqueId);
                return _this;
            }
            DataPartialTableValue.prototype.getTargetElement = function (element) {
                // [data-target]           
                var dataTarget = this.resolver.resolve(Attv.DataTarget.UniqueId);
                var targetElement = (dataTarget.getTargetElement(element) || element).querySelector('tbody');
                if (!targetElement) {
                    Attv.log('fatal', 'Unable to find tbody on the element', targetElement);
                }
                return targetElement;
            };
            DataPartialTableValue.prototype.loadElement = function (element) {
                if (!this.attribute.isElementLoaded(element)) {
                    this.render(element);
                    this.attribute.markElementLoaded(element, true);
                }
                return true;
            };
            return DataPartialTableValue;
        }(Attv.DataPartial.DefaultValue));
        DataTable.DataPartialTableValue = DataPartialTableValue;
    })(DataTable = Attv.DataTable || (Attv.DataTable = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DataTemplate //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTable;
    (function (DataTable) {
        var DataTemplateTableValue = /** @class */ (function (_super) {
            __extends(DataTemplateTableValue, _super);
            function DataTemplateTableValue(attribute, settingsFn, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredElementValidator(['table'])
                ]; }
                return _super.call(this, 'table', attribute, settingsFn, validators) || this;
            }
            DataTemplateTableValue.prototype.loadElement = function (element) {
                if (!this.attribute.isElementLoaded(element)) {
                    var tbody = element.querySelector('tbody');
                    var templateHtml = tbody.html();
                    this.resolver.addAttribute(Attv.DataTemplateHtml.UniqueId, element, templateHtml);
                    tbody.html('');
                    this.attribute.markElementLoaded(element, true);
                }
                return true;
            };
            return DataTemplateTableValue;
        }(Attv.DataTemplate.DefaultValue));
        DataTable.DataTemplateTableValue = DataTemplateTableValue;
    })(DataTable = Attv.DataTable || (Attv.DataTable = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// DataRenderer //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTable;
    (function (DataTable) {
        var DataRendererJson2TableValue = /** @class */ (function (_super) {
            __extends(DataRendererJson2TableValue, _super);
            function DataRendererJson2TableValue(attribute) {
                return _super.call(this, 'json2Table', attribute) || this;
            }
            DataRendererJson2TableValue.prototype.render = function (templatedContent, model) {
                model = Attv.parseJsonOrElse(model);
                var tbody = Attv.createHTMLElement('tbody');
                tbody.innerHTML = templatedContent;
                var rootElement = Attv.createHTMLElement('tbody');
                this.bind(rootElement, tbody, model);
                var rootHtml = rootElement.html();
                return rootHtml;
            };
            return DataRendererJson2TableValue;
        }(Attv.DataRenderer.Json2HtmlValue));
        DataTable.DataRendererJson2TableValue = DataRendererJson2TableValue;
    })(DataTable = Attv.DataTable || (Attv.DataTable = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Settings //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTable;
    (function (DataTable) {
        var DefaultSettings = /** @class */ (function (_super) {
            __extends(DefaultSettings, _super);
            function DefaultSettings() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.style = "\n/* Style the table */\n[data-table]\n";
                return _this;
            }
            return DefaultSettings;
        }(Attv.Attribute.Settings));
        DataTable.DefaultSettings = DefaultSettings;
    })(DataTable = Attv.DataTable || (Attv.DataTable = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-table', function (attributeName) { return new Attv.DataTable(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTable.DefaultValue(Attv.configuration.defaultTag, attribute, function (name, value) { return new Attv.DataTable.DefaultSettings(name, value); }));
    });
    Attv.registerAttributeValue(Attv.DataTemplate.UniqueId, function (attribute, list) {
        list.push(new Attv.DataTable.DataTemplateTableValue(attribute));
    });
    Attv.registerAttributeValue(Attv.DataPartial.UniqueId, function (attribute, list) {
        list.push(new Attv.DataTable.DataPartialTableValue(attribute));
    });
    Attv.registerAttributeValue(Attv.DataRenderer.UniqueId, function (attribute, list) {
        list.push(new Attv.DataTable.DataRendererJson2TableValue(attribute));
    });
});
//# sourceMappingURL=data-table.js.map