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
    var Bootbox;
    (function (Bootbox) {
        /**
         * [data-wall]="alert"
         */
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Bootbox.BootboxLibraryValidator(),
                    new Attv.Validators.RequiredElement(['a', 'button'])
                ]; }
                var _this = _super.call(this, attributeValue, attribute, validators) || this;
                _this.resolver.uses.push(Attv.DataContent.UniqueId, Attv.DataTitle.UniqueId, Attv.DataCallback.UniqueId);
                _this.resolver.internals.push(Attv.DataCallback.UniqueId);
                return _this;
            }
            DefaultValue.prototype.onclick = function (element, ev) {
                var _this = this;
                this.loadSettings(element, function (settings) {
                    settings = _this.mapSettings(element, settings);
                    bootbox.alert(settings);
                });
                return false;
            };
            DefaultValue.prototype.mapSettings = function (element, settings) {
                var dataContent = this.resolver.resolve(Attv.DataContent.UniqueId);
                var dataTitle = this.resolver.resolve(Attv.DataTitle.UniqueId);
                var dataCallback = this.resolver.resolve(Attv.DataCallback.UniqueId);
                settings.message = settings.message || dataContent.getContent(element);
                settings.title = settings.title || dataTitle.getTitle(element);
                settings.callback = settings.callback || dataCallback.callback(element);
                return settings;
            };
            DefaultValue.prototype.bootboxShow = function (settings) {
                bootbox.alert(settings);
            };
            return DefaultValue;
        }(Attv.DataWall.DefaultValue));
        Bootbox.DefaultValue = DefaultValue;
        /**
         * [data-wall]="confirm"
         */
        var ConfirmValue = /** @class */ (function (_super) {
            __extends(ConfirmValue, _super);
            function ConfirmValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Bootbox.BootboxLibraryValidator(),
                    new Attv.Validators.RequiredElement(['a', 'button'])
                ]; }
                return _super.call(this, attributeValue, attribute, validators) || this;
            }
            ConfirmValue.prototype.mapSettings = function (element, settings) {
                var dataCallback = this.resolver.resolve(Attv.DataCallback.UniqueId);
                settings = _super.prototype.mapSettings.call(this, element, settings);
                // more for confirm
                settings.callback = function (result) {
                    if (dataCallback.exists(element)) {
                        dataCallback.callback(element);
                    }
                };
                return settings;
            };
            ConfirmValue.prototype.bootboxShow = function (settings) {
                bootbox.confirm(settings);
            };
            return ConfirmValue;
        }(DefaultValue));
        Bootbox.ConfirmValue = ConfirmValue;
    })(Bootbox = Attv.Bootbox || (Attv.Bootbox = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Validators ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Bootbox;
    (function (Bootbox) {
        var BootboxLibraryValidator = /** @class */ (function () {
            function BootboxLibraryValidator() {
            }
            BootboxLibraryValidator.prototype.validate = function (value, element) {
                var isValidated = true;
                if (!window.bootbox) {
                    isValidated = false;
                    Attv.log('fatal', value.toString(true) + " is requiring bootboxjs", element);
                }
                return isValidated;
            };
            return BootboxLibraryValidator;
        }());
        Bootbox.BootboxLibraryValidator = BootboxLibraryValidator;
    })(Bootbox = Attv.Bootbox || (Attv.Bootbox = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttributeValue(Attv.DataWall.UniqueId, function (attribute, list) {
        list.push(new Attv.Bootbox.DefaultValue('alert', attribute));
        list.push(new Attv.Bootbox.ConfirmValue('confirm', attribute));
    });
});

//# sourceMappingURL=data-bootbox.js.map
