beforeEach(() => {
    expect(global.Attv).toBeFalsy();

    global.Attv = require('../src/attv').Attv;
});

afterEach(() => {
    global.Attv = undefined;
});

// ------------------------------------------------- //
