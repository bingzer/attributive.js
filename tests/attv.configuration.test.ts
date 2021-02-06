/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.Configuration', () => {
    
    it('Should exist', () => {
        expect(Attv.Configuration).toBeDefined();
    });

    it('Should create an instance', () => {
        let configuration = new Attv.Configuration();

        expect(configuration.isDebug).toEqual(true);
        expect(configuration.isVerboseLogging).toEqual(true);
        expect(configuration.defaultTag).toEqual('default');
        expect(configuration.logLevels.length).toBeGreaterThan(0);
    });
});