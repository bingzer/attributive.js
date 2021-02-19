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
                    Attv.DataPartial.renderPartial(route)
                    return;
                }
            }

            // let dataRoute = this.attribute.resolve<Attv.DataRoute>(Attv.DataRoute.Key);
            // let dataPartial = this.attribute.resolve<Attv.DataPartial>(Attv.DataPartial.Key);

            // let routeElements = Attv.toArray<HTMLElement>(element.querySelectorAll(dataRoute.selector()));
            // routeElements.forEach(routeElement => {
            //     let route = dataRoute.getRoute(routeElement);
            //     if (dataRoute.matches(route)) {
            //         let attValue = dataPartial.getValue<Attv.DataApp.Partial.Nav>(routeElement);
            //         if (attValue instanceof Attv.DataApp.Partial.Nav) {
            //             attValue.render(routeElement, options.context);
            //         } else {
            //             routeElement.click();
            //         }
            //     }
            // });
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