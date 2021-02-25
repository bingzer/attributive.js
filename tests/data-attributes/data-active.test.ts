/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-active.ts" />
// ------------------------------------------------- //

describe("Attv.DataActive", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataActive).toBeDefined();
        expect(Attv.DataActive.Key).toBeDefined();
    });

    it('Attv should have [data-active] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataActive.Key);

        expect(attribute.isAutoLoad).toEqual(false);
        expect(attribute.key).toEqual(Attv.DataActive.Key);
        expect(attribute.wildcard).toEqual("<boolean>");
    });
});