namespace Attv.DataApp {
    export const Key = "data-app";

    export class Default extends Attv.AttributeValue {
        
        load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
            let app = this.findApp(element, options);

            if (!this.attribute.isLoaded(element)) {
                window.addEventListener("hashchange", evt => this.onHashChanged(app, element, options, evt), false);

                DataApp.lock(app.lock);
            }
        }

        private findApp(element: HTMLElement, options?: LoadElementOptions): App {
            let value = this.attribute.raw(element, options.context);
            let expression = new Attv.Expressions.AliasExpression(value);
            let evaluated = expression.evaluate(options?.context);
            let app = evaluated.value;

            if (Attv.isUndefined(app)) {
                Attv.log('fatal', `${expression.expression} not found`);
            }

            // get from settings
            let settings = this.attribute.getSettings<Attv.DataApp.App>(element);
            if (settings) {
                // Fill what's missing only
                Object.keys(settings).forEach(key => {
                    if (!app[key]) {
                        app[key] = settings[key];
                    }
                });
            }

            return app;
        }

        private onHashChanged(app: App, element: HTMLElement, options?: LoadElementOptions, event?: Event) {
            let routes = app?.routes || [];

            document.title = app.name;

            let renderPartial = (route: Route, partialOptions: Attv.DataPartial.PartialOptions) => {
                partialOptions.afterRender = (model, element) => {
                    // set title
                    document.title = route.title || app.name;
                };

                Attv.DataPartial.renderPartial(partialOptions);
            };

            for (let i = 0; i < routes.length; i++) {
                let route = routes[i];
                let routeMatch = Routes.matches(route);
                if (routeMatch.isMatch) {
                    if (Attv.isType(route.fn, 'function')) {
                        route.fn(routeMatch);
                    } else {
                        route.container = route.container || app.container;
    
                        let partialOptions = route as Attv.DataPartial.PartialOptions;
                        if (route.withContext) {
                            route.withContext(routeMatch, (context) => {
                                partialOptions.context = context;
                                renderPartial(route, partialOptions);
                            });
                        } else {
                            renderPartial(route, partialOptions);
                        }
                    }

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
        Attv.reloadElements();
    }

    /**
     * Navigate to a hash location.
     * You should always use this function rather than window.location.hash due to
     * event dispatching when the hash is not changed
     * @param hash hash location
     */
    export function refresh() {
        navigate(Routes.currentHash());
    }

    /**
     * Lock the app so that user does not accidentally refresh the browser
     * @param lock true to lock, falsy to unlock
     * @param message optional message. Not every browser support this
     */
    export function lock(lock?: boolean | string) {
        if (lock) {
            window.onbeforeunload = (evt) => lock as string;
        } else {
            window.onbeforeunload = undefined;
        }
    }
}

Attv.register(Attv.DataApp.Key, { wildcard: "<jsExpression>", isAutoLoad: true, priority: 0 }, att => {
    att.deps.uses = [
        Attv.DataPartial.Key
    ];
 
    att.map(() => new Attv.DataApp.Default());
});