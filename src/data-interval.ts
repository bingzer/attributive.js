
namespace Attv {
    export class DataInterval extends Attv.Attribute {
        static readonly Key: string = 'data-interval';

        constructor() {
            super(Attv.DataInterval.Key);
            this.wildcard = "<number>";
        }

        interval(element: HTMLElement, fn: () => void) {
            let ms = parseInt(this.raw(element));
            
            DataInterval.run(fn, ms);
        }

        static run(fn: () => void, ms: number) {
            if (ms) {
                let timer = new IntervalTimer(ms, fn);
                DataInterval.step(timer, ms);
            }

            fn();
        }

        private static step(intervalTimer: IntervalTimer, timestamp: number) {
            if (intervalTimer.start === undefined) {
                intervalTimer.start = timestamp - intervalTimer.timer;
            }

            const elapsed = timestamp - intervalTimer.start;
            if (elapsed > intervalTimer.timer) {
                intervalTimer.fn();
                intervalTimer.start = timestamp;
                intervalTimer.id = DataInterval.requestAnimationFrame(intervalTimer);
            }
            else {
                intervalTimer.id = DataInterval.requestAnimationFrame(intervalTimer);
            }
        }

        private static requestAnimationFrame(intervalTimer: IntervalTimer): number {
            return window.requestAnimationFrame(timestamp => {
                this.step(intervalTimer, timestamp);
            });
        }
    }

    class IntervalTimer {
        start?: number;
        id?: number;

        constructor (public timer: number, public fn: () => void) {
        }
    }
}

Attv.register(() => new Attv.DataInterval());