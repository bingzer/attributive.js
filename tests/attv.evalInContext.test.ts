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

});