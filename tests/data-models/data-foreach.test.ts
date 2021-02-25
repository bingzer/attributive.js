/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-models/data-foreach.ts" />
// ------------------------------------------------- //

describe("Attv.DataForEach", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataForEach).toBeDefined();
        expect(Attv.DataForEach.Key).toBeDefined();
    });

    it('Attv should have [data-callback] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataForEach.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.wildcard).toEqual("*");
        expect(attribute.isAutoLoad).toEqual(true);
    });

});


describe("Attv.DataForEach.Default", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataForEach.Default).toBeDefined();
    });

    it('Should create an instance', () => {
        let value = new Attv.DataForEach.Default();

        expect(value).toBeInstanceOf(Attv.AttributeValue);
    });

    it('load() should load data-foreach', () => {
        let context = {
            employees: [ {  firstName: 'John', lastName: 'Doe' } ]
        };

        let html = `
            <div data-foreach="emp in employees">
                <span data-model="emp.firstName"></span>
            </div>
        `;

        let dom = Attv.Dom.parseDom(html);
        let element = dom.querySelector('[data-foreach]') as HTMLElement;

        let attribute = new Attv.Attribute('data-foreach');

        let value = new Attv.DataForEach.Default();
        attribute.map(() => value);
        
        value.load(element, { context: context });

        let dataId = element.getAttribute('data-context-id');

        let parentElement = element.parentElement;
        expect(parentElement.querySelector('[data-context-ref=' + dataId + ']')).toBeInstanceOf(HTMLElement);
    });

});