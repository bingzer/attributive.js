/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-source.ts" />
// ------------------------------------------------- //

describe("Attv.DataSource", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataSource).toBeDefined();
        expect(Attv.DataSource.Key).toBeDefined();
    });

    it('Attv should have [data-source] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataSource.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("<querySelector>");
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('getSourceElement() should return an element', () => {
        let element = document.createElement('div');
        element.setAttribute('data-source', 'body');

        let attribute = Attv.getAttribute(Attv.DataSource.Key);
        let expected = attribute.parseRaw<HTMLElement>(element);

        expect(expected).toBeInstanceOf(HTMLBodyElement);
    });

});