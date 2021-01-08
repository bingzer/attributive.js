beforeEach(() => {
    expect(global.Attv).toBeFalsy();

    global.Attv = require('../src/attv').Attv;
});

afterEach(() => {
    global.Attv = undefined;
});

// ------------------------------------------------- //

describe('Attv.Attribute.Value', () => {
    it('Should have Attv global variables', () => {
        expect(Attv.Attribute.Value).toBeTruthy();
    });

    it('Should create Attv.Attribute.Value', () => {
        let att = new Attv.Attribute('uniqueId', true);
        att.name = 'data-attribute';

        let val = new Attv.Attribute.Value('value');
        val.attribute = att;

        expect(val.attribute).toBe(att);
        expect(val.validators.length).toBe(0);
        expect(val.resolver).toBeDefined();
        expect(val.settings).toBeUndefined();
    });

    it('Should return the raw value', () => {
        let elem = document.createElement('div');
        elem.setAttribute('data-attribute', 'some-value');

        let att = new Attv.Attribute('uniqueId', true);
        att.name = 'data-attribute';

        let val = new Attv.Attribute.Value();
        val.attribute = att;

        let expected = val.raw(elem);

        expect(expected).toEqual('some-value');
    });

    it('Should return the raw value when assigned value is undfeiend', () => {
        let elem = document.createElement('div');
        elem.setAttribute('data-attribute', 'some-value-custom');
        
        let att = new Attv.Attribute('uniqueId', true);
        att.name = 'data-attribute';

        let val = new Attv.Attribute.Value();
        val.attribute = att;

        let expected = val.raw(elem);

        expect(expected).toEqual('some-value-custom');
    });

    it('Should always return true by default', () => {
        let elem = document.createElement('div');
        elem.setAttribute('data-attribute', 'some-value');
        
        let att = new Attv.Attribute('uniqueId', true);
        att.name = 'data-attribute';

        let val = new Attv.Attribute.Value('value');
        val.attribute = att;

        let expected = val.load(elem);

        expect(expected).toEqual(true);
    });

    it('Should load settings', () => {
        let event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        document.dispatchEvent(event);

        Attv.configuration = new Attv.DefaultConfiguration();

        let elem = document.createElement('div');
        elem.setAttribute('data-attribute', 'some-value');
        
        let att = new Attv.Attribute('uniqueId', true);
        att.name = 'data-attribute';

        let val = new Attv.Attribute.Value('value');
        val.attribute = att;

        let expected = val.loadSettings(elem, settings => {
            expect(settings).toBeDefined();
        });

        expect(expected).toBe(true);
    });

    it('Should print the string representation', () => {        
        let att = new Attv.Attribute('uniqueId', true);
        att.name = 'data-attribute';

        let val = new Attv.Attribute.Value('some-value');
        val.attribute = att;

        let expected = val.toString();

        expect(expected).toBe('[data-attribute]=some-value');
    });

    it('Should print the string representation (pretty print - no assigned value)', () => {        
        let att = new Attv.Attribute('uniqueId', true);
        att.name = 'data-attribute';

        let val = new Attv.Attribute.Value();
        val.attribute = att;

        let expected = val.toString(true);

        expect(expected).toBe("[data-attribute]='*'");
    });
});
