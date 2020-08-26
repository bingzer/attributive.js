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
    var DataTab = /** @class */ (function (_super) {
        __extends(DataTab, _super);
        function DataTab(name) {
            var _this = _super.call(this, DataTab.UniqueId, name, true) || this;
            _this.name = name;
            _this.isStrict = true;
            _this.dependency.uses.push(Attv.DataTabContent.UniqueId, Attv.DataTabNav.UniqueId);
            _this.configuration = new DataTab.AttributeConfiguration(_this);
            return _this;
        }
        DataTab.UniqueId = 'DataTab';
        return DataTab;
    }(Attv.Attribute));
    Attv.DataTab = DataTab;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTab;
    (function (DataTab) {
        /**
         * [data-tab]="default"
         */
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = []; }
                var _this = _super.call(this, attributeValue, attribute, validators) || this;
                _this.resolver.uses.push(Attv.DataContent.UniqueId, Attv.DataPartial.UniqueId, Attv.DataActive.UniqueId);
                return _this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                var _this = this;
                var dataTabNav = this.resolver.resolve(Attv.DataTabNav.UniqueId);
                element.querySelectorAll(dataTabNav.toString()).forEach(function (navElement) {
                    var dataActive = _this.resolver.resolve(Attv.DataActive.UniqueId);
                    navElement.onclick = function (evt) { return _this.displayContent(navElement); };
                    if (dataActive.isActive(navElement)) {
                        _this.displayContent(navElement);
                    }
                });
                return true;
            };
            DefaultAttributeValue.prototype.displayContent = function (navElement) {
                var dataActive = this.resolver.resolve(Attv.DataActive.UniqueId);
                var dataTabNav = this.resolver.resolve(Attv.DataTabNav.UniqueId);
                var dataTabContent = this.resolver.resolve(Attv.DataTabContent.UniqueId);
                // -- [data-tab-nav]
                navElement.parentElement.querySelectorAll(dataTabNav.toString()).forEach(function (e) { return e.attr(dataActive, false); });
                var contentName = dataTabNav.getValue(navElement).getRawValue(navElement);
                var contentElement = document.querySelector("[" + dataTabContent.name + "=\"" + contentName + "\"]");
                if (contentElement) {
                    var parentElement = contentElement.parentElement;
                    // hide all children
                    parentElement.querySelectorAll(dataTabContent.toString()).forEach(function (e) { return e.hide(); });
                    this.displayContentElement(contentElement);
                    // mark the tabnav as active
                    navElement.attr(dataActive, true);
                }
                return false;
            };
            DefaultAttributeValue.prototype.displayContentElement = function (contentElement) {
                contentElement.show();
                // [data-content]
                var dataContent = this.resolver.resolve(Attv.DataContent.UniqueId);
                if (dataContent.exists(contentElement)) {
                    contentElement.html(dataContent.getContent(contentElement));
                    return;
                }
                // [data-partial]
                var dataPartial = this.resolver.resolve(Attv.DataPartial.UniqueId);
                if (dataPartial.exists(contentElement)) {
                    dataPartial.renderPartial(contentElement);
                    return;
                }
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        DataTab.DefaultAttributeValue = DefaultAttributeValue;
        /**
         * [data-partial]="tab"
         */
        var DataTabDialogAttributeValue = /** @class */ (function (_super) {
            __extends(DataTabDialogAttributeValue, _super);
            function DataTabDialogAttributeValue(attribute) {
                return _super.call(this, 'tab', attribute) || this;
            }
            DataTabDialogAttributeValue.prototype.loadElement = function (element) {
                return false;
            };
            DataTabDialogAttributeValue.prototype.render = function (element, content, options) {
                if (!this.attribute.isElementLoaded(element)) {
                    _super.prototype.render.call(this, element, content, options);
                }
            };
            DataTabDialogAttributeValue.prototype.doRender = function (element, content, options) {
                _super.prototype.doRender.call(this, element, content, options);
                this.attribute.markElementLoaded(element, true);
            };
            return DataTabDialogAttributeValue;
        }(Attv.DataPartial.DefaultAttributeValue));
        DataTab.DataTabDialogAttributeValue = DataTabDialogAttributeValue;
    })(DataTab = Attv.DataTab || (Attv.DataTab = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// DataTabNav ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    /**
     * [data-tab-nav]
     */
    var DataTabNav = /** @class */ (function (_super) {
        __extends(DataTabNav, _super);
        function DataTabNav(name) {
            var _this = _super.call(this, DataTabNav.UniqueId, name) || this;
            _this.name = name;
            return _this;
        }
        DataTabNav.UniqueId = 'DataTabNav';
        return DataTabNav;
    }(Attv.Attribute));
    Attv.DataTabNav = DataTabNav;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// DataTabContent //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    /**
     * [data-tab-content]
     */
    var DataTabContent = /** @class */ (function (_super) {
        __extends(DataTabContent, _super);
        function DataTabContent(name) {
            var _this = _super.call(this, DataTabContent.UniqueId, name) || this;
            _this.name = name;
            return _this;
        }
        DataTabContent.UniqueId = 'DataTabContent';
        return DataTabContent;
    }(Attv.Attribute));
    Attv.DataTabContent = DataTabContent;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// AttributeConfiguration ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTab;
    (function (DataTab) {
        var AttributeConfiguration = /** @class */ (function (_super) {
            __extends(AttributeConfiguration, _super);
            function AttributeConfiguration() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.style = "\n/* Style the tab */\n[data-tab] {\n    overflow: hidden;\n    border: 1px solid #ccc;\n    background-color: #f1f1f1;\n}\n\n/* Style the buttons inside the tab */\n[data-tab] [data-tab-nav] {\n    background-color: inherit;\n    float: left;\n    border: none;\n    outline: none;\n    cursor: pointer;\n    padding: 14px 16px;\n    transition: 0.3s;\n    font-size: 17px;\n    list-style: none;\n}\n\n/* Change background color of buttons on hover */\n[data-tab] [data-tab-nav]:hover {\n    background-color: #ddd;\n}\n\n/* Create an active/current tablink class */\n[data-tab] [data-tab-nav][data-active=true] {\n    background-color: #ccc;\n}\n\n/* Style the tab content */\n[data-tab-content]{\n    display: none;\n    padding: 6px 12px;\n    border: 1px solid #ccc;\n    border-top: none;\n}\n";
                return _this;
            }
            return AttributeConfiguration;
        }(Attv.AttributeConfiguration));
        DataTab.AttributeConfiguration = AttributeConfiguration;
    })(DataTab = Attv.DataTab || (Attv.DataTab = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-tab', function (attributeName) { return new Attv.DataTab(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTab.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
    });
    Attv.registerAttribute('data-tab-nav', function (attributeName) { return new Attv.DataTabNav(attributeName); });
    Attv.registerAttribute('data-tab-content', function (attributeName) { return new Attv.DataTabContent(attributeName); });
    Attv.registerAttributeValue(Attv.DataPartial.UniqueId, function (attribute, list) {
        list.push(new Attv.DataTab.DataTabDialogAttributeValue(attribute));
    });
});
//# sourceMappingURL=data-tab.js.map