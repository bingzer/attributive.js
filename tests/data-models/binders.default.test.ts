/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/expressions.ts" />
/// <reference path="../../src/data-models/binders.ts" />
// ------------------------------------------------- //

describe('Attv.Binders', () => {
    
    it('Should exist', () => {
        expect(Attv.Binders).toBeDefined();
        expect(Attv.Binders.Binder).toBeDefined();
    });

});

describe('Attv.Binders.OneWayBinder', () => {
    
    it('Should exist', () => {
        expect(Attv.Binders.OneWayBinder).toBeDefined();
    });
    
});

describe('Attv.Binders.Default', () => {
    
    it('Should exist', () => {
        expect(Attv.Binders.Default).toBeDefined();
    });

    it('constructor()', () => {
        let binder = new Attv.Binders.Default();

        expect(binder).toBeInstanceOf(Attv.Binders.OneWayBinder);
    });

    it('accept() should always return true as long as the contextId is not specified', () => {
        let dataModel = new Attv.DataModel();

        let element = document.createElement('div');

        let binder = new Attv.Binders.Default();

        let expected = binder.accept(dataModel, element);

        expect(expected).toEqual(true);
    });

    it('accept() should return true (same context id)', () => {
        let dataModel = new Attv.DataModel();

        let element = document.createElement('div');
        element.setAttribute('data-context-ref', 'binder-1');

        let binder = new Attv.Binders.Default();

        let options = {
            contextId: 'binder-1'
        };

        let expected = binder.accept(dataModel, element, options);

        expect(expected).toEqual(true);
    });

    it('accept() should return false (different context id)', () => {
        let dataModel = new Attv.DataModel();

        let element = document.createElement('div');
        element.setAttribute('data-context-ref', 'binder-1');

        let binder = new Attv.Binders.Default();

        let options = {
            contextId: 'binder-2'
        };

        let expected = binder.accept(dataModel, element, options);

        expect(expected).toEqual(false);
    });

    it('bind() should bind model to div innerHtml', () => {
        let context = {
            employee: { firstName: 'Ricky' }
        };

        let dataModel = new Attv.DataModel();

        let element = document.createElement('div');

        let binder = new Attv.Binders.Default();

        let options = { context };

        let expression = new Attv.Expressions.AliasExpression("employee.firstName");

        binder.bind(dataModel, element, expression, options);

        expect(element.innerHTML).toEqual('Ricky');
    });

    it('bind() should bind empty string when expression evalue to undefined', () => {
        let context = {
            employee: { firstName: 'Ricky' }
        };

        let dataModel = new Attv.DataModel();

        let element = document.createElement('div');

        let binder = new Attv.Binders.Default();

        let options = { context };

        let expression = new Attv.Expressions.AliasExpression("employee.nickname");

        binder.bind(dataModel, element, expression, options);

        expect(element.innerHTML).toEqual('');
    });
    
});