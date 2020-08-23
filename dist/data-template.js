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
    var DataTemplate = /** @class */ (function (_super) {
        __extends(DataTemplate, _super);
        function DataTemplate(attributeName, renderer) {
            if (renderer === void 0) { renderer = new DataTemplate.Renderers.DefaultRenderer(); }
            var _this = _super.call(this, attributeName, true) || this;
            _this.attributeName = attributeName;
            _this.renderer = renderer;
            return _this;
        }
        return DataTemplate;
    }(Attv.DataAttribute));
    Attv.DataTemplate = DataTemplate;
    // --- DataPartial Renderer
    (function (DataTemplate) {
        var Renderers;
        (function (Renderers) {
            var DefaultRenderer = /** @class */ (function () {
                function DefaultRenderer() {
                }
                DefaultRenderer.prototype.render = function (dataAttribute, element, content) {
                    element.innerHTML = content;
                    Attv.loadElements(element);
                };
                return DefaultRenderer;
            }());
            Renderers.DefaultRenderer = DefaultRenderer;
        })(Renderers = DataTemplate.Renderers || (DataTemplate.Renderers = {}));
    })(DataTemplate = Attv.DataTemplate || (Attv.DataTemplate = {}));
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerDataAttribute('data-template', function (attributeName) { return new Attv.DataTemplate(attributeName); });
});
//# sourceMappingURL=data-template.js.map