/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-models/expressions.ts" />
// ------------------------------------------------- //

describe("Attv.Expressions", () => {
    it('Should declared its global variables', () => {
        expect(Attv.Expressions).toBeDefined();
        expect(Attv.Expressions.ArrayExpression).toBeDefined();
        expect(Attv.Expressions.AliasExpression).toBeDefined();
    });

});

describe("Attv.Expressions.AliasExpression", () => {
    it('Should declared its global variables', () => {
        expect(Attv.Expressions.ArrayExpression).toBeDefined();
    });

    it('Should create an AliasExpression', () => {
        let expression = new Attv.Expressions.AliasExpression("employee as emp");

        expect(expression.alias).toEqual('emp');
        expect(expression.propertyName).toEqual('employee');
        expect(expression.expression).toEqual("employee as emp");
        expect(expression.filterFn).toBeDefined();
    });

    it('Should create an AliasExpression (not an expression)', () => {
        let expression = new Attv.Expressions.AliasExpression("employee");

        expect(expression.alias).toEqual('employee');
        expect(expression.propertyName).toEqual('employee');
        expect(expression.expression).toEqual("employee");
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
        let expression = new Attv.Expressions.AliasExpression("employee.firstName | toUpperCase as firstName");

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
        expect(Attv.Expressions.ArrayExpression).toBeDefined();
    });

    it('Should create an ArrayExpression', () => {
        let expression = new Attv.Expressions.ArrayExpression("emp in employees");

        expect(expression.itemName).toEqual('emp');
        expect(expression.propertyName).toEqual('employees');
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
        let expression = new Attv.Expressions.ArrayExpression("emp in employees");

        expect(expression.itemName).toEqual('emp');
        expect(expression.propertyName).toEqual('employees');
        expect(expression.expression).toEqual('emp in employees');

        let expected = expression.evaluate(context);
        expect(expected.length).toEqual(2);
    });

});