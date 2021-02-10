/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-models/binders.expressions.ts" />
// ------------------------------------------------- //

describe("Attv.Binders", () => {
    it('Should declared its global variables', () => {
        expect(Attv.Binders).toBeDefined();
        expect(Attv.Binders.ArrayExpression).toBeDefined();
        expect(Attv.Binders.AliasExpression).toBeDefined();
    });

});

describe("Attv.Binders.AliasExpression", () => {
    it('Should declared its global variables', () => {
        expect(Attv.Binders.ArrayExpression).toBeDefined();
    });

    it('Should create an AliasExpression', () => {
        let expression = new Attv.Binders.AliasExpression("employee as emp");

        expect(expression.alias).toEqual('emp');
        expect(expression.propertyName).toEqual('employee');
        expect(expression.filterFn).toBeDefined();
    });

    it('Should create an AliasExpression', () => {
        let context = {
            employee: {
                firstName: 'John',
                lastName: 'Doe'
            },
            toUpperCase: (any: string) => {
                return any.toUpperCase();
            }
        };
        let expression = new Attv.Binders.AliasExpression("employee.firstName | toUpperCase as firstName");

        expect(expression.alias).toEqual('firstName');
        expect(expression.propertyName).toEqual('employee.firstName');
        expect(expression.filterFn).toBeDefined();

        let value = expression.evaluate(context);

        expect(value.value).toEqual('John');
        expect(value.filtered).toEqual('JOHN');
    });

});

describe("Attv.Binders.ArrayExpression", () => {
    it('Should declared its global variables', () => {
        expect(Attv.Binders.ArrayExpression).toBeDefined();
    });

    it('Should create an ArrayExpression', () => {
        let expression = new Attv.Binders.ArrayExpression("emp in employees");

        expect(expression.propertyName).toEqual('emp');
        expect(expression.arrayName).toEqual('employees');
        expect(expression.expression).toEqual('emp in employees');
    });

    it('Should create an ArrayExpression', () => {        
        let context = {
            employees: [{
                firstName: 'John',
                lastName: 'Doe'
            },
            {
                firstName: 'Jane',
                lastName: 'Doe'
            }]
        };
        let expression = new Attv.Binders.ArrayExpression("emp in employees");

        expect(expression.propertyName).toEqual('emp');
        expect(expression.arrayName).toEqual('employees');
        expect(expression.expression).toEqual('emp in employees');

        let expected = expression.evaluate(context);
        expect(expected.length).toEqual(2);
    });

});