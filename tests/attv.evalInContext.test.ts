

/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.eval$()', () => {

    it('Should returns truthy (with context)', () => {
        let employee = { firstName: 'ricky' };

        let expected = Attv.eval$('firstName', employee);
        expect(expected).toEqual("ricky");
    });

    it('Should returns truthy (with context)', () => {
        let employee = { firstName: 'ricky', data: { key: { pass: 'word' }} };

        let expected = Attv.eval$('firstName', employee);
        expect(expected).toEqual("ricky");

        expect(Attv.eval$('data.key.pass', employee)).toEqual('word');
    });

    it('Should returns truthy (with global context)', () => {
        expect(Attv.eval$('Attv.version')).toBeDefined();
        expect(Attv.eval$('Attv.versioned')).toBeUndefined();
    });

});