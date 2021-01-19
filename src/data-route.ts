
namespace Attv {
    export class DataRoute extends Attv.Attribute {
        static readonly Key: string = 'data-route';

        constructor() {
            super(Attv.DataRoute.Key);
            this.isAutoLoad = false;
        } 
        
        getRoute(element: HTMLElement) {
            let rawValue = this.raw(element);

            return rawValue;
        }

        getLocationRoute(): string {
            return this.cleanHash(window.location.hash);
        }

        appendHash(...hash: string[]) {
            let result = hash?.map(h => this.cleanHash(h))?.join('/');
            return this.cleanHash(result);
        }

        setRoute(hash: string) {
            if (isUndefined(hash)) {
                return;
            }

            window.location.hash = this.cleanHash(hash);
        }

        getHash(hash: string): string {
            if (!hash?.startsWith('#')) {
                hash = '#' + hash;
            } 

            return hash;
        }

        /**
         * Checks if location route matches/starts-with hash
         * @param hash the hash
         */
        matches(hash: string) {
            hash = this.cleanHash(hash);
            let locationRoute = this.getLocationRoute();

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

        private cleanHash(hash: string): string {
            return hash?.replace('#', '')?.replace(/\/\//, '/');
        }
    } 
}

Attv.register(() => new Attv.DataRoute());