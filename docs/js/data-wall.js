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
     * [data-wall]="alert"
     */
    var DataWall = /** @class */ (function (_super) {
        __extends(DataWall, _super);
        function DataWall(name) {
            var _this = _super.call(this, DataWall.UniqueId, name, true) || this;
            _this.name = name;
            _this.isStrict = true;
            _this.dependency.uses.push(Attv.DataContent.UniqueId);
            _this.dependency.internals.push(Attv.DataCallback.UniqueId);
            return _this;
        }
        DataWall.UniqueId = "DataWall";
        return DataWall;
    }(Attv.Attribute));
    Attv.DataWall = DataWall;
    // --- AttributeValues
    (function (DataWall) {
        /**
         * [data-wall]="alert"
         */
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredElement(['a', 'button'])
                ]; }
                return _super.call(this, attributeValue, attribute, validators) || this;
            }
            DefaultValue.prototype.loadElement = function (element) {
                var _this = this;
                // remove onclick
                if (element.attvAttr('onclick')) {
                    this.resolver.addAttribute(Attv.DataCallback.UniqueId, element, element.attvAttr('onclick'));
                    element.removeAttribute('onclick');
                    element.onclick = null;
                }
                element.onclick = function (ev) { return _this.onclick(element, ev); };
                return true;
            };
            DefaultValue.prototype.onclick = function (element, ev) {
                var dataContent = this.resolver.resolve(Attv.DataContent.UniqueId);
                var content = dataContent.getContent(element);
                alert(content);
                return this.continue(element);
            };
            DefaultValue.prototype.continue = function (element) {
                var _a;
                var dataUrl = this.resolver.resolve(Attv.DataUrl.UniqueId);
                var url = dataUrl.getValue(element).getRaw(element);
                var dataCallback = this.resolver.resolve(Attv.DataCallback.UniqueId);
                if (dataCallback.getValue(element).getRaw(element)) {
                    dataCallback.callback(element);
                }
                else if ((_a = element === null || element === void 0 ? void 0 : element.tagName) === null || _a === void 0 ? void 0 : _a.equalsIgnoreCase('a')) {
                    var target = element.attvAttr('target');
                    Attv.navigate(url || '', target);
                }
                return false;
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataWall.DefaultValue = DefaultValue;
        /**
         * [data-wall]="confirm"
         */
        var ConfirmValue = /** @class */ (function (_super) {
            __extends(ConfirmValue, _super);
            function ConfirmValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = []; }
                return _super.call(this, attributeValue, attribute, validators) || this;
            }
            ConfirmValue.prototype.onclick = function (element, ev) {
                var dataContent = this.resolver.resolve(Attv.DataContent.UniqueId);
                var content = dataContent.getContent(element);
                if (confirm(content)) {
                    return this.continue(element);
                }
                return false;
            };
            return ConfirmValue;
        }(DefaultValue));
        DataWall.ConfirmValue = ConfirmValue;
    })(DataWall = Attv.DataWall || (Attv.DataWall = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-wall', function (attributeName) { return new Attv.DataWall(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataWall.DefaultValue('alert', attribute));
        list.push(new Attv.DataWall.ConfirmValue('confirm', attribute));
        list.push(new Attv.DataWall.DefaultValue('native-alert', attribute));
        list.push(new Attv.DataWall.ConfirmValue('native-confirm', attribute));
    });
});

//# sourceMappingURL=data-wall.js.map
