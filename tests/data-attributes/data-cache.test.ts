/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-cache.ts" />
// ------------------------------------------------- //

describe("Attv.DataCache", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataCache).toBeDefined();
        expect(Attv.DataCache.Key).toBeDefined();
    });

    it('Attv should have [data-cache] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataCache.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("<boolean>");
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('useCache() should return true', () => {
        let element = document.createElement('div');
        element.setAttribute('data-cache', 'true');

        let attribute = Attv.getAttribute(Attv.DataCache.Key);

        expect(attribute.parseRaw<boolean>(element)).toBeTrue();
    });

    it('useCache() should return false', () => {
        let element = document.createElement('div');
        element.setAttribute('data-cache', 'false');

        let attribute = Attv.getAttribute(Attv.DataCache.Key);

        expect(attribute.parseRaw<boolean>(element)).toBeFalse();
    });

});