/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-models/data-binder.ts" />
// ------------------------------------------------- //

describe("Attv.DataBinder", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataBinder).toBeDefined();
        expect(Attv.DataBinder.Key).toBeDefined();
    });

    it('Attv should have [data-binder] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataBinder.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("*");
        expect(attribute.isAutoLoad).toEqual(false);
    });

});