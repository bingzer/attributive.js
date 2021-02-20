namespace Attv {
    
    /**
     * [data-spinner]
     */
    export class DataSpinner extends Attv.Attribute {
        static readonly Key: string = 'data-spinner';

        constructor() {
            super(Attv.DataSpinner.Key);

            this.isAutoLoad = true;
        }
    }

    export namespace DataSpinner {

        /**
         * [data-spinner="default"].
         * Styles From: https://www.w3schools.com/howto/howto_css_loader.asp
         */
        export class Default extends Attv.AttributeValue {
            
            load(element: HTMLElement, options?: LoadElementOptions) {
                this.injectStyleIfNeeded();
                if (!this.attribute.isLoaded(element)) {
                    let settings = this.attribute.getSettings(element) || {} as any;
    
                    settings.innerColor = settings.innerColor || '#c0c0c0';
                    settings.outerColor = settings.outerColor || '#555';
                    settings.borderSize = settings.borderSize || '5px';
                    settings.border = settings.border || `${settings.borderSize} solid ${settings.innerColor}`;
                    settings.borderTop = settings.borderTop || `${settings.borderSize} solid ${settings.outerColor}`;
                    settings.borderRadius = '50%';
                    settings.width = settings.width || '25px';
                    settings.height = settings.height || settings.width;
                    settings.WebkitAnimation = 'spin 1s linear infinite';
                    settings.animation = settings.WebkitAnimation;
                    if (element.tagName?.equalsIgnoreCase('span')) {
                        settings.display = settings.display || 'inline-block';
                    }

                    let style = '';
                    Object.keys(settings).forEach(key => {
                        style += `${key.camelCaseToDash()}: ${settings[key]};`;
                    });

                    element.attvAttr('style', style);
                }

                return true;
            }

            protected getStyleId() {
                return `${this.attribute.name}-${this.value}`;
            }
            
            protected injectStyleIfNeeded() {
                let style = Attv.select(`style#${this.getStyleId()}`);
                if (!style) {
                    style = document.createElement('style');
                    style.id = this.getStyleId();
                    style.attvHtml(`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`);

                    document.querySelector('head').append(style);
                }
            }

        }
    }
}

Attv.register(() => new Attv.DataSpinner(), att => {
    att.map(() => new Attv.DataSpinner.Default());
});