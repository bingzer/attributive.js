/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-target.ts" />
// ------------------------------------------------- //

describe("Attv.DataTarget", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataTarget).toBeDefined();
        expect(Attv.DataTarget.Key).toBeDefined();
    });

    it('Attv should have [data-target] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataTarget.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("<querySelector>");
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('getTargetElement() should return an element', () => {
        let element = document.createElement('div');
        element.setAttribute('data-target', 'body');

        let attribute = Attv.getAttribute(Attv.DataTarget.Key);
        let expected = attribute.parseRaw<HTMLElement>(element);

        expect(expected).toBeInstanceOf(HTMLBodyElement);
    });

});