/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-partials/data-partial.ts" />
// ------------------------------------------------- //

describe("Attv.DataPartial", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataPartial).toBeDefined();
        expect(Attv.DataPartial.Key).toBeDefined();
    });

    it('Attv should have [data-partial] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataPartial.Key);

        expect(attribute).toBeInstanceOf(Attv.DataPartial);
        expect(attribute.wildcard).toEqual("none");
        expect(attribute.isAutoLoad).toEqual(true);
        expect(attribute.deps.requires.length).toBeGreaterThan(0);
        expect(attribute.deps.uses.length).toBeGreaterThan(0);
    });

    it("should create an instance of DataPartial", () => {
        let attribute = new Attv.DataPartial();

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.key).toEqual(Attv.DataPartial.Key);
        expect(attribute.wildcard).toEqual("none");
        expect(attribute.isAutoLoad).toEqual(true);
        expect(attribute.deps.requires.length).toBeGreaterThan(0);
        expect(attribute.deps.uses.length).toBeGreaterThan(0);
    });

});