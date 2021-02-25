/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-models/data-model.ts" />
// ------------------------------------------------- //

describe("Attv.DataModel", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataModel).toBeDefined();
        expect(Attv.DataModel.Value).toBeDefined();
    });

    it("should create an instance of DataModel", () => {
        let dataModel = new Attv.DataModel();

        expect(dataModel).toBeInstanceOf(Attv.Attribute);
        expect(dataModel.key).toEqual(Attv.DataModel.Key);
        expect(dataModel.wildcard).toEqual("<jsExpression>");
        expect(dataModel.priority).toEqual(0);
        expect(dataModel.isAutoLoad).toEqual(true);
        expect(dataModel.binders.length).toBeGreaterThan(0);
        expect(dataModel.deps.uses.length).toBeGreaterThan(0);
    });

    it("bindTo() should bind to an element", () => {
        let element = document.createElement('div');
        element.setAttribute('data-model', 'employee.firstName');

        let context = { employee: { firstName: "ricky" } };

        let options = { context: context };

        let dataModel = new Attv.DataModel();
        let expected = dataModel.bindTo(element, options);

        expect(expected).toEqual(true);
        expect(element.innerHTML).toBe('ricky');
    });

    it("bindTo() should bind to an element (with context id)", () => {
        let element = document.createElement('div');
        element.setAttribute('data-model', 'employee.firstName');

        let refId = "data-foreach-1";

        let context = { employee: { firstName: "ricky" } };

        let options = { context: context, contextId: refId };

        let dataModel = new Attv.DataModel();
        let expected = dataModel.bindTo(element, options);

        expect(expected).toEqual(true);
        expect(element.innerHTML).toBe('ricky');
    });


});

describe("Attv.DataModel.Value", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataModel.Value).toBeDefined();
    });

    it('Should create an instance', () => {
        let value = new Attv.DataModel.Value();

        expect(value).toBeInstanceOf(Attv.AttributeValue);
    });

    it('load() should loan an element', () => {
        let element = document.createElement('div');
        element.setAttribute('data-model', 'employee.firstName');

        let context = { employee: { firstName: "ricky" } };

        let options: Attv.LoadElementOptions = {
            context: context  
        };

        let dataModel = new Attv.DataModel();

        let value = new Attv.DataModel.Value();
        value.attribute = dataModel;
        value.load(element, options);
        
        expect(element.innerHTML).toBe('ricky');
    });

});