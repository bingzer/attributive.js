const g = require('../src/attv')
global.Attv = g.Attv;

// ------------------------------------------------- //

describe('Attv constants and global vars', () => {
    it('Should have Attv global variables', () => {
        expect(g.ATTV_DEBUG).toBeTruthy();
        expect(g.ATTV_VERBOSE_LOGGING).toBeTruthy();

        expect(Attv).toBeDefined();
        expect(Attv.version).toBeDefined();
    })
});
