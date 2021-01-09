beforeEach(() => {
    expect(global.Attv).toBeFalsy();

    let g = require('../src/attv');

    global.Attv = g.Attv;
    global['ATTV_DEBUG'] = g.ATTV_DEBUG;
    global['ATTV_VERBOSE_LOGGING'] = g.ATTV_VERBOSE_LOGGING;
});

afterEach(() => {
    global.Attv = undefined;
    global['ATTV_DEBUG'] = undefined;
    global['ATTV_VERBOSE_LOGGING'] = undefined;
});

// ------------------------------------------------- //

// ------------------------------------------------- //

describe('Attv constants and global vars', () => {
    it('Should have Attv global variables', () => {
        expect(ATTV_DEBUG).toBeTruthy();
        expect(ATTV_VERBOSE_LOGGING).toBeTruthy();

        expect(Attv).toBeDefined();
        expect(Attv.version).toBeDefined();
    })
});


Attv.register('data-write-hello-world', { isAutoLoad: true }, (attribute) => {
    attribute.map('default', (value, element) => {
        element.innerHTML = 'hello. this is from default' + value.raw(element);
    });
    attribute.map('another', (value, element) => {
        element.innerHTML = 'hello. this is from another';
        element.style.border = '1px solid gray';

        value.
    });

    let val = new Attv.Attribute.Value('defin');

    attribute.map(att => val);

})