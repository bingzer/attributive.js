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
                window.addEventListener("hashchange", e => this.hashChanged(e, element, options), false)
            };

        }


        private hashChanged(event: Event, element: HTMLElement, options?: LoadElementOptions) {
            let dataRoute = this.attribute.resolve<Attv.DataRoute>(Attv.DataRoute.Key);
            let dataPartial = this.attribute.resolve<Attv.DataPartial>(Attv.DataPartial.Key);

            let routeElements = Attv.toArray<HTMLElement>(element.querySelectorAll(dataRoute.selector()));
            routeElements.forEach(routeElement => {
                let route = dataRoute.getRoute(routeElement);
                if (dataRoute.matches(route)) {
                    let attValue = dataPartial.getValue<Attv.DataApp.Partial.Nav>(routeElement);
                    if (attValue instanceof Attv.DataApp.Partial.Nav) {
                        attValue.render(routeElement, options.context);
                    } else {
                        routeElement.click();
                    }
                }
            });
        }

    }

    Attv.register(Attv.DataApp.Key, { wildcard: "<jsExpression>", isAutoLoad: true, priority: 0 }, att => {
        att.deps.uses = [
            Attv.DataRoute.Key,
            Attv.DataPartial.Key
        ];
    
        att.map(() => new Attv.DataApp.Default());
    });
}

namespace Attv.DataApp.Partial {
    export class Nav extends Attv.DataPartial.Click {
        constructor() {
            super();
            this.value = "nav";
            this.deps.requires.push(Attv.DataRoute.Key);
        }

        protected click(ev: Event, element: HTMLElement, options?: PartialOptions) {
            super.click(ev, element, options);

            let dataRoute = this.attribute.resolve<Attv.DataRoute>(Attv.DataRoute.Key);
            let hash = dataRoute.getRoute(element);
            
            dataRoute.setRoute(hash);
        }
    }

    Attv.register(Attv.DataPartial.Key, att => {
        att.map(() => new Attv.DataApp.Partial.Nav());
    });
}