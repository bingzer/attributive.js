/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.Validators', () => {
    
    it('Should exist', () => {
        expect(Attv.Validators).toBeDefined();
        expect(Attv.Validators.registerValidator).toBeDefined();
    });
    
    it('Should have existing validators', () => {
        expect(Attv.Validators.NeedAttrKeys).toBeDefined();
        expect(Attv.Validators.NeedAttrWithValue).toBeDefined();
        expect(Attv.Validators.NeedElements).toBeDefined();
    });
});