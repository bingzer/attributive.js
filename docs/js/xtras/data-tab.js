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
            _this.wildcard = "none";
            _this.dependency.uses.push(Attv.DataTabContent.UniqueId, Attv.DataTabItem.UniqueId);
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
            function DefaultValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = []; }
                return _super.call(this, attributeValue, attribute, validators) || this;
            }
            DefaultValue.prototype.loadElement = function (element) {
                var _this = this;
                return this.loadSettings(element, function (settings) {
                    var dataTabItem = _this.resolver.resolve(Attv.DataTabItem.UniqueId);
                    element.querySelectorAll(dataTabItem.toString()).forEach(function (itemElement) {
                        dataTabItem.getValue(itemElement).loadElement(itemElement);
                    });
                    settings.style = Attv.DataTab.DefaultSettings.getStyle(settings);
                    _this.attribute.markElementLoaded(element, true);
                });
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataTab.DefaultValue = DefaultValue;
        /**
         * [data-partial]="tab"
         */
        var DataPartialTabValue = /** @class */ (function (_super) {
            __extends(DataPartialTabValue, _super);
            function DataPartialTabValue(attribute) {
                return _super.call(this, 'tab', attribute) || this;
            }
            DataPartialTabValue.prototype.loadElement = function (element) {
                return false;
            };
            DataPartialTabValue.prototype.render = function (element, content, options) {
                if (!this.attribute.isElementLoaded(element)) {
                    _super.prototype.render.call(this, element, content, options);
                    this.attribute.markElementLoaded(element, true);
                }
            };
            DataPartialTabValue.prototype.doRender = function (element, content, options) {
                _super.prototype.doRender.call(this, element, content, options);
                this.attribute.markElementLoaded(element, true);
            };
            return DataPartialTabValue;
        }(Attv.DataPartial.DefaultValue));
        DataTab.DataPartialTabValue = DataPartialTabValue;
    })(DataTab = Attv.DataTab || (Attv.DataTab = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// DataTabNav ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    /**
     * [data-tab-item]
     */
    var DataTabItem = /** @class */ (function (_super) {
        __extends(DataTabItem, _super);
        function DataTabItem(name) {
            var _this = _super.call(this, DataTabItem.UniqueId, name) || this;
            _this.name = name;
            _this.dependency.uses.push(Attv.DataEnabled.UniqueId, Attv.DataActive.UniqueId);
            _this.dependency.internals.push(Attv.DataRoute.UniqueId);
            return _this;
        }
        DataTabItem.UniqueId = 'DataTabItem';
        return DataTabItem;
    }(Attv.Attribute));
    Attv.DataTabItem = DataTabItem;
    (function (DataTabItem) {
        /**
         * [data-tab-item]="*"
         */
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attribute, validators) {
                if (validators === void 0) { validators = []; }
                var _this = _super.call(this, undefined, attribute, validators) || this;
                _this.resolver.uses.push(Attv.DataEnabled.UniqueId, Attv.DataActive.UniqueId, Attv.DataTabContent.UniqueId);
                _this.resolver.internals.push(Attv.DataTab.UniqueId);
                return _this;
            }
            DefaultValue.prototype.loadElement = function (element) {
                var _this = this;
                if (!this.attribute.isElementLoaded(element)) {
                    var dataTab = this.resolver.resolve(Attv.DataTab.UniqueId);
                    var dataActive_1 = this.resolver.resolve(Attv.DataActive.UniqueId);
                    var dataEnabled = this.resolver.resolve(Attv.DataEnabled.UniqueId);
                    var dataRoute_1 = this.resolver.resolve(Attv.DataRoute.UniqueId);
                    var tab_1 = element.closest(dataTab.toString());
                    var item_1 = element;
                    var itemSiblings_1 = __spreadArrays(tab_1.querySelectorAll(this.toString())); // force as array
                    var onclick_1 = function (evt) {
                        // mark everybody not active
                        _this.setItemActive(dataActive_1, item_1, true, itemSiblings_1);
                        _this.displayContent(tab_1, item_1, itemSiblings_1);
                        // update route on click
                        if (dataRoute_1.exists(tab_1)) {
                            var thisRoute = dataRoute_1.appendHash(dataRoute_1.getRoute(tab_1), _this.getRaw(item_1));
                            dataRoute_1.setRoute(thisRoute);
                        }
                        return false;
                    };
                    // #1. from the route first
                    // [data-route]
                    var locationRoute = dataRoute_1.getLocationRoute();
                    if (locationRoute) {
                        for (var i = 0; i < itemSiblings_1.length; i++) {
                            var route = dataRoute_1.appendHash(dataRoute_1.getRoute(tab_1), this.getRaw(itemSiblings_1[i]));
                            if (dataRoute_1.matches(route)) {
                                // mark everybody not active
                                this.setItemActive(dataActive_1, itemSiblings_1[i], true, itemSiblings_1);
                                break;
                            }
                        }
                    }
                    // element is an <a>
                    if (dataRoute_1.exists(tab_1) && element.tagName.equalsIgnoreCase('a')) {
                        var thisRoute = dataRoute_1.appendHash(dataRoute_1.getRoute(tab_1), this.getRaw(item_1));
                        element.attvAttr('href', dataRoute_1.getHash(thisRoute));
                    }
                    // [data-enabled]
                    if (dataEnabled.isEnabled(element)) {
                        element.onclick = onclick_1;
                        // if parent element is an <li>
                        if (element.parentElement.tagName.equalsIgnoreCase('li')) {
                            element.parentElement.onclick = onclick_1;
                        }
                    }
                    else {
                        if (element.tagName.equalsIgnoreCase('a')) {
                            element.removeAttribute('href');
                        }
                        if (element.parentElement.tagName.equalsIgnoreCase('li')) {
                            element.parentElement.attvAttr(dataEnabled, false);
                        }
                    }
                    // [data-active]
                    if (dataActive_1.isActive(element)) {
                        this.displayContent(tab_1, item_1, itemSiblings_1);
                    }
                    this.attribute.markElementLoaded(element, true);
                }
                return true;
            };
            DefaultValue.prototype.setItemActive = function (dataActive, item, isActive, siblings) {
                var _this = this;
                var _a, _b;
                // mark everybody else not active
                if (!!siblings) {
                    siblings.forEach(function (e) {
                        _this.setItemActive(dataActive, e, false);
                    });
                }
                dataActive.setActive(item, isActive);
                if ((_b = (_a = item.parentElement) === null || _a === void 0 ? void 0 : _a.tagName) === null || _b === void 0 ? void 0 : _b.equalsIgnoreCase('li')) {
                    dataActive.setActive(item.parentElement, isActive);
                }
            };
            DefaultValue.prototype.displayContent = function (tab, item, siblings) {
                var dataTabContent = this.resolver.resolve(Attv.DataTabContent.UniqueId);
                var contentName = this.getRaw(item);
                var contentElement = tab.parentElement.querySelector("[" + dataTabContent.name + "=\"" + contentName + "\"]");
                if (contentElement) {
                    var parentElement = contentElement.parentElement;
                    // hide all children
                    parentElement.querySelectorAll(dataTabContent.toString()).forEach(function (e) { return e.attvHide(); });
                    dataTabContent.getValue(contentElement).loadElement(contentElement);
                }
                return false;
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataTabItem.DefaultValue = DefaultValue;
    })(DataTabItem = Attv.DataTabItem || (Attv.DataTabItem = {}));
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
         * [data-tab-content]="*"
         */
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attribute, validators) {
                if (validators === void 0) { validators = []; }
                var _this = _super.call(this, undefined, attribute, validators) || this;
                _this.resolver.uses.push(Attv.DataContent.UniqueId, Attv.DataPartial.UniqueId, Attv.DataActive.UniqueId);
                return _this;
            }
            DefaultValue.prototype.loadElement = function (element) {
                element.attvShow();
                if (!this.attribute.isElementLoaded(element)) {
                    // [data-content]
                    var dataContent = this.resolver.resolve(Attv.DataContent.UniqueId);
                    if (dataContent.exists(element)) {
                        element.attvHtml(dataContent.getContent(element));
                        return this.attribute.markElementLoaded(element, true);
                    }
                    // [data-partial]
                    var dataPartial = this.resolver.resolve(Attv.DataPartial.UniqueId);
                    if (dataPartial.exists(element)) {
                        dataPartial.renderPartial(element);
                        return this.attribute.markElementLoaded(element, true);
                    }
                    Attv.loadElements(element);
                    this.attribute.markElementLoaded(element, true);
                }
                return true;
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataTabContent.DefaultValue = DefaultValue;
    })(DataTabContent = Attv.DataTabContent || (Attv.DataTabContent = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Settings //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataTab;
    (function (DataTab) {
        var DefaultSettings;
        (function (DefaultSettings) {
            function getStyle(settings) {
                return "\n/* Style the tab */\n" + settings.attributeValue.attribute + " {\n    overflow: hidden;\n    border: 1px solid #ccc;\n    background-color: #f1f1f1;\n}\n\n/* Style the buttons inside the tab */\n" + settings.attributeValue.attribute + " li {\n    background-color: inherit;\n    float: left;\n    border: none;\n    outline: none;\n    padding: 14px 16px;\n    transition: 0.3s;\n    font-size: 17px;\n    list-style: none;\n}\n" + settings.attributeValue.attribute + " li {\n    background-color: inherit;\n    float: left;\n    border: none;\n    outline: none;\n    padding: 14px 16px;\n    transition: 0.3s;\n    font-size: 17px;\n    list-style: none;\n}\n\n/* Change background color of buttons on hover */\n" + settings.attributeValue.attribute + " li:not([data-enabled=\"false\"]):hover {\n    cursor: pointer;\n}\n\n/* Create an active/current tablink class */\n" + settings.attributeValue.attribute + " li[data-active=true] {\n    background-color: #ccc;\n}\n\n/* Style the tab content */\n" + settings.attributeValue.attribute + " [data-tab-content]{\n    display: none;\n    padding: 6px 12px;\n    border: 1px solid #ccc;\n    border-top: none;\n}\n\n" + settings.attributeValue.attribute + " [data-tab-item][data-enabled=\"false\"] {\n    cursor: default;\n    opacity: 0.5;\n}\n" + settings.attributeValue.attribute + " li[data-enabled=\"false\"]:hover,\n" + settings.attributeValue.attribute + " [data-tab-item][data-enabled=\"false\"]:hover {\n    background-color: inherit;\n}\n";
            }
            DefaultSettings.getStyle = getStyle;
        })(DefaultSettings = DataTab.DefaultSettings || (DataTab.DefaultSettings = {}));
    })(DataTab = Attv.DataTab || (Attv.DataTab = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-tab', function (attributeName) { return new Attv.DataTab(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTab.DefaultValue(Attv.configuration.defaultTag, attribute));
    });
    Attv.registerAttribute('data-tab-item', function (attributeName) { return new Attv.DataTabItem(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTabItem.DefaultValue(attribute));
    });
    Attv.registerAttribute('data-tab-content', function (attributeName) { return new Attv.DataTabContent(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataTabContent.DefaultValue(attribute));
    });
    Attv.registerAttributeValue(Attv.DataPartial.UniqueId, function (attribute, list) {
        list.push(new Attv.DataTab.DataPartialTabValue(attribute));
    });
});

//# sourceMappingURL=data-tab.js.map
