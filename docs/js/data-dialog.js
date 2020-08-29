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
     * [data-dialog]
     */
    var DataDialog = /** @class */ (function (_super) {
        __extends(DataDialog, _super);
        function DataDialog(name) {
            var _this = _super.call(this, DataDialog.UniqueId, name, true) || this;
            _this.isStrict = true;
            _this.dependency.uses.push(Attv.DataContent.UniqueId, Attv.DataUrl.UniqueId, Attv.DataModal.UniqueId, Attv.DataTitle.UniqueId, Attv.DataOptions.UniqueId, Attv.DataPartial.UniqueId);
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
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// AttributeConfiguration ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataDialog;
    (function (DataDialog) {
        var DefaultSettings = /** @class */ (function (_super) {
            __extends(DefaultSettings, _super);
            function DefaultSettings() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.style = "\ndialog.attv-dialog {\n    border: 1px solid gray;\n    min-width: 250px;\n}\ndialog.attv-dialog h3.attv-dialog-header-title {\n    margin-top: 8px;\n}\ndialog.attv-dialog .attv-dialog-body {\n    margin-bottom: 8px;\n}\n";
                _this.templateHtml = "\n<dialog class=\"attv-dialog\">\n    <div class=\"attv-dialog-header\">\n        <div class=\"attv-dialog-header-content\">\n            <h3 class=\"attv-dialog-header-title\"></h3>\n        </div>\n    </div>\n    <div class=\"attv-dialog-body\">\n        <div class=\"attv-dialog-body-content\"></div>\n    </div>\n    <div class=\"attv-dialog-footer\">\n        <div class=\"attv-dialog-footer-content\"></div>\n    </div>\n</dialog>";
                _this.titleSelector = "h3.attv-dialog-header-title";
                _this.contentSelector = '.attv-dialog-body-content';
                return _this;
            }
            return DefaultSettings;
        }(Attv.Attribute.Settings));
        DataDialog.DefaultSettings = DefaultSettings;
    })(DataDialog = Attv.DataDialog || (Attv.DataDialog = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// AttributeValues /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataDialog;
    (function (DataDialog) {
        /**
         * [data-dialog]="default|click"
         */
        var DefaultValue = /** @class */ (function (_super) {
            __extends(DefaultValue, _super);
            function DefaultValue(attributeValue, attribute, settingsFn, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredAnyElementsValidator(['a', 'button'])
                ]; }
                return _super.call(this, attributeValue, attribute, settingsFn, validators) || this;
            }
            DefaultValue.prototype.loadElement = function (element) {
                var _this = this;
                // remove onclick
                if (element.attr('onclick')) {
                    this.resolver.addAttribute(Attv.DataCallback.UniqueId, element, element.attr('onclick'));
                }
                element.onclick = function (ev) { return _this.show(element); };
                return true;
            };
            DefaultValue.prototype.show = function (optionsOrElements) {
                var options;
                if (optionsOrElements instanceof HTMLElement) {
                    var htmlElement_1 = optionsOrElements;
                    options = this.resolver.resolve(Attv.DataOptions.UniqueId).getOptions(htmlElement_1);
                    options.isModal = options.isModal || this.resolver.resolve(Attv.DataModal.UniqueId).isModal(htmlElement_1);
                    options.title = options.title || this.resolver.resolve(Attv.DataTitle.UniqueId).getTitle(htmlElement_1);
                    options.content = options.content || this.resolver.resolve(Attv.DataContent.UniqueId).getContent(htmlElement_1);
                    if (!options.content) {
                        var dataPartial_1 = this.resolver.resolve(Attv.DataPartial.UniqueId);
                        if (dataPartial_1.exists(htmlElement_1)) {
                            options.callback = function (contentElement) {
                                dataPartial_1.getValue(htmlElement_1).render(htmlElement_1, undefined, { targetElement: contentElement });
                            };
                        }
                    }
                }
                else {
                    options = optionsOrElements;
                }
                this.applySettings(options);
                return this.doShow(options);
            };
            DefaultValue.prototype.doShow = function (options) {
                var dialogElement = Attv.createHTMLElement(options.templateHtml).querySelector('dialog');
                // add to the body
                document.body.append(dialogElement);
                if (options.title) {
                    dialogElement.querySelector(options.titleSelector).html(options.title);
                }
                if (options.content) {
                    dialogElement.querySelector(options.contentSelector).html(options.content);
                }
                if (options.isModal) {
                    dialogElement.showModal();
                }
                else {
                    dialogElement.show();
                }
                if (options.callback) {
                    options.callback(dialogElement.querySelector(options.contentSelector));
                }
                return dialogElement;
            };
            DefaultValue.prototype.applySettings = function (options) {
                var _a;
                if (this.settings) {
                    var settings = this.settings;
                    options.templateHtml = settings.templateHtml;
                    options.style = settings.style;
                    options.titleSelector = settings.titleSelector;
                    options.contentSelector = settings.contentSelector;
                }
                (_a = this.settings) === null || _a === void 0 ? void 0 : _a.commit();
            };
            return DefaultValue;
        }(Attv.Attribute.Value));
        DataDialog.DefaultValue = DefaultValue;
        /**
         * [data-partial]="dialog"
         */
        var DataPartialDialogValue = /** @class */ (function (_super) {
            __extends(DataPartialDialogValue, _super);
            function DataPartialDialogValue(attribute) {
                return _super.call(this, 'dialog', attribute) || this;
            }
            DataPartialDialogValue.prototype.doRender = function (element, content, options) {
                var _a;
                // [data-template-source]                
                var html = this.resolver.resolve(Attv.DataTemplateSource.UniqueId).renderTemplate(element, content);
                // [data-target]
                var targetElement = this.resolver.resolve(Attv.DataTarget.UniqueId).getTargetElement(element) || ((_a = options) === null || _a === void 0 ? void 0 : _a.targetElement);
                targetElement.html(html);
                Attv.loadElements(targetElement);
            };
            return DataPartialDialogValue;
        }(Attv.DataPartial.DefaultValue));
        DataDialog.DataPartialDialogValue = DataPartialDialogValue;
    })(DataDialog = Attv.DataDialog || (Attv.DataDialog = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DataModal ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    /**
     * [data-modal]="true|false"
     */
    var DataModal = /** @class */ (function (_super) {
        __extends(DataModal, _super);
        function DataModal(name) {
            return _super.call(this, DataModal.UniqueId, name, false) || this;
        }
        DataModal.prototype.isModal = function (element) {
            var rawValue = this.getValue(element).getRaw(element);
            return rawValue === 'true';
        };
        DataModal.UniqueId = "DataModal";
        return DataModal;
    }(Attv.Attribute));
    Attv.DataModal = DataModal;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Loader ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
Attv.loader.pre.push(function () {
    Attv.registerAttribute('data-dialog', function (attributeName) { return new Attv.DataDialog(attributeName); }, function (attribute, list) {
        list.push(new Attv.DataDialog.DefaultValue(Attv.configuration.defaultTag, attribute, function (name, value) { return new Attv.DataDialog.DefaultSettings(name, value); }));
        list.push(new Attv.DataDialog.DefaultValue('click', attribute, function (_, value) { return new Attv.DataDialog.DefaultSettings('default', value); }));
    });
    Attv.registerAttribute('data-modal', function (name) { return new Attv.DataModal(name); });
    Attv.registerAttributeValue(Attv.DataPartial.UniqueId, function (attribute, list) {
        list.push(new Attv.DataDialog.DataPartialDialogValue(attribute));
    });
});

//# sourceMappingURL=data-dialog.js.map