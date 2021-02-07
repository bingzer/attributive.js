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

    it('constructor() should create an instance', () => {
        let dataTarget = new Attv.DataTarget();

        expect(dataTarget).toBeInstanceOf(Attv.Attribute);
    });

    it('getTargetElement() should return an element', () => {
        let element = document.createElement('div');
        element.setAttribute('data-target', 'body');

        let dataSource = new Attv.DataTarget();
        let expected = dataSource.getTargetElement(element);

        expect(expected).toBeInstanceOf(HTMLBodyElement);
    });

});