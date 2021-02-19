namespace Attv.DataApp {

    export interface App {
        name?: string;

        settings?: Settings;
    }

    export interface Settings {

        /**
         * The default container
         */
        container: string;

        routes: Route[]

    }

    export interface Route extends Ajax.AjaxOptions {
        (key: string): any;

        name: string;

        path: string;

        container?: string;

        isDefault?: boolean;
    }

    export namespace Routes {

        /**
         * Checks if location route matches/starts-with hash
         * @param hash the hash
         */
        export function matches(hash: string) {
            hash = Routes.cleanHash(hash);
            let locationRoute = Routes.getLocationRoute();

            // TODO: refactor
            if (locationRoute.startsWith(hash)) {
                // make sure
                if (locationRoute === hash) {
                    return true;
                } else {
                    // makes sure there's / after the index
                    let nextChar = locationRoute.substr(locationRoute.indexOf(hash) + hash.length, 1);
                    return nextChar === '/';
                }
            }

            return false;
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
            
            let needManualDispatch = window.location.hash === hash;

            window.location.hash = Routes.cleanHash(hash);

            if (needManualDispatch) {
                // manually dispatch the hash change event
                window.dispatchEvent(new HashChangeEvent("hashchange"));
            }
        }
    }

}