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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attributeValue, attribute, settingsFn, validators) {
                if (validators === void 0) { validators = []; }
                var _this = _super.call(this, attributeValue, attribute, settingsFn, validators) || this;
                _this.resolver.uses.push(Attv.DataRoute.UniqueId, Attv.DataOptions.UniqueId);
                return _this;
            }
            DefaultValue.prototype.loadElement = function (element) {
                if (!this.attribute.isElementLoaded(element)) {
                    var dataTabNav_1 = this.resolver.resolve(Attv.DataTabNav.UniqueId);
                    element.querySelectorAll(dataTabNav_1.toString()).forEach(function (navElement) {
                        dataTabNav_1.getValue(navElement).loadElement(navElement);
                    });
                    // load settings
                    this.applySettings(element);
                    this.attribute.markElementLoaded(element, true);
                }
                return true;
            };
            DefaultValue.prototype.applySettings = function (element) {
                var _a;
                var dataOptions = this.resolver.resolve(Attv.DataOptions.UniqueId);
                if (dataOptions.exists(element)) {
                    this.settings;
                }
                (_a = this.settings) === null || _a === void 0 ? void 0 : _a.commit();
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataTab.DefaultValue = DefaultValue;
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
        }(Attv.DataPartial.DefaultValue));
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
            _this.dependency.uses.push(Attv.DataEnabled.UniqueId, Attv.DataActive.UniqueId);
            _this.dependency.internals.push(Attv.DataRoute.UniqueId);
            return _this;
        }
        DataTabNav.UniqueId = 'DataTabNav';
        return DataTabNav;
    }(Attv.Attribute));
    Attv.DataTabNav = DataTabNav;
    (function (DataTabNav) {
        /**
         * [data-tab-nav]="*"
         */
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attribute, settingsFn, validators) {
                if (validators === void 0) { validators = []; }
                var _this = _super.call(this, undefined, attribute, settingsFn, validators) || this;
                _this.resolver.uses.push(Attv.DataEnabled.UniqueId, Attv.DataActive.UniqueId, Attv.DataTabContent.UniqueId);
                return _this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                var _this = this;
                if (!this.attribute.isElementLoaded(element)) {
                    var tab_1 = element.parentElement;
                    var nav_1 = element;
                    var navSibilings_1 = __spreadArrays(tab_1.querySelectorAll(this.toString())); // force as array
                    var dataActive_1 = this.resolver.resolve(Attv.DataActive.UniqueId);
                    var dataEnabled = this.resolver.resolve(Attv.DataEnabled.UniqueId);
                    var dataRoute_1 = this.resolver.resolve(Attv.DataRoute.UniqueId);
                    // #1. from the route first
                    // [data-route]
                    var locationRoute = dataRoute_1.getLocationRoute();
                    if (locationRoute) {
                        for (var i = 0; i < navSibilings_1.length; i++) {
                            var route = dataRoute_1.appendHash(dataRoute_1.getRoute(tab_1), this.getRaw(navSibilings_1[i]));
                            if (dataRoute_1.matches(route)) {
                                // mark everybody not active
                                navSibilings_1.forEach(function (e) { return dataActive_1.setActive(e, false); });
                                dataActive_1.setActive(navSibilings_1[i], true);
                                break;
                            }
                        }
                    }
                    // [data-enabled]
                    if (dataEnabled.isEnabled(element)) {
                        element.onclick = function (evt) {
                            // mark everybody not active
                            navSibilings_1.forEach(function (e) { return dataActive_1.setActive(e, false); });
                            dataActive_1.setActive(nav_1, true);
                            _this.displayContent(tab_1, nav_1, navSibilings_1);
                            // update route on click
                            if (dataRoute_1.exists(tab_1)) {
                                var thisRoute = dataRoute_1.appendHash(dataRoute_1.getRoute(tab_1), _this.getRaw(nav_1));
                                dataRoute_1.setRoute(thisRoute);
                            }
                        };
                    }
                    // [data-active]
                    if (dataActive_1.isActive(element)) {
                        this.displayContent(tab_1, nav_1, navSibilings_1);
                    }
                    this.attribute.markElementLoaded(element, true);
                }
                return true;
            };
            DefaultAttributeValue.prototype.displayContent = function (tab, nav, siblings) {
                var dataTabContent = this.resolver.resolve(Attv.DataTabContent.UniqueId);
                var contentName = this.getRaw(nav);
                var contentElement = tab.parentElement.querySelector("[" + dataTabContent.name + "=\"" + contentName + "\"]");
                if (contentElement) {
                    var parentElement = contentElement.parentElement;
                    // hide all children
                    parentElement.querySelectorAll(dataTabContent.toString()).forEach(function (e) { return e.hide(); });
                    dataTabContent.getValue(contentElement).loadElement(contentElement);
                }
                return false;
            };
            return DefaultAttributeValue;
        }(Attv.Attribute.Value));
        DataTabNav.DefaultAttributeValue = DefaultAttributeValue;
    })(DataTabNav = Attv.DataTabNav || (Attv.DataTabNav = {}));
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
    (function (DataTabContent) {
        /**
         * [data-tab-nav]="*"
         */
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attribute, settingsFn, validators) {
                if (validators === void 0) { validators = []; }
                var _this = _super.call(this, undefined, attribute, settingsFn, validators) || this;
                _this.resolver.uses.push(Attv.DataContent.UniqueId, Attv.DataPartial.UniqueId, Attv.DataActive.UniqueId);
                return _this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                if (!this.attribute.isElementLoaded(element)) {
                    element.show();
                    // [data-content]
                    var dataContent = this.resolver.resolve(Attv.DataContent.UniqueId);
                    if (dataContent.exists(element)) {
                        element.html(dataContent.getContent(element));
                        return;
                    }
                    // [data-partial]
                    var dataPartial = this.resolver.resolve(Attv.DataPartial.UniqueId);
                    if (dataPartial.exists(element)) {
                        dataPartial.renderPartial(element);
                        return;
                    }
                    Attv.loadElements(element);
                    this.attribute.markElementLoaded(element, true);
                }
                return true;
            };
            return DefaultAttributeValue;
        }(Attv.Attribute.Value));
        DataTabContent.DefaultAttributeValue = DefaultAttributeValue;
    })(DataTabContent = Attv.DataTabContent || (Attv.DataTabContent = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Settings //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTab;
    (function (DataTab) {
        var DefaultSettings = /** @class */ (function (_super) {
            __extends(DefaultSettings, _super);
            function DefaultSettings() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.style = "\n/* Style the tab */\n[data-tab] {\n    overflow: hidden;\n    border: 1px solid #ccc;\n    background-color: #f1f1f1;\n}\n\n/* Style the buttons inside the tab */\n[data-tab] [data-tab-nav] {\n    background-color: inherit;\n    float: left;\n    border: none;\n    outline: none;\n    cursor: pointer;\n    padding: 14px 16px;\n    transition: 0.3s;\n    font-size: 17px;\n    list-style: none;\n}\n\n[data-tab] [data-tab-nav][data-enabled=\"false\"] {\n    cursor: default;\n    opacity: 0.5;\n}\n[data-tab] [data-tab-nav][data-enabled=\"false\"]:hover {\n    background-color: inherit;\n}\n\n/* Change background color of buttons on hover */\n[data-tab] [data-tab-nav]:hover {\n    background-color: #ddd;\n}\n\n/* Create an active/current tablink class */\n[data-tab] [data-tab-nav][data-active=true] {\n    background-color: #ccc;\n}\n\n/* Style the tab content */\n[data-tab-content]{\n    display: none;\n    padding: 6px 12px;\n    border: 1px solid #ccc;\n    border-top: none;\n}\n";
                return _this;
            }
            return DefaultSettings;
        }(Attv.Attribute.Settings));
        DataTab.DefaultSettings = DefaultSettings;
    })(DataTab = Attv.DataTab || (Attv.DataTab = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-tab', function (attributeName) { return new Attv.DataTab(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTab.DefaultValue(Attv.configuration.defaultTag, attribute, function (name, value) { return new Attv.DataTab.DefaultSettings(name, value); }));
    });
    Attv.registerAttribute('data-tab-nav', function (attributeName) { return new Attv.DataTabNav(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTabNav.DefaultAttributeValue(attribute));
    });
    Attv.registerAttribute('data-tab-content', function (attributeName) { return new Attv.DataTabContent(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTabContent.DefaultAttributeValue(attribute));
    });
    Attv.registerAttributeValue(Attv.DataPartial.UniqueId, function (attribute, list) {
        list.push(new Attv.DataTab.DataTabDialogAttributeValue(attribute));
    });
});
