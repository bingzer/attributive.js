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
    var DataDialog = /** @class */ (function (_super) {
        __extends(DataDialog, _super);
        function DataDialog(name) {
            var _this = _super.call(this, DataDialog.UniqueId, name, true) || this;
            _this.configuration = new DataDialog.DialogConfiguration();
            _this.dependency.uses.push(Attv.DataContent.UniqueId, Attv.DataUrl.UniqueId, DataModal.UniqueId, Attv.DataTitle.UniqueId, Attv.DataOptions.UniqueId);
            _this.dependency.internals.push(Attv.DataCallback.UniqueId);
            return _this;
        }
        DataDialog.prototype.show = function (element) {
            return this.getValue(element).show(element);
        };
        DataDialog.UniqueId = "DataDialog";
        return DataDialog;
    }(Attv.Attribute));
    Attv.DataDialog = DataDialog;
    (function (DataDialog) {
        /**
         * [data-dialog]="default|click"
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
                element.onclick = function (ev) { return _this.show(element); };
                return true;
            };
            DefaultAttributeValue.prototype.show = function (optionsOrElements) {
                var dataDialog = this.attribute;
                var options;
                if (optionsOrElements instanceof HTMLElement) {
                    var htmlElement = optionsOrElements;
                    options = this.resolver.resolve(Attv.DataOptions.UniqueId).getOptions(htmlElement);
                    options.isModal = options.isModal || this.resolver.resolve(DataModal.UniqueId).isModal(htmlElement);
                    options.title = options.title || this.resolver.resolve(Attv.DataTitle.UniqueId).getTitle(htmlElement);
                    options.content = options.content || this.resolver.resolve(Attv.DataContent.UniqueId).getContent(htmlElement);
                }
                else {
                    options = optionsOrElements;
                }
                options.templateHtml = dataDialog.configuration.templateHtml;
                options.templateStyle = dataDialog.configuration.templateStyle;
                options.titleSelector = dataDialog.configuration.titleSelector;
                options.contentSelector = dataDialog.configuration.contentSelector;
                return this.doShow(options);
            };
            DefaultAttributeValue.prototype.doShow = function (options) {
                var dialogElement = Attv.createHTMLElement(options.templateHtml).querySelector('dialog');
                // add to the body
                document.body.append(dialogElement);
                if (options.title) {
                    dialogElement.querySelector(options.titleSelector).html(options.title);
                }
                dialogElement.querySelector(options.contentSelector).html(options.content || '');
                if (options.isModal) {
                    dialogElement.showModal();
                }
                else {
                    dialogElement.show();
                }
                return dialogElement;
            };
            return DefaultAttributeValue;
        }(Attv.AttributeValue));
        DataDialog.DefaultAttributeValue = DefaultAttributeValue;
        var DialogConfiguration = /** @class */ (function () {
            function DialogConfiguration() {
                this.templateHtml = "\n<dialog class=\"attv-dialog\">\n <div class=\"attv-dialog-header\">\n  <div class=\"attv-dialog-header-content\">\n   <h3 class=\"attv-dialog-header-title\"></h3>\n  </div>\n </div>\n <div class=\"attv-dialog-body\">\n  <div class=\"attv-dialog-body-content\"></div>\n </div>\n <div class=\"attv-dialog-footer\">\n  <div class=\"attv-dialog-footer-content\"></div>\n </div>\n</dialog>";
                this.titleSelector = "h3.attv-dialog-header-title";
                this.contentSelector = '.attv-dialog-body-content';
                this.templateStyle = "";
            }
            return DialogConfiguration;
        }());
        DataDialog.DialogConfiguration = DialogConfiguration;
    })(DataDialog = Attv.DataDialog || (Attv.DataDialog = {}));
    /**
     * [data-modal]="true|false"
     */
    var DataModal = /** @class */ (function (_super) {
        __extends(DataModal, _super);
        function DataModal(name) {
            return _super.call(this, DataModal.UniqueId, name, false) || this;
        }
        DataModal.prototype.isModal = function (element) {
            var rawValue = this.getValue(element).getRawValue(element);
            return rawValue === 'true';
        };
        DataModal.UniqueId = "DataModal";
        return DataModal;
    }(Attv.Attribute));
    Attv.DataModal = DataModal;
})(Attv || (Attv = {}));
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-dialog', function (attributeName) { return new Attv.DataDialog(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataDialog.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
        list.push(new Attv.DataDialog.DefaultAttributeValue('click', attribute));
    });
    Attv.registerAttribute('data-modal', function (name) { return new Attv.DataModal(name); });
});
//# sourceMappingURL=data-dialog.js.map