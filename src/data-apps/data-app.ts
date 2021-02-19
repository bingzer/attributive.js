namespace Attv.DataApp {
    export const Key = "data-app";

    export class Default extends Attv.AttributeValue {
        
        load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
            if (!this.attribute.isLoaded(element)) {
                let app = this.findApp(element, options);

                window.addEventListener("hashchange", evt => this.onHashChanged(app, element, options, evt), false);

                DataApp.lock(!!app.settings?.lock, app.settings?.lock);
            };

        }

        private findApp(element: HTMLElement, options?: LoadElementOptions): App {
            let value = this.attribute.raw(element);
            let expression = new Attv.Binders.AliasExpression(value);
            let evaluated = expression.evaluate(options.context);
            let app = evaluated.value;

            if (Attv.isUndefined(app)) {
                Attv.log('fatal', `${expression.expression} not found`);
            }

            return app;
        }

        private onHashChanged(app: App, element: HTMLElement, options?: LoadElementOptions, event?: Event) {
            let routes = app?.settings?.routes || [];

            document.title = app.name;

            for (let i = 0; i < routes.length; i++) {
                let route = routes[i];
                if (Routes.matches(route.path) || route.isDefault) {
                    // check when condition
                    if (route.when && !route.when()) {
                        continue;
                    }

                    route.container = route.container || app.settings.container;

                    let partialOptions = route as Attv.DataPartial.PartialOptions;
                    partialOptions.afterRender = (model, element) => {
                        // set title
                        document.title = route.title || app.name;
                    };

                    Attv.DataPartial.renderPartial(partialOptions);

                    break;
                }
            }
        }

    }

    /**
     * Navigate to a hash location.
     * You should always use this function rather than window.location.hash due to
     * event dispatching when the hash is not changed
     * @param hash hash location
     */
    export function navigate(hash: string) {
        Routes.navigateTo(hash);
        Attv.loadElements(undefined, { forceReload: true });
    }

    /**
     * Lock the app so that user does not accidentally refresh the browser
     * @param lock true to lock, falsy to unlock
     * @param message optional message. Not every browser support this
     */
    export function lock(lock?: boolean, message?: string) {
        if (lock) {
            window.onbeforeunload = (evt) => message;
        } else {
            window.onbeforeunload = undefined;
        }
    }
}

Attv.register(Attv.DataApp.Key, { wildcard: "<jsExpression>", isAutoLoad: true, priority: 0 }, att => {
    att.deps.uses = [
        Attv.DataRoute.Key,
        Attv.DataPartial.Key
    ];

    att.map(() => new Attv.DataApp.Default());
});