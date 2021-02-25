/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-url.ts" />
// ------------------------------------------------- //

describe("Attv.DataUrl", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataUrl).toBeDefined();
        expect(Attv.DataUrl.Key).toBeDefined();
    });

    it('Attv should have [data-url] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataUrl.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("*");
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('constructor() should create an instance', () => {
        let dataUrl = new Attv.DataUrl();

        expect(dataUrl).toBeInstanceOf(Attv.Attribute);
    });

    it('raw() should returns url', () => {
        let element = document.createElement('div');
        element.setAttribute('data-url', 'https://github.com');

        let dataUrl = new Attv.DataUrl();
        let expected = dataUrl.raw(element);

        expect(expected).toEqual("https://github.com");
    });

    it('raw() should returns url (form)', () => {
        let element = document.createElement('form');
        element.setAttribute('action', 'https://github.com');

        let dataUrl = new Attv.DataUrl();
        let expected = dataUrl.raw(element);

        expect(expected).toEqual("https://github.com");
    });

    it('raw() should returns url (a)', () => {
        let element = document.createElement('a');
        element.setAttribute('href', 'https://github.com');

        let dataUrl = new Attv.DataUrl();
        let expected = dataUrl.raw(element);

        expect(expected).toEqual("https://github.com");
    });

    it('raw() should returns url (with other attributes)', () => {
        let element = document.createElement('div');
        element.setAttribute('data-url', 'https://github.com');
        element.setAttribute('data-method', 'post');
        element.setAttribute('data-cache', 'true');

        let dataUrl = new Attv.DataUrl();
        let expected = dataUrl.raw(element);

        expect(expected.indexOf("https://github.com")).toBeGreaterThan(-1); // exists
        expect(expected.indexOf("?_")).toBeGreaterThan(-1); // exists
    });

    it('raw() should returns url (with other attributes) #2', () => {
        let element = document.createElement('div');
        element.setAttribute('data-url', 'https://github.com');
        element.setAttribute('data-method', 'post');
        element.setAttribute('data-cache', 'true');

        let dataUrl = new Attv.DataUrl();
        let expected = dataUrl.raw(element);

        expect(expected.indexOf('https://github.com')).toBe(0);  // starts with
        expect(expected.indexOf('?_')).toBeGreaterThan(-1);
    });

    it('raw() should returns url (with other attributes - no cache) #3', () => {
        let element = document.createElement('div');
        element.setAttribute('data-url', 'https://github.com');
        element.setAttribute('data-method', 'post');
        element.setAttribute('data-cache', 'false');

        let dataUrl = new Attv.DataUrl();
        let expected = dataUrl.raw(element);

        expect(expected.indexOf('https://github.com')).toBe(0);  // starts with
        expect(expected.indexOf('?_')).toEqual(-1);
    });
    
});