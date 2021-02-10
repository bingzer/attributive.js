/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-models/data-model-context.ts" />
// ------------------------------------------------- //

describe("Attv.DataModelContext", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataModelContext).toBeDefined();
        expect(Attv.DataModelContext.Key).toBeDefined();
    });

    it('Attv should have [data-callback] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataModelContext.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("*");
        expect(attribute.isAutoLoad).toEqual(false);
    });

});