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

    it('Should create an instance with all default values', () => {
        let att = new Attv.Attribute('data-attribute');
        
        expect(att.name).toEqual(att.key);
        expect(att.values).toBeDefined();
        expect(att.dependency).toBeDefined();
        expect(att.dependency.internals.indexOf(Attv.DataSettings.Key)).toBeGreaterThan(-1);
        expect(att.wildcard).toEqual('*');
        expect(att.isAutoLoad).toEqual(false);
        expect(att.loadedName()).toEqual('data-attribute-loaded');
        expect(att.settingsName()).toEqual('data-attribute-settings');
    });

    it('Should allow wildcards', () => {
        let att = new Attv.Attribute('data-attribute');
        att.wildcard = "*";
        
        expect(att.allowsWildcard()).toEqual(true);
    });

    it('Should not allow wildcards', () => {
        let att = new Attv.Attribute('data-attribute');
        att.wildcard = "none";
        
        expect(att.allowsWildcard()).toEqual(false);
    });

    it('Should return true when the attribute exists in the element', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attribute', 'something');

        let att = new Attv.Attribute('data-attribute');
        
        expect(att.exists(element)).toBeTruthy();
    });

    it('Should return false when the attribute does not exist in the element', () => {
        let element = document.createElement('div');

        let att = new Attv.Attribute('data-attribute');
        
        expect(att.exists(element)).toBeFalsy();
    });

    it('Should return the raw string value', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attribute', 'something');

        let att = new Attv.Attribute('data-attribute');
        
        expect(att.raw(element)).toEqual('something');
    });

    it('Should return undefined as the raw string', () => {
        let element = document.createElement('div');

        let att = new Attv.Attribute('data-attribute');
        
        expect(att.raw(element)).toBeFalsy();
    });

    it('Should return an empty string when the value is an empty string', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attribute', '');

        let att = new Attv.Attribute('data-attribute');
        
        expect(att.raw(element)).toBeFalsy();
    });
    
});
