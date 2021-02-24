/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.eval$() (with different variants of tests)', () => {

    it('Should return something', () => {
        expect(Attv.eval$('this')).toEqual({});  // empty object
    });
    
    it('Should returns truthy (with context)', () => {
        let employee = { firstName: 'ricky', data: { key: { pass: 'word' }} };

        let expected = Attv.eval$('firstName', employee);
        expect(expected).toEqual("ricky");

        expect(Attv.eval$('data.key.pass', employee)).toEqual('word');
    });

    it('Should returns truthy (with context). Undefined', () => {
        let employee = { firstName: 'ricky', data: { key: { pass: 'word' }} };

        expect(Attv.eval$('data.key.pass', employee)).toBeDefined();
        
        expect(Attv.eval$('data.key.pass', undefined)).toBeUndefined();
        expect(Attv.eval$('data.key.pass.five', {})).toBeUndefined();
    });

    it('Should returns truthy (with global context)', () => {
        expect(Attv.eval$('Attv.version')).toBeDefined();
        expect(Attv.eval$('Attv.versioned')).toBeUndefined();
    });

    it('Should return a string', () => {
        expect(Attv.eval$('"yolo"')).toBe("yolo");
    });

    
    it('TEST WITH ARG', () => {
        let employee = { 
            firstName: 'ricky', 
            data: { 
                key: { 
                    pass: 'word' 
                }
            },
            fn: function () {
                return this.firstName;
            }
        };
        let company = {
            name: 'Software Inc',
            say: function () {
                return this.name + " hello world";
            }
        };
        let location = {
            city: 'New York'
        };
        let fns = {
            combineAll: function (employee, company, location) {
                return employee.firstName + ' ' + company.name + ' ' + location.city;
            }
        };

        expect(Attv.eval$('this', employee, { company, location })).toEqual(employee);
        expect(Attv.eval$('this.firstName', employee, { company, location })).toEqual("ricky");
        expect(Attv.eval$('this.fn()', employee, { company, location })).toEqual("ricky");
        expect(Attv.eval$('firstName', employee, { company, location })).toEqual("ricky");
        expect(Attv.eval$('location.city', employee, { company, location })).toEqual("New York");
        expect(Attv.eval$('company.say()', employee, { company, location })).toEqual("Software Inc hello world");
        expect(Attv.eval$('fns.combineAll(this, company, location)', employee, { company, location, fns })).toEqual("ricky Software Inc New York");
    });

    it('TEST WITH ARG #2', () => {
        let employee = { 
            firstName: 'ricky', 
            data: { 
                key: { 
                    pass: 'word' 
                }
            },
            fn: function () {
                return this.firstName;
            }
        };
        let company = {
            name: 'Software Inc',
            say: function () {
                return this.name + " hello world";
            }
        };
        let location = {
            city: 'New York'
        };
        let fns = {
            combineAll: function (employee, company, location) {
                return employee.firstName + ' ' + company.name + ' ' + location.city;
            }
        };

        // make sure we're updating the actual variables
        expect(Attv.eval$('this', employee, { company, location })).toEqual(employee);
        expect(Attv.eval$('this.firstName = "John"', employee, { company, location })).toEqual("John");
        expect(employee.firstName).toEqual("John");
    });

    it('TEST WITH ARG #3', () => {
        let employee = { 
            firstName: 'ricky', 
            data: { 
                key: { 
                    pass: 'word' 
                }
            },
            fn: function () {
                return this.firstName;
            }
        };
        let company = {
            name: 'Software Inc',
            say: function () {
                return this.name + " hello world";
            }
        };
        let location = {
            city: 'New York'
        };
        let fns = {
            combineAll: function (employee, company, location) {
                return employee.firstName + ' ' + company.name + ' ' + location.city;
            }
        };

        // make sure we're updating the actual variables
        expect(Attv.eval$('this', employee, { company, location })).toEqual(employee);
        expect(Attv.eval$('location.city = "Los Angeles"', employee, { company, location })).toEqual("Los Angeles");
        expect(Attv.eval$('location', employee, { company, location })).toEqual(location);
        expect(Attv.eval$('location', employee, { company, location })).toBe(location);
        expect(Attv.eval$('this', employee, { company, location })).toEqual(employee);
        expect(Attv.eval$('this.data', employee, { company, location })).toEqual(employee.data);
    });
});