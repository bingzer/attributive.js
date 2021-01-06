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
});
