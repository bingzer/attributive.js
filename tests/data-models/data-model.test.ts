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

        let refId = undefined; // "data-foreach-1";

        let dataModel = new Attv.DataModel();
        let expected = dataModel.bindTo(element, context, refId);

        expect(expected).toEqual(true);
        expect(element.innerHTML).toBe('ricky');
    });

    it("bindTo() should bind to an element (with context ref id)", () => {
        let element = document.createElement('div');
        element.setAttribute('data-model', 'employee.firstName');

        let context = { employee: { firstName: "ricky" } };

        let refId = "data-foreach-1";

        let dataModel = new Attv.DataModel();
        let expected = dataModel.bindTo(element, context, refId);

        expect(expected).toEqual(true);
        expect(element.getAttribute('data-model-context')).toEqual(refId);
        expect(element.innerHTML).toBe('ricky');
    });

    it('getProperty() should get property from global', () => {
        let property = Attv.DataModel.getProperty('this');

        expect(property).toBeDefined();
    });

    it('getProperty() should get property from model', () => {
        let context = { employee: { firstName: "ricky" } };

        let property = Attv.DataModel.getProperty('employee.firstName', context);

        expect(property).toEqual('ricky');
    });

    it('getProperty() should get property from model #2', () => {
        let context = { employee: { firstName: "ricky", data: { key: 'pad' } } };

        let property = Attv.DataModel.getProperty('employee.data.key', context);

        expect(property).toEqual('pad');
    });

    it('getProperty() should get property from model (boolean)', () => {
        let context = { employee: { firstName: "ricky", wantsCandy: true } };

        let property = Attv.DataModel.getProperty('employee.wantsCandy', context);

        expect(property).toEqual(true);
    });

    it('getProperty() should get property from model (number)', () => {
        let context = { employee: { firstName: "ricky", age: 280 } };

        let property = Attv.DataModel.getProperty('employee.age', context);

        expect(property).toEqual(280);
    });

    it('setProperty() should get property (using model)', () => {
        let context = { employee: { firstName: "ricky", age: 280 } };

        Attv.DataModel.setProperty('employee.age', 30, context);

        expect(context.employee.age).toEqual(30);
    });

    it('setProperty() should get property (using model #2)', () => {
        let context = { employee: { firstName: "ricky", age: 280, data: { key: 'pad' } } };

        Attv.DataModel.setProperty('employee.data.key', 'board', context);

        expect(context.employee.data.key).toEqual("board");
    });

});

describe("Attv.DataModel.Value", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataModel.Value).toBeDefined();
        expect(Attv.DataModel.getProperty).toBeDefined();
        expect(Attv.DataModel.setProperty).toBeDefined();
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