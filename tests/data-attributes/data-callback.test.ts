/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-callback.ts" />
// ------------------------------------------------- //

describe("Attv.DataCallback", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataCallback).toBeDefined();
        expect(Attv.DataCallback.Key).toBeDefined();
    });

    it('Attv should have [data-callback] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataCallback.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("<jsExpression>");
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('constructor() should create an instance', () => {
        let dataActive = new Attv.DataCallback();

        expect(dataActive).toBeInstanceOf(Attv.Attribute);
    });

    it('callback()', () => {
        let element = document.createElement('div');
        element.setAttribute('data-callback', 'any');

        let dataActive = new Attv.DataCallback();

        let any = dataActive.callback(element);
        expect(any).toBeDefined();
    });

});