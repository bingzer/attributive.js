/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-method.ts" />
// ------------------------------------------------- //

describe("Attv.DataMethod", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataMethod).toBeDefined();
        expect(Attv.DataMethod.Key).toBeDefined();
    });

    it('Attv should have [data-load] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataMethod.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("*");
        expect(attribute.isAutoLoad).toEqual(false);
    });

    it('Should create an instance', () => {
        let dataMethod = new Attv.DataMethod();

        expect(dataMethod).toBeInstanceOf(Attv.Attribute);
    });

    it('raw() should return correct method name', () => {
        let element = document.createElement('div');
        element.setAttribute('data-method', 'post');

        let dataMethod = new Attv.DataMethod();
        let expected = dataMethod.raw(element);

        expect(expected).toEqual('post');
    });

    it('raw() should return correct method name (form)', () => {
        let element = document.createElement('form');
        element.setAttribute('method', 'post');

        let dataMethod = new Attv.DataMethod();
        let expected = dataMethod.raw(element);

        expect(expected).toEqual('post');
    });

    it('raw() should return default method (get)', () => {
        let element = document.createElement('div');

        let dataMethod = new Attv.DataMethod();
        let expected = dataMethod.raw(element);

        expect(expected).toEqual('get');
    });

    it('raw() should return correct method name', () => {
        let element = document.createElement('div');
        element.setAttribute('data-method', 'post');

        let dataMethod = new Attv.DataMethod();
        let expected = dataMethod.raw(element);

        expect(expected).toEqual('post');
    });

    it('raw() should return correct method name (form)', () => {
        let element = document.createElement('form');
        element.setAttribute('method', 'post');

        let dataMethod = new Attv.DataMethod();
        let expected = dataMethod.raw(element);

        expect(expected).toEqual('post');
    });

    it('raw() should return default method (get)', () => {
        let element = document.createElement('div');

        let dataMethod = new Attv.DataMethod();
        let expected = dataMethod.raw(element);

        expect(expected).toEqual('get');
    });
    
});