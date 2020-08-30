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
            _this.dependency.uses.push(Attv.DataContent.UniqueId, Attv.DataUrl.UniqueId, Attv.DataModal.UniqueId, Attv.DataTitle.UniqueId, Attv.DataPartial.UniqueId);
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
            function DefaultValue(attributeValue, attribute, validators) {
                if (validators === void 0) { validators = [
                    new Attv.Validators.RequiredElement(['a', 'button'])
                ]; }
                return _super.call(this, attributeValue, attribute, validators) || this;
            }
            DefaultValue.prototype.loadElement = function (element) {
                var _this = this;
                // remove onclick
                if (element.attr('onclick')) {
                    this.resolver.addAttribute(Attv.DataCallback.UniqueId, element, element.attr('onclick'));
                }
                element.onclick = function (ev) {
                    _this.show(element);
                    return false;
                };
                return true;
            };
            DefaultValue.prototype.show = function (elementOrSettings) {
                var _this = this;
                if (elementOrSettings instanceof HTMLElement) {
                    var element_1 = elementOrSettings;
                    this.loadSettings(element_1, function (settings) {
                        settings.isModal = settings.isModal || _this.resolver.resolve(Attv.DataModal.UniqueId).isModal(element_1);
                        settings.title = settings.title || _this.resolver.resolve(Attv.DataTitle.UniqueId).getTitle(element_1);
                        settings.content = settings.content || _this.resolver.resolve(Attv.DataContent.UniqueId).getContent(element_1);
                        if (!settings.content) {
                            var dataPartial_1 = _this.resolver.resolve(Attv.DataPartial.UniqueId);
                            if (dataPartial_1.exists(element_1)) {
                                settings.callback = function (contentElement) {
                                    dataPartial_1.getValue(element_1).render(element_1, undefined, { targetElement: contentElement });
                                };
                            }
                        }
                        settings.titleSelector = settings.titleSelector || DataDialog.DialogSettings.DefaultTitleSelector;
                        settings.contentSelector = settings.contentSelector || DataDialog.DialogSettings.DefaultContentSelector;
                        settings.templateHtml = settings.templateHtml || DataDialog.DialogSettings.DefaultTemplateHtml;
                        settings.style = DataDialog.DialogSettings.getStyle(settings);
                        _this.showDialog(settings);
                    });
                }
                else {
                    this.showDialog(elementOrSettings);
                }
            };
            DefaultValue.prototype.showDialog = function (settings) {
                var templateHtmlElement = Attv.createHTMLElement(settings.templateHtml);
                var dialogElement = templateHtmlElement.querySelector('dialog');
                // add to the body
                document.body.append(dialogElement);
                if (settings.title) {
                    dialogElement.querySelector(settings.titleSelector).html(settings.title);
                }
                if (settings.content) {
                    dialogElement.querySelector(settings.contentSelector).html(settings.content);
                }
                if (settings.isModal) {
                    dialogElement.showModal();
                }
                else {
                    dialogElement.show();
                }
                if (settings.callback) {
                    settings.callback(dialogElement.querySelector(settings.contentSelector));
                }
                return dialogElement;
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
////////////////////////////////////// Settings ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DataDialog;
    (function (DataDialog) {
        var DialogSettings;
        (function (DialogSettings) {
            DialogSettings.DefaultTitleSelector = "h3.attv-dialog-header-title";
            DialogSettings.DefaultContentSelector = ".attv-dialog-body-content";
            DialogSettings.DefaultTemplateHtml = "\n<dialog class=\"attv-dialog\">\n    <div class=\"attv-dialog-header\">\n        <div class=\"attv-dialog-header-content\">\n            <h3 class=\"attv-dialog-header-title\"></h3>\n        </div>\n    </div>\n    <div class=\"attv-dialog-body\">\n        <div class=\"attv-dialog-body-content\"></div>\n    </div>\n    <div class=\"attv-dialog-footer\">\n        <div class=\"attv-dialog-footer-content\"></div>\n    </div>\n</dialog>";
            function getStyle(settings) {
                return "\ndialog.attv-dialog {\n    border: 1px solid gray;\n    min-width: 250px;\n}\ndialog.attv-dialog h3.attv-dialog-header-title {\n    margin-top: 8px;\n}\ndialog.attv-dialog .attv-dialog-body {\n    margin-bottom: 8px;\n}\n";
            }
            DialogSettings.getStyle = getStyle;
        })(DialogSettings = DataDialog.DialogSettings || (DataDialog.DialogSettings = {}));
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
        list.push(new Attv.DataDialog.DefaultValue(Attv.configuration.defaultTag, attribute));
        list.push(new Attv.DataDialog.DefaultValue('click', attribute));
    });
    Attv.registerAttribute('data-modal', function (name) { return new Attv.DataModal(name); });
    Attv.registerAttributeValue(Attv.DataPartial.UniqueId, function (attribute, list) {
        list.push(new Attv.DataDialog.DataPartialDialogValue(attribute));
    });
});

//# sourceMappingURL=data-dialog.js.map
