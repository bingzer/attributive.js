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

    it('constructor() should create an instance', () => {
        let dataActive = new Attv.DataCache();

        expect(dataActive).toBeInstanceOf(Attv.Attribute);
    });

    it('useCache() should return true', () => {
        let element = document.createElement('div');
        element.setAttribute('data-cache', 'true');

        let dataActive = new Attv.DataCache();

        expect(dataActive.useCache(element)).toBeTrue();
    });

    it('useCache() should return false', () => {
        let element = document.createElement('div');
        element.setAttribute('data-cache', 'false');
        
        let dataActive = new Attv.DataCache();

        expect(dataActive.useCache(element)).toBeFalse();
    });

});