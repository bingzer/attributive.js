// ------------------------------------------------- //

describe('Attv constants and global vars', () => {
    it('Should have Attv global variables', () => {
        expect(ATTV_DEBUG).toBeDefined();
        expect(ATTV_VERBOSE_LOGGING).toBeDefined();
        expect(ATTV_VERSION).toBeDefined();

        expect(Attv).toBeDefined();
        expect(Attv.version).toBeDefined();
    })
});