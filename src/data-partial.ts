/// <reference path="attv.ts" />

namespace Attv.DataPartial {
    export const Key: string = "data-partial";

    export class Value extends Attv.AttributeValue {
    }

    export function enderPartial(element: HTMLElement | string, content?: string): void {
        if (Attv.isString(element)) {
            element = document.querySelector(element as string) as HTMLElement;
        }

        let htmlElement = element as HTMLElement;

        let attribute = Attv.getAttribute(Key);
        let attributeValue = attribute.getValue(element as HTMLElement);

        throw new Error('todo');
    }
}