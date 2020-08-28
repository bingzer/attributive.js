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
    var JQuery;
    (function (JQuery) {
        /**
         * [data-jquery]
         */
        var DataJQuery = /** @class */ (function (_super) {
            __extends(DataJQuery, _super);
            function DataJQuery(name) {
                var _this = _super.call(this, DataJQuery.UniqueId, name, true) || this;
                _this.name = name;
                _this.isStrict = true;
                return _this;
            }
            DataJQuery.UniqueId = "DataJQuery";
            return DataJQuery;
        }(Attv.Attribute));
        JQuery.DataJQuery = DataJQuery;
    })(JQuery = Attv.JQuery || (Attv.JQuery = {}));
})(Attv || (Attv = {}));

//# sourceMappingURL=data-jquery.js.map
