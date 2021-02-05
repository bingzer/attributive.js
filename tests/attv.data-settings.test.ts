/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.DataSettings', () => {
    
    it('Should exist', () => {
        expect(Attv.DataSettings).toBeDefined();
    });

    it('Should return data-settings', () => {
        expect(Attv.DataSettings.Key).toEqual('data-settings');
    });

});