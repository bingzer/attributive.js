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
    var Bootstrap4;
    (function (Bootstrap4) {
        /**
         * [data-bootstrap]
         */
        var DataBootstrap = /** @class */ (function (_super) {
            __extends(DataBootstrap, _super);
            function DataBootstrap(name) {
                var _this = _super.call(this, DataBootstrap.UniqueId, name, true) || this;
                _this.name = name;
                _this.isStrict = true;
                _this.priority = 0;
                return _this;
            }
            DataBootstrap.UniqueId = "DataBootstrap4";
            return DataBootstrap;
        }(Attv.Attribute));
        Bootstrap4.DataBootstrap = DataBootstrap;
    })(Bootstrap4 = Attv.Bootstrap4 || (Attv.Bootstrap4 = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Bootstrap4;
    (function (Bootstrap4) {
        /**
         * [data-bootstrap]="bootstrap4"
         */
        var Bootstrap4Value = /** @class */ (function (_super) {
            __extends(Bootstrap4Value, _super);
            function Bootstrap4Value(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredElement(['body'])
                ]; }
                var _this = _super.call(this, attributeValue, attribute, validators) || this;
                _this.resolver.uses.push(Attv.DataRenderer.UniqueId);
                _this.resolver.internals.push(Attv.DataTemplateHtml.UniqueId);
                return _this;
            }
            Bootstrap4Value.prototype.loadElement = function (element) {
                if (!this.attribute.isElementLoaded(element)) {
                    return this.loadSettings(element, function (settings) {
                        if (settings.injectJs)
                            settings.jsUrls = settings.jsUrls || Bootstrap4.BootstrapSettings.JsUrls;
                        if (settings.injectStyles)
                            settings.styleUrls = settings.styleUrls || Bootstrap4.BootstrapSettings.StyleUrls;
                    });
                }
                return true;
            };
            return Bootstrap4Value;
        }(Attv.Attribute.Value));
        Bootstrap4.Bootstrap4Value = Bootstrap4Value;
        /**
         * [data-partial]="tab"
         */
        var DataPartialTabValue = /** @class */ (function (_super) {
            __extends(DataPartialTabValue, _super);
            function DataPartialTabValue(attribute) {
                return _super.call(this, "tab", attribute) || this;
            }
            DataPartialTabValue.prototype.loadElement = function (element) {
                var _this = this;
                if (!this.attribute.isElementLoaded(element)) {
                    if (Attv.isUndefined(window['$'])) {
                        return false;
                    }
                    var anchor = $("a[href='#" + element.id + "']");
                    if (anchor) {
                        anchor.on('shown.bs.tab', function (e) {
                            var targetElement = $(e.target);
                            if (element.id === targetElement.attr('href').replace('#', '')) {
                                _this.render(element);
                            }
                        });
                        if (anchor.is('.active')) {
                            this.render(element);
                        }
                    }
                    return this.attribute.markElementLoaded(element, true);
                }
                return true;
            };
            return DataPartialTabValue;
        }(Attv.DataPartial.DefaultValue));
        Bootstrap4.DataPartialTabValue = DataPartialTabValue;
    })(Bootstrap4 = Attv.Bootstrap4 || (Attv.Bootstrap4 = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// Settings /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Bootstrap4;
    (function (Bootstrap4) {
        var BootstrapSettings;
        (function (BootstrapSettings) {
            BootstrapSettings.StyleUrls = [
                {
                    name: 'bootstrap-css',
                    url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
                    options: {
                        integrity: 'sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T',
                        crossorigin: 'anonymous'
                    }
                }
            ];
            BootstrapSettings.JsUrls = [
                {
                    name: 'jquery',
                    url: 'https://code.jquery.com/jquery-3.3.1.slim.min.js',
                    options: {
                        integrity: 'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo',
                        crossorigin: 'anonymous'
                    }
                },
                {
                    name: 'popper',
                    url: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
                    options: {
                        integrity: 'sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1',
                        crossorigin: 'anonymous'
                    }
                },
                {
                    name: 'bootstrap',
                    url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
                    options: {
                        integrity: 'sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM',
                        crossorigin: 'anonymous'
                    }
                },
            ];
        })(BootstrapSettings = Bootstrap4.BootstrapSettings || (Bootstrap4.BootstrapSettings = {}));
    })(Bootstrap4 = Attv.Bootstrap4 || (Attv.Bootstrap4 = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-bootstrap', function (attributeName) { return new Attv.Bootstrap4.DataBootstrap(attributeName); }, function (attribute, list) {
        list.push(new Attv.Bootstrap4.Bootstrap4Value('bootstrap4', attribute));
    });
    Attv.registerAttributeValue(Attv.DataPartial.UniqueId, function (attribute, list) {
        list.push(new Attv.Bootstrap4.DataPartialTabValue(attribute));
    });
});

//# sourceMappingURL=data-bootstrap4.js.map
