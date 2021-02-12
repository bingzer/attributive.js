/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-walls/data-wall.ts" />
// ------------------------------------------------- //

describe("Attv.DataWall", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataWall).toBeDefined();
        expect(Attv.DataWall.Key).toBeDefined();
    });

    it('Attv should have [data-wall] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataWall.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("none");
        expect(attribute.isAutoLoad).toEqual(true);
    });

    it('constructor() should create an instance', () => {
        let dataActive = new Attv.DataWall();

        expect(dataActive).toBeInstanceOf(Attv.Attribute);
    });

});


describe("Attv.DataWall.Default", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataWall.Default).toBeDefined();
    });

});

describe("Attv.DataWall.Confirm", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataWall.Confirm).toBeDefined();
    });

});