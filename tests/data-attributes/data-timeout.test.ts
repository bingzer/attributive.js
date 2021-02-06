/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-timeout.ts" />
// ------------------------------------------------- //

describe("Attv.DataTimeout", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataTimeout).toBeDefined();
        expect(Attv.DataTimeout.Key).toBeDefined();
    });

    it('Attv should have [data-timeout] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataTimeout.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("<number>");
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('constructor() should create an instance', () => {
        let dataTarget = new Attv.DataTimeout();

        expect(dataTarget).toBeInstanceOf(Attv.Attribute);
    });

});