/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-content.ts" />
// ------------------------------------------------- //

describe("Attv.DataContent", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataContent).toBeDefined();
        expect(Attv.DataContent.Key).toBeDefined();
    });

    it('Attv should have [data-content] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataContent.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("*");
        expect(attribute.isAutoLoad).toEqual(false);
    });
    
});