
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
            // let hash = dataRoute.getRoute(element);
            
            // dataRoute.setRoute(hash); 
        }
    }
}

Attv.register(Attv.DataPartial.Key, att => {
    att.map(() => new Attv.DataApp.Partial.Nav());
});