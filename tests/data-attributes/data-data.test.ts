/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-data.ts" />
// ------------------------------------------------- //

describe("Attv.DataData", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataData).toBeDefined();
        expect(Attv.DataData.Key).toBeDefined();
    });

    it('Attv should have [data-data] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataData.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("<json>");
        expect(attribute.isAutoLoad).toEqual(false);
    });
    
});