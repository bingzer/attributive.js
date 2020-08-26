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
                return _this;
            }
            DataBootstrap.UniqueId = "DataBootstrap";
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
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredElementValidator(['body'])
                ]; }
                var _this = _super.call(this, attributeValue, attribute, validators) || this;
                _this.resolver.uses.push(Attv.DataRenderer.UniqueId);
                _this.resolver.internals.push(Attv.DataTemplateHtml.UniqueId);
                return _this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                if (!this.attribute.configuration && !this.attribute.isElementLoaded(element)) {
                    this.attribute.configuration = new Bootstrap4.BootstrapConfiguration(this.attribute);
                    this.attribute.configuration.commit();
                }
                return true;
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        Bootstrap4.DefaultAttributeValue = DefaultAttributeValue;
    })(Bootstrap4 = Attv.Bootstrap4 || (Attv.Bootstrap4 = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// AttributeConfiguration ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Bootstrap4;
    (function (Bootstrap4) {
        var BootstrapConfiguration = /** @class */ (function (_super) {
            __extends(BootstrapConfiguration, _super);
            function BootstrapConfiguration() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.styleUrls = [
                    {
                        name: 'bootstrap-css',
                        url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
                        options: {
                            integrity: 'sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T',
                            crossorigin: 'anonymous'
                        }
                    }
                ];
                _this.jsUrls = [
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
                return _this;
            }
            return BootstrapConfiguration;
        }(Attv.AttributeConfiguration));
        Bootstrap4.BootstrapConfiguration = BootstrapConfiguration;
    })(Bootstrap4 = Attv.Bootstrap4 || (Attv.Bootstrap4 = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-bootstrap', function (attributeName) { return new Attv.Bootstrap4.DataBootstrap(attributeName); }, function (attribute, list) {
        list.push(new Attv.Bootstrap4.DefaultAttributeValue('bootstrap4', attribute));
    });
});
//# sourceMappingURL=data-bootstrap.js.map