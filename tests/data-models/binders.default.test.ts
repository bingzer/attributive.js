/// <reference path="../../src/attv.ts" />
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

    it('accept() should always return true', () => {
        let dataModel = new Attv.DataModel();

        let element = document.createElement('div');

        let binder = new Attv.Binders.Default();

        let expected = binder.accept(dataModel, element);

        expect(expected).toEqual(true);
    });

    it('bind() should bind model to div innerHtml', () => {
        let context = {
            employee: { firstName: 'Ricky' }
        };

        let dataModel = new Attv.DataModel();

        let element = document.createElement('div');

        let binder = new Attv.Binders.Default();

        let expression = new Attv.Binders.AliasExpression("employee.firstName");

        binder.bind(dataModel, element, expression, context);

        expect(element.innerHTML).toEqual('Ricky');
    });

    it('bind() should bind empty string when expression evalue to undefined', () => {
        let context = {
            employee: { firstName: 'Ricky' }
        };

        let dataModel = new Attv.DataModel();

        let element = document.createElement('div');

        let binder = new Attv.Binders.Default();

        let expression = new Attv.Binders.AliasExpression("employee.nickname");

        binder.bind(dataModel, element, expression, context);

        expect(element.innerHTML).toEqual('');
    });
    
});