/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-load.ts" />
// ------------------------------------------------- //

describe("Attv.DataLoad", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataLoad).toBeDefined();
        expect(Attv.DataLoad.Key).toBeDefined();
    });

    it('Attv should have [data-load] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataLoad.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("<querySelector>");
        expect(attribute.isAutoLoad).toEqual(false);
    });
    
});