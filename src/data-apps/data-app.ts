namespace Attv.DataApp {
    export const Key = "data-app";

    export class Default extends Attv.AttributeValue {
        
        load(element: HTMLElement, options?: LoadElementOptions): BooleanOrVoid {
            let value = this.attribute.raw(element);
            let expression = new Attv.Binders.AliasExpression(value);
            let evaluated = expression.evaluate(options.context);
            let app = evaluated.value;

            if (Attv.isUndefined(app)) {
                Attv.log('fatal', `${expression.expression} not found`);
            }
            
            if (!this.attribute.isLoaded(element)) {
                window.addEventListener("hashchange", e => this.hashChanged(app, element, options, e), false)
            };

        }


        private hashChanged(app: App, element: HTMLElement, options?: LoadElementOptions, event?: Event) {
            let routes = app?.settings?.routes || [];

            for (let i = 0; i < routes.length; i++) {
                let route = routes[i];
                if (Routes.matches(route.path) || route.isDefault) {
                    route.container = route.container || app.settings.container;
                    Attv.DataPartial.renderPartial(route)
                    return;
                }
            }
        }

    }

    export function navigate(hash: string) {
        Routes.navigateTo(hash);
        Attv.loadElements(undefined, { forceReload: true });
    }
}

Attv.register(Attv.DataApp.Key, { wildcard: "<jsExpression>", isAutoLoad: true, priority: 0 }, att => {
    att.deps.uses = [
        Attv.DataRoute.Key,
        Attv.DataPartial.Key
    ];

    att.map(() => new Attv.DataApp.Default());
});