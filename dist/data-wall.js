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
            _this.dependency.uses.push(Attv.DataContent.UniqueId, Attv.DataUrl.UniqueId);
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
        var DefaultAttributeValue = /** @class */ (function (_super) {
            __extends(DefaultAttributeValue, _super);
            function DefaultAttributeValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredAnyElementsValidator(['a', 'button'])
                ]; }
                return _super.call(this, attributeValue, attribute, validators) || this;
            }
            DefaultAttributeValue.prototype.loadElement = function (element) {
                var _this = this;
                // remove onclick
                if (element.attr('onclick')) {
                    this.resolver.addAttribute(Attv.DataCallback.UniqueId, element, element.attr('onclick'));
                }
                element.onclick = function (ev) { return _this.onclick(element, ev); };
                return true;
            };
            DefaultAttributeValue.prototype.onclick = function (element, ev) {
                var dataContent = this.resolver.resolve(Attv.DataContent.UniqueId);
                var content = dataContent.getContent(element);
                alert(content);
                return this.continue(element);
            };
            DefaultAttributeValue.prototype.continue = function (element) {
                var _a;
                var dataUrl = this.resolver.resolve(Attv.DataUrl.UniqueId);
                var url = dataUrl.getValue(element).getRawValue(element);
                var dataCallback = this.resolver.resolve(Attv.DataCallback.UniqueId);
                if (dataCallback.getValue(element).getRawValue(element)) {
                    dataCallback.callback(element);
                }
                else if ((_a = element === null || element === void 0 ? void 0 : element.tagName) === null || _a === void 0 ? void 0 : _a.equalsIgnoreCase('a')) {
                    var target = element.attr('target');
                    Attv.navigate(url || '', target);
                }
                return false;
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        DataWall.DefaultAttributeValue = DefaultAttributeValue;
        /**
         * [data-wall]="confirm"
         */
        var ConfirmAttributeValue = /** @class */ (function (_super) {
            __extends(ConfirmAttributeValue, _super);
            function ConfirmAttributeValue(attribute, validators) {
                if (validators === void 0) { validators = []; }
                return _super.call(this, 'confirm', attribute, validators) || this;
            }
            ConfirmAttributeValue.prototype.onclick = function (element, ev) {
                var dataContent = this.resolver.resolve(Attv.DataContent.UniqueId);
                var content = dataContent.getContent(element);
                if (confirm(content)) {
                    return this.continue(element);
                }
                return false;
            };
            return ConfirmAttributeValue;
        }(DefaultAttributeValue));
        DataWall.ConfirmAttributeValue = ConfirmAttributeValue;
    })(DataWall = Attv.DataWall || (Attv.DataWall = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-wall', function (attributeName) { return new Attv.DataWall(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataWall.DefaultAttributeValue('alert', attribute));
        list.push(new Attv.DataWall.ConfirmAttributeValue(attribute));
    });
});
//# sourceMappingURL=data-wall.js.map