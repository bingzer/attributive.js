/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-enabled.ts" />
// ------------------------------------------------- //

describe("Attv.DataEnabled", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataEnabled).toBeDefined();
        expect(Attv.DataEnabled.Key).toBeDefined();
    });

    it('Attv should have [data-enabled] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataEnabled.Key);

        expect(attribute.key).toEqual(Attv.DataEnabled.Key);
        expect(attribute.wildcard).toEqual("<boolean>");
        expect(attribute.isAutoLoad).toEqual(false);
    });
});