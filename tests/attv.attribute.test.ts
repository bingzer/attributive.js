/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.Attribute', () => {
    
    it('Should exist', () => {
        expect(Attv.Attribute).toBeDefined();
    });

    it('Should create an instance Attv.Attribute', () => {
        let attribute = new Attv.Attribute('data-attr');
        expect(attribute).toBeInstanceOf(Attv.Attribute);
    });

    it('Should assign all variables properly', () => {
        let attribute = new Attv.Attribute('data-attr');

        expect(attribute.key).toBe('data-attr');
        expect(attribute.name).toBe('data-attr');
        expect(attribute.deps).toHaveSize(0);
        expect(attribute.loadedName()).toBe('data-attr-loaded');
        expect(attribute.settingsName()).toBe('data-attr-settings');
        expect(attribute.allowsWildcard()).toBe(true);
    });

    it('Should assign not allow wildcard', () => {
        let attribute = new Attv.Attribute('data-attr');
        attribute.wildcard = "none";

        expect(attribute.allowsWildcard()).toBe(false);
    });

    it('Should return false when it doesn\'t exist in the element', () => {
        let element = document.createElement('div');

        let attribute = new Attv.Attribute('data-attr');

        expect(attribute.exists(element)).toBeFalse();
    });

    it('Should return true when it exists in the element', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        let attribute = new Attv.Attribute('data-attr');

        expect(attribute.exists(element)).toBeTrue();
    });

    it('raw() should return the raw value', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        let attribute = new Attv.Attribute('data-attr');

        expect(attribute.raw(element)).toBe('default');
    });

    it('raw() should return the undefined when it\'s an empty string', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', '');

        let attribute = new Attv.Attribute('data-attr');

        expect(attribute.raw(element)).toBeUndefined();
    });

    it('raw() should return the undefined when it doesn\'t exist', () => {
        let element = document.createElement('div');

        let attribute = new Attv.Attribute('data-attr');

        expect(attribute.raw(element)).toBeUndefined();
    });

    it('raw() with context', () => {
        let element = document.createElement('div');
        element.setAttribute('data-context', '{ app: { name: "APP NAME" }}');
        element.setAttribute('data-attr', '${app.name}')

        let attribute = new Attv.Attribute('data-attr');

        let expected = attribute.raw(element);

        expect(expected).toEqual("APP NAME");
    });

    it('parseRaw() should return an object', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', '{}');

        let attribute = new Attv.Attribute('data-attr');

        let obj = attribute.parseRaw(element);
        expect(typeof obj).toBe('object');
    });

    it('parseRaw() should return an element <querySelector>', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'body');

        let attribute = new Attv.Attribute('data-attr');
        attribute.wildcard = "<querySelector>";

        let obj = attribute.parseRaw<HTMLElement>(element);
        expect(obj).toBeInstanceOf(HTMLBodyElement);
    });

    it('parseRaw() should return an object <jsExpression>', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'this');

        let attribute = new Attv.Attribute('data-attr');
        attribute.wildcard = "<jsExpression>";

        let obj = attribute.parseRaw<object>(element);
        expect(typeof obj).toBe('object');
    });

    it('getValue() should return AttributeValue', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        let attribute = new Attv.Attribute('data-attr');
        let value = attribute.getValue(element);

        expect(value).toBeInstanceOf(Attv.AttributeValue);
    });

    it('getValue() should not return AttributeValue', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        let attribute = new Attv.Attribute('data-attr');
        attribute.wildcard = "none";

        try
        {
            let value = attribute.getValue(element);
            fail();
        }
        catch (e) {
            // -- good
        }
    });

    it('getSettings() should return AttributeValue', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        let attribute = new Attv.Attribute('data-attr');
        let settings = attribute.getSettings(element);

        expect(settings).toBeUndefined();
    });

    it('getSettings() should return AttributeValue', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');
        element.setAttribute('data-attr-settings', '{}');

        let attribute = new Attv.Attribute('data-attr');
        let settings = attribute.getSettings(element);

        expect(settings).toBeDefined();
    });

    it('isLoaded() should return true', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');
        element.setAttribute('data-attr-loaded', '{}');

        let attribute = new Attv.Attribute('data-attr');
        let expected = attribute.isLoaded(element);

        expect(expected).toBeTrue();
    });

    it('isLoaded() should return false', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        let attribute = new Attv.Attribute('data-attr');
        let expected = attribute.isLoaded(element);

        expect(expected).toBeFalse();
    });

    it('markLoaded() should return true', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        let attribute = new Attv.Attribute('data-attr');
        let expected = attribute.markLoaded(element, true);

        expect(expected).toBeTrue();
    });

    it('markLoaded() should return false', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        let attribute = new Attv.Attribute('data-attr');
        let expected = attribute.markLoaded(element, false);

        expect(expected).toBeFalse();
    });

    it('map() an attribute value', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'strawberry');

        let attribute = new Attv.Attribute('data-attr');
        attribute.wildcard = "none";

        attribute.map('strawberry');
        
        let value = attribute.getValue(element);
        expect(value.value).toEqual('strawberry');
    });

    it('resolve() an attribute value', () => {
        let attribute = new Attv.Attribute('data-attr');

        Attv.register(() => attribute);
        Attv.Registrar.run();
        
        expect(attribute.resolve(attribute.key)).toBeDefined();

        Attv.unregister(attribute);
    });

    it('resolve() fails because no dependencies defined', () => {
        let attribute = new Attv.Attribute('data-attr');

        let attribute2 = new Attv.Attribute('data-attr2');
        
        try {
            attribute.resolve(attribute2.key);
            fail();
        } catch {
            // -- good
        }
    });

    it('resolveValue() fails because no dependencies defined', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        let attribute = new Attv.Attribute('data-attr');

        Attv.register(() => attribute);
        Attv.Registrar.run();

        let value = attribute.resolveValue(attribute.key, element);

        expect(value).toBeDefined();

        let index = Attv.attributes.indexOf(attribute);
        
        Attv.unregister(attribute);
    });

    it('toString() an attribute value', () => {
        let attribute = new Attv.Attribute('data-attr');
        
        expect(attribute.toString()).toEqual('[data-attr]');
    });

    it('selector() an attribute value', () => {
        let attribute = new Attv.Attribute('data-attr');
        
        expect(attribute.selector()).toEqual('[data-attr]');
    });
});