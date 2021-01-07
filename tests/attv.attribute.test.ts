global.Attv = require('../src/attv').Attv;

// ------------------------------------------------- //

describe('Attv.Attributes', () => {
    it('Should have Attv.Attribute type', () => {
        expect(Attv.Attribute).toBeDefined();
    });

    it('Should create Attv.Attribute', () => {
        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);

        expect(att).toBeTruthy();
        expect(att.name).toBe('data-attribute');
        expect(att.uniqueId).toBe('uniqueId');
        expect(att.isAutoLoad).toBeTruthy();
    });

    it('Should create Attv.Attribute (isAutoLoad = false)', () => {
        let att = new Attv.Attribute('uniqueId', 'data-attribute', false);

        expect(att).toBeTruthy();
        expect(att.name).toBe('data-attribute');
        expect(att.uniqueId).toBe('uniqueId');
        expect(att.isAutoLoad).toBeFalsy();
    });

    it('Should assign default properties', () => {
        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);

        expect(att.priority).toBe(1);
        expect(att.values.length).toBe(0);
        expect(att.loadedName).toBe('data-attribute-loaded');
        expect(att.settingsName).toBe('data-attribute-settings');
        expect(att.wildcard).toBe('*');
        expect(att.isStrict).toBeFalsy();
        expect(att.dependency.internals.indexOf(Attv.DataSettings.UniqueId) > -1).toBeTruthy();
    });

    it('Should not be strict', () => {
        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);
        expect(att.isStrict);
    });

    it('Should be strict', () => {
        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);
        att.wildcard = 'none';

        expect(att.isStrict);
    });

    it('Should register an attribute value', () => {
        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);
        let val = new Attv.Attribute.Value('value', att);

        att.registerAttributeValues([val]);

        expect(att.values.length).toBe(1);
        expect(att.values.indexOf(val)).toBeGreaterThan(-1);
    });

    it('Should register an attribute value and add the attribute dependencies to its resolver', () => {
        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);
        att.dependency.internals.push('internal-dep');
        att.dependency.uses.push('use-dep');
        att.dependency.requires.push('require-dep');

        let val = new Attv.Attribute.Value('value', att);

        att.registerAttributeValues([val]);

        expect(att.values.length).toBe(1);
        expect(att.values.indexOf(val)).toBe(0);

        expect(val.resolver.internals.indexOf('internal-dep')).toBeGreaterThan(-1);
        expect(val.resolver.uses.indexOf('use-dep')).toBeGreaterThan(-1);
        expect(val.resolver.requires.indexOf('require-dep')).toBeGreaterThan(-1);
    });

    it('Should return true when an element has this attribute', () => {
        let elem = document.createElement('div');
        elem.setAttribute('data-attribute', 'some-value');

        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);

        expect(att.exists(elem)).toBeTruthy();
    });

    it('Should return false when an element does not have this attribute', () => {
        let elem = document.createElement('div');

        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);

        expect(att.exists(elem)).toBeFalsy();
    });
});
