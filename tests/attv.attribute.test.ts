beforeEach(() => {
    expect(global.Attv).toBeFalsy();

    global.Attv = require('../src/attv').Attv;
});

afterEach(() => {
    global.Attv = undefined;
});

// ------------------------------------------------- //

describe('Attv.Attribute', () => {
    it('Should have Attv.Attribute type', () => {
        expect(Attv.Attribute).toBeDefined();
    });

});
