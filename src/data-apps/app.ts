namespace Attv.DataApp {

    /**
     * An App object
     */
    export interface App {

        /**
         * Name of the app
         */
        name?: string;

        /**
         * Settings
         */
        settings?: Settings;
    }

    /**
     * Settings object.
     * Optionally you can define a settings name via [data-app-settings] attribute.
     * However, this will take precedence
     */
    export interface Settings {

        /**
         * The default container
         */
        container: string;

        /**
         * Message on lock if defined, the app will place a lock on refresh.
         */
        lock?: string;

        /**
         * The routes
         */
        routes: Route[]

    }

    /**
     * Route object
     */
    export interface Route extends Ajax.AjaxOptions {
        /**
         * Optional additional property
         */
        [key: string]: any;

        /**
         * Path
         */
        path?: string;

        /**
         * Match path
         */
        match?: string;

        /**
         * Container to put the html in
         */
        container?: string;

        /**
         * If set. Will be the browser title
         */
        title?: string;

        /**
         * True if default route
         */
        isDefault?: boolean;

        /**
         * If specified then caller can assign 'context' object
         * to the route which will in turn be assigned to LoadElementOptions context
         */
        withContext?: (match?: RouteMatch, fn?: (context?: any) => void) => void;

        /**
         * Function to execute when url is not provided
         */
        fn?: (match?: RouteMatch) => void;

        /**
         * A condition must be true, if this function is defined.
         */
        when?: (() => boolean);
    }

    export interface RouteMatch {
        isMatch: boolean;

        routeContext: any;
    }

    /**
     * Routes related functions
     */
    export namespace Routes {

        /**
         * Checks if location route matches/starts-with hash
         * @param hash the hash
         */
        export function matches(route: Route): RouteMatch {
            let hash = Routes.cleanHash(route.path || route.match);
            let locationRoute = Routes.getLocationRoute();
            let isMatch = route.isDefault;
            let context = undefined;

            // TODO: refactor
            if (locationRoute.startsWith(hash)) {
                // make sure
                if (locationRoute === hash) {
                    isMatch = true;
                } else {
                    // makes sure there's / after the index
                    let nextChar = locationRoute.substr(locationRoute.indexOf(hash) + hash.length, 1);
                    isMatch = nextChar === '/';
                }
            } else if (route.match && locationRoute.match(hash)) {
                isMatch = true;
                context = locationRoute.match(hash)
            }

            // check when condition
            if (route.when && !route.when()) {
                isMatch = false;
            }

            return {
                isMatch: isMatch,
                routeContext: context
            };
        }

        export function appendHash(...hash: string[]) {
            let result = hash?.map(h => Routes.cleanHash(h))?.join('/');
            return Routes.cleanHash(result);
        }

        export function getLocationRoute(): string {
            return Routes.cleanHash(window.location.hash);
        }

        export function cleanHash(hash: string): string {
            return hash?.replace('#', '')?.replace(/\/\//, '/');
        }

        export function getHash(hash: string): string {
            if (!hash?.startsWith('#')) {
                hash = '#' + hash;
            } 

            return hash;
        }

        export function navigateTo(hash: string) {
            if (Attv.isUndefined(hash)) {
                return;
            }
            
            let needManualDispatch = window.location.hash === Routes.getHash(hash);

            window.location.hash = Routes.cleanHash(hash);

            if (needManualDispatch) {
                // manually dispatch the hash change event
                window.dispatchEvent(new HashChangeEvent("hashchange"));
            }
        }
    }

}