/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-title.ts" />
// ------------------------------------------------- //

describe("Attv.DataTitle", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataTitle).toBeDefined();
        expect(Attv.DataTitle.Key).toBeDefined();
    });

    it('Attv should have [data-title] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataTitle.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("*");
        expect(attribute.isAutoLoad).toEqual(false);
    });
    
});