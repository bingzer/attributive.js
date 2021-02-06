/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-identifiers.ts" />
// ------------------------------------------------- //

describe("Attv.DataId", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataId).toBeDefined();
        expect(Attv.DataId.Key).toBeDefined();
    });

    it('Attv should have [data-id] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataId.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("*");
        expect(attribute.isAutoLoad).toEqual(false);
    });
    
});

describe("Attv.DataRef", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataRef).toBeDefined();
        expect(Attv.DataRef.Key).toBeDefined();
    });

    it('Attv should have [data-ref] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataRef.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("*");
        expect(attribute.isAutoLoad).toEqual(false);
    });
    
});