/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.Registrar', () => {
    
    it('Should exist', () => {
        expect(Attv.Registrar).toBeDefined();
        expect(Attv.Registrar.run).toBeDefined();
        expect(Attv.Registrar.registerAttribute).toBeDefined();
    });
});