/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-active.ts" />
// ------------------------------------------------- //

describe("Attv.DataActive", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataActive).toBeDefined();
        expect(Attv.DataActive.Key).toBeDefined();
    });

    it('Attv should have [data-active] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataActive.Key);

        expect(attribute.isAutoLoad).toEqual(false);
        expect(attribute.key).toEqual(Attv.DataActive.Key);
        expect(attribute.wildcard).toEqual("<boolean>");
    });

    it('constructor() should create an instance', () => {
        let dataActive = new Attv.DataActive();
        expect(dataActive).toBeInstanceOf(Attv.Attribute);
    });

    it('isActive() should return true', () => {
        let element = document.createElement('div');
        element.setAttribute('data-active', 'true');

        let dataActive = new Attv.DataActive();
        let expected = dataActive.isActive(element);

        expect(expected).toEqual(true);
    });

    it('isActive() should return false', () => {
        let element = document.createElement('div');
        element.setAttribute('data-active', 'false');

        let dataActive = new Attv.DataActive();
        let expected = dataActive.isActive(element);

        expect(expected).toEqual(false);
    });

    it('setActive() should set to true', () => {
        let element = document.createElement('div');

        let dataActive = new Attv.DataActive();
        dataActive.setActive(element, true);

        expect(element.getAttribute('data-active')).toEqual("true");
    });

    it('setActive() should set to false', () => {
        let element = document.createElement('div');

        let dataActive = new Attv.DataActive();
        dataActive.setActive(element, false);

        expect(element.getAttribute('data-active')).toEqual("false");
    });
});