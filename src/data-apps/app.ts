namespace Attv.DataApp {

    /**
     * An App object
     */
    export interface App {
        /**
         * Optional additional property
         */
        [key: string]: any;

        /**
         * Name of the app
         */
        name?: string;

        /**
         * The main container
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

    /**
     * Route Matching object
     */
    export interface RouteMatch {
        /**
         * Is it a match?
         */
        isMatch: boolean;

        /**
         * Matches
         */
        matches: RegExpMatchArray;

        /**
         * The route that's being match
         */
        route: Route;

        /**
         * Current location
         */
        currentHash: string;
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
            let locationRoute = Routes.currentHash();
            let isMatch = route.isDefault;
            let matches = undefined;

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
                matches = locationRoute.match(hash)
            }

            // check when condition
            if (route.when && !route.when()) {
                isMatch = false;
            }

            return {
                isMatch: isMatch,
                currentHash: locationRoute,
                route: route,
                matches: matches
            };
        }

        export function appendHash(...hash: string[]) {
            let result = hash?.map(h => Routes.cleanHash(h))?.join('/');
            return Routes.cleanHash(result);
        }

        export function currentHash(): string {
            return Routes.cleanHash(window.location.hash);
        }

        export function cleanHash(hash: string): string {
            return hash?.replace('#', '')?.replace(/\/\//, '/').split('?')[0];
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
                if (typeof HashChangeEvent !== "undefined") {
                    window.dispatchEvent(new HashChangeEvent("hashchange"));
                    return;
                }
            
                // HashChangeEvent is not available on all browsers. Use the plain Event.
                try {
                    window.dispatchEvent(new Event("hashchange"));
                    return;
                } catch (error) {
                    // but that fails on ie
                }
            
                // IE workaround
                const ieEvent = document.createEvent("Event");
                ieEvent.initEvent("hashchange", true, true);
                window.dispatchEvent(ieEvent);
            }
        }
    }

}