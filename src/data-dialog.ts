namespace Attv {
    
    export class DataDialog extends Attv.Attribute {
        static readonly UniqueId = "DataDialog";
        public configuration = new DataDialog.DialogConfiguration();

        constructor (name: string) {
            super(DataDialog.UniqueId, name, true);

            this.dependency.uses.push(DataContent.UniqueId, DataUrl.UniqueId, DataModal.UniqueId, DataTitle.UniqueId, DataOptions.UniqueId, DataPartial.UniqueId);
            this.dependency.internals.push(DataCallback.UniqueId);
        }

        show(element: HTMLElement): HTMLDialogElement {
            return this.getValue<DataDialog.DefaultAttributeValue>(element).show(element);
        }
    }

    export namespace DataDialog {

        /**
         * [data-dialog]="default|click"
         */
        export class DefaultAttributeValue extends AttributeValue {

            constructor (attributeValue: string, 
                attribute: Attv.Attribute, 
                validators: Validators.AttributeValidator[] = [
                    new Validators.RequiredAnyElementsValidator(['a', 'button'])
                ]) {
                super(attributeValue, attribute, validators);
            }
            
            loadElement(element: HTMLElement): boolean {
                // remove onclick
                if (element.attr('onclick')) {
                    this.resolver.addAttribute(DataCallback.UniqueId, element, element.attr('onclick'));
                }

                element.onclick = (ev: Event) => this.show(element);

                return true;
            }

            show(optionsOrElements: DataDialog.DialogOptions | HTMLElement): HTMLDialogElement {
                let dataDialog = this.attribute as DataDialog;

                let options: DataDialog.DialogOptions;

                if (optionsOrElements instanceof HTMLElement) {
                    let htmlElement = optionsOrElements as HTMLElement;

                    options = this.resolver.resolve<DataOptions>(DataOptions.UniqueId).getOptions<DialogOptions>(htmlElement);
                    options.isModal = options.isModal || this.resolver.resolve<DataModal>(DataModal.UniqueId).isModal(htmlElement);
                    options.title = options.title || this.resolver.resolve<DataTitle>(DataTitle.UniqueId).getTitle(htmlElement);
                    options.content = options.content || this.resolver.resolve<DataContent>(DataContent.UniqueId).getContent(htmlElement);
                    if (!options.content) {
                        let dataPartial = this.resolver.resolve<DataPartial>(DataPartial.UniqueId);
                        if (dataPartial.exists(htmlElement)) {
                            options.callback = (contentElement: HTMLElement) => {
                                dataPartial.getValue<DataPartialDialogAttributeValue>(htmlElement).render(htmlElement, undefined, { targetElement: contentElement } as any);
                            }
                        }
                    }
                } else {
                    options = optionsOrElements as DataDialog.DialogOptions;
                }

                options.templateHtml = dataDialog.configuration.templateHtml;
                options.templateStyle = dataDialog.configuration.templateStyle;
                options.titleSelector = dataDialog.configuration.titleSelector;
                options.contentSelector = dataDialog.configuration.contentSelector;

                return this.doShow(options);
            }

            private doShow(options: DataDialog.DialogOptions): HTMLDialogElement {
                let dialogElement = Attv.createHTMLElement(options.templateHtml).querySelector('dialog') as HTMLDialogElement;

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
                } else {
                    dialogElement.show();
                }

                if (options.callback) {
                    options.callback(dialogElement.querySelector(options.contentSelector));
                }

                return dialogElement;
            }
        }
        
        export class DialogConfiguration {
            templateHtml = `
<dialog class="attv-dialog">
 <div class="attv-dialog-header">
  <div class="attv-dialog-header-content">
   <h3 class="attv-dialog-header-title"></h3>
  </div>
 </div>
 <div class="attv-dialog-body">
  <div class="attv-dialog-body-content"></div>
 </div>
 <div class="attv-dialog-footer">
  <div class="attv-dialog-footer-content"></div>
 </div>
</dialog>`;
            titleSelector = "h3.attv-dialog-header-title";
            contentSelector = '.attv-dialog-body-content';
            templateStyle = ``;
        }

        export interface DialogOptions extends DialogConfiguration {
            isModal: boolean;
            content: string;
            title?: string;
            closeOnEscape?: boolean;
            closeOnOutsideClick?: boolean;
            size: string;

            callback: (contentElement: HTMLElement) => void;
        }

        /**
         * [data-partial]="dialog"
         */
        export class DataPartialDialogAttributeValue extends Attv.DataPartial.DefaultAttributeValue {
            
            constructor (attribute: Attv.Attribute) {
                super('dialog', attribute)
            }

            protected doRender(element: HTMLElement, content?: string, options?: Ajax.AjaxOptions) {
                // [data-template-source]                
                let html = this.resolver.resolve<DataTemplateSource>(DataTemplateSource.UniqueId).renderTemplate(element, content);

                // [data-target]
                let targetElement = this.resolver.resolve<DataTarget>(DataTarget.UniqueId).getTargetElement(element) || (options as any)?.targetElement as HTMLElement;

                targetElement.html(html);

                Attv.loadElements(targetElement);
            }
        }
    }

    /**
     * [data-modal]="true|false"
     */
    export class DataModal extends Attv.Attribute {
        static readonly UniqueId = "DataModal";

        constructor (name: string) {
            super(DataModal.UniqueId, name, false);
        }

        isModal(element: HTMLElement): boolean {
            let rawValue = this.getValue(element).getRawValue(element);

            return rawValue === 'true';
        }
    }
}

Attv.loader.pre.push(() => {
    Attv.registerAttribute('data-dialog', 
        (attributeName: string) => new Attv.DataDialog(attributeName),
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataDialog.DefaultAttributeValue(Attv.configuration.defaultTag, attribute));
            list.push(new Attv.DataDialog.DefaultAttributeValue('click', attribute));
        });
    Attv.registerAttribute('data-modal', (name: string) => new Attv.DataModal(name));

    Attv.registerAttributeValue(Attv.DataPartial.UniqueId,
        (attribute: Attv.Attribute, list: Attv.AttributeValue[]) => {
            list.push(new Attv.DataDialog.DataPartialDialogAttributeValue(attribute));
        }
    );
});