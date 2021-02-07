/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-interval.ts" />
// ------------------------------------------------- //

describe("Attv.DataInterval", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataInterval).toBeDefined();
        expect(Attv.DataInterval.Key).toBeDefined();
    });

    it('Attv should have [data-active] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataInterval.Key);

        expect(attribute).toBeInstanceOf(Attv.DataInterval);
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('constructor() should create an instance', () => {
        let dataInterval = new Attv.DataInterval();

        expect(dataInterval.key).toEqual(Attv.DataInterval.Key);
        expect(dataInterval.wildcard).toEqual("<number>");
        expect(dataInterval.isAutoLoad).toEqual(false);
    });
});