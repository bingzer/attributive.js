/// <reference path="../src/attv.ts" />
/// <reference path="../src/expressions.ts" />
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

describe("Attv.Expressions.ArrayExpression", () => {
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

describe("Attv.Expressions.getProperty()", () => {
    
    it('getProperty() should get property from global', () => {
        let property = Attv.Expressions.getProperty('this');

        expect(property).toBeDefined();
    });

    it('getProperty() should get property from model', () => {
        let context = { employee: { firstName: "ricky" } };

        let property = Attv.Expressions.getProperty('employee.firstName', context);

        expect(property).toEqual('ricky');
    });

    it('getProperty() should get property from model #2', () => {
        let context = { employee: { firstName: "ricky", data: { key: 'pad' } } };

        let property = Attv.Expressions.getProperty('employee.data.key', context);

        expect(property).toEqual('pad');
    });

    it('getProperty() should get property from model (boolean)', () => {
        let context = { employee: { firstName: "ricky", wantsCandy: true } };

        let property = Attv.Expressions.getProperty('employee.wantsCandy', context);

        expect(property).toEqual(true);
    });

    it('getProperty() should get property from model (number)', () => {
        let context = { employee: { firstName: "ricky", age: 280 } };

        let property = Attv.Expressions.getProperty('employee.age', context);

        expect(property).toEqual(280);
    });
});

describe("Attv.Expressions.setProperty", () => {


    it('setProperty() should get property (using model)', () => {
        let context = { employee: { firstName: "ricky", age: 280 } };

        Attv.Expressions.setProperty('employee.age', 30, context);

        expect(context.employee.age).toEqual(30);
    });

    it('setProperty() should get property (using model #2)', () => {
        let context = { employee: { firstName: "ricky", age: 280, data: { key: 'pad' } } };

        Attv.Expressions.setProperty('employee.data.key', 'board', context);

        expect(context.employee.data.key).toEqual("board");
    });
});

describe("Attv.Expressions.isGlobal", () => {

    it('isGlobal() should return true', () => {
        let global = Attv.globalThis$();
        global["foo"] = "bar";
        
        expect(Attv.Expressions.isGlobal("foo")).toBeTrue();

        delete global["foo"];
    });

    it('isGlobal() should return false', () => {
        let global = Attv.globalThis$();
        
        expect(Attv.Expressions.isGlobal("foo")).toBeFalse();

        delete global["foo"];
    });

    it('isGlobal() should return false (because it exists in the scoped object)', () => {
        let global = Attv.globalThis$();
        global["foo"] = "bar";

        let scopedObject = {
            foo: "bar"
        };
        
        expect(Attv.Expressions.isGlobal("foo", scopedObject)).toBeFalse();

        delete global["foo"];
    });
});



describe("Attv.Expressions.escapeQuote", () => {

    it('Should escape properly (variant #1)', () => {
        let expression = "${foo}";

        let expected = Attv.Expressions.escapeQuote(expression);

        expect(expected).toEqual("' + foo + '");
    });

    it('Should escape properly (variant #2)', () => {
        let expression = "`${foo}`";

        let expected = Attv.Expressions.escapeQuote(expression);

        expect(expected).toEqual("\\'' + foo + '\\'");
    });

    it('Should escape properly (variant #3)', () => {
        let expression = "`foo`";

        let expected = Attv.Expressions.escapeQuote(expression);

        expect(expected).toEqual("\\'foo\\'");
    });

    it('Should escape properly (variant #4)', () => {
        let expression = "foo";

        let expected = Attv.Expressions.escapeQuote(expression);

        expect(expected).toEqual("foo");
    });

    it('Should escape properly (variant #5)', () => {
        let expression = "'`${foo}`'";

        let expected = Attv.Expressions.escapeQuote(expression);

        expect(expected).toEqual("'\\'' + foo + '\\''");
    });

    it('Should escape properly (variant #6)', () => {
        let expression = "${foo";

        let expected = Attv.Expressions.escapeQuote(expression);

        expect(expected).toEqual("${foo");
    });

    it('Should escape properly (variant #7)', () => {
        let expression = "foo}";

        let expected = Attv.Expressions.escapeQuote(expression);

        expect(expected).toEqual("foo}");
    });

});


describe("Attv.Expressions.replaceVar", () => {

    it('Should replace properly (variant #1)', () => {
        let context = {
            app: {
                name: 'yolo'
            }
        }

        let expression = "${app.name}";

        let expected = Attv.Expressions.replaceVar(expression, context);

        expect(expected).toEqual("yolo");
    });

    it('Should not replace anything properly (variant #1)', () => {
        let context = {
            app: {
                name: 'yolo'
            }
        }

        let expression = "none";

        let expected = Attv.Expressions.replaceVar(expression, context);

        expect(expected).toEqual("none");
    });

});