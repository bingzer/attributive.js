
namespace Attv {
    export class DataInterval extends Attv.Attribute {
        static readonly Key: string = 'data-interval';

        constructor() {
            super(Attv.DataInterval.Key);
            this.wildcard = "<number>";
            this.isAutoLoad = false;
        }

        interval(element: HTMLElement, fn: () => void): IntervalTimer {
            let ms = parseInt(this.raw(element));
            
            return DataInterval.run(fn, ms);
        }

        /**
         * Runs a function with interval
         * @param fn function to run
         * @param ms how long? in milliseconds
         * @param until how long until the inteval stops (in milliseconds)
         */
        static run(fn: () => void, ms: number, until?: number): IntervalTimer {
            let timer = { interval: ms, until: until, fn: fn };
            
            return DataInterval.step(timer, ms);
        }

        static stop(timer: IntervalTimer) {
            window.cancelAnimationFrame(timer.id);
        }

        private static step(timer: IntervalTimer, timestamp: number): IntervalTimer {
            // if no interval is defined
            if (!timer.interval) {
                timer.fn();
                return timer;
            }

            if (timer.step === undefined) {
                timer.since = Date.now();
                timer.step = timestamp - timer.interval;
                timer.fn();
            }

            const elapsed = timestamp - timer.step;
            if (elapsed > timer.interval) {
                timer.fn();
                timer.step = timestamp;
                timer.id = window.requestAnimationFrame(timestamp => this.step(timer, timestamp));

                // -- check until
                if (timer.until && (Date.now() - timer.since) >= timer.until) {
                    DataInterval.stop(timer);
                }
            }
            else {
                timer.id = window.requestAnimationFrame(timestamp => this.step(timer, timestamp));
            }

            return timer;
        }
    }

    export interface IntervalTimer {
        id?: number;
        interval?: number;
        step?: number;
        since?: number;
        until?: number;
        fn: () => void;
    }
}

Attv.register(() => new Attv.DataInterval());