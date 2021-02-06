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

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('constructor() should create an instance', () => {
        let attribute = new Attv.DataEnabled();

        expect(attribute.key).toEqual(Attv.DataEnabled.Key);
        expect(attribute.wildcard).toEqual("<boolean>");
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('isEnabled() should return true', () => {
        let element = document.createElement('div');
        element.setAttribute('data-enabled', 'true');

        let dataEnabled = new Attv.DataEnabled();
        let expected = dataEnabled.isEnabled(element);

        expect(expected).toEqual(true);
    });

    it('isEnabled() should return false', () => {
        let element = document.createElement('div');
        element.setAttribute('data-enabled', 'false');

        let dataEnabled = new Attv.DataEnabled();
        let expected = dataEnabled.isEnabled(element);

        expect(expected).toEqual(false);
    });
});