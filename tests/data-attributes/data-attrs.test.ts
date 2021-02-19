/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-attrs.ts" />
// ------------------------------------------------- //

describe("Attv.DataAttrs", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataAttrs).toBeDefined();
        expect(Attv.DataAttrs.Key).toBeDefined();
    });

    it('Attv should have [data-active] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataAttrs.Key);

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.isAutoLoad).toEqual(true);
        expect(attribute.wildcard).toEqual("<json>");
    });

});

describe("Attv.DataAttrs.Default", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataAttrs).toBeDefined();
        expect(Attv.DataAttrs.Default).toBeDefined();
    });

    it('Should create an instance', () => {
        let attribute = Attv.getAttribute(Attv.DataAttrs.Key);

        let value = new Attv.DataAttrs.Default();
        value.attribute = attribute;
        
        expect(value).toBeInstanceOf(Attv.AttributeValue);
    });

    it('load() should load an alement', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attrs', '{ title: "hello this is the title" }');

        let attribute = Attv.getAttribute(Attv.DataAttrs.Key);

        let value = new Attv.DataAttrs.Default();
        value.attribute = attribute;
        
        value.load(element);

        expect(element.getAttribute('title')).toEqual("hello this is the title");
    });

    it('load() change underscore with dash', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attrs', '{ data_name: "hello this is from data_name" }');

        let attribute = Attv.getAttribute(Attv.DataAttrs.Key);

        let value = new Attv.DataAttrs.Default();
        value.attribute = attribute;
        
        value.load(element);

        expect(element.getAttribute('data-name')).toEqual("hello this is from data_name");
    });

    it('load() should ignore data_attrs (to prevent recursive)', () => {
        let element = document.createElement('div');
        element.setAttribute('data-attrs', '{ data_attrs: "{ name: \"\" }" }');

        let attribute = Attv.getAttribute(Attv.DataAttrs.Key);

        let value = new Attv.DataAttrs.Default();
        value.attribute = attribute;
        
        value.load(element);

        expect(element.getAttribute('data-attrs')).toEqual('{ data_attrs: "{ name: \"\" }" }');
    });

    it('load() should load an alement (with context)', () => {
        let context = { firstName: 'ricky' };

        let element = document.createElement('div');
        element.setAttribute('data-attrs', '{ title: "Your name is " + firstName }');

        let attribute = Attv.getAttribute(Attv.DataAttrs.Key);

        let value = new Attv.DataAttrs.Default();
        value.attribute = attribute;
        
        value.load(element, { context: context });

        expect(element.getAttribute('title')).toEqual("Your name is ricky");
    });

    it('load() should load an alement (with disabled tag = true)', () => {
        let context = { firstName: 'ricky' };

        let element = document.createElement('div');
        element.setAttribute('data-attrs', '{ disabled: true }');

        let attribute = Attv.getAttribute(Attv.DataAttrs.Key);

        let value = new Attv.DataAttrs.Default();
        value.attribute = attribute;
        
        value.load(element, { context: context });

        expect(element.hasAttribute('disabled')).toBeTrue();
    });

    it('load() should load an alement (with disabled tag = false)', () => {
        let context = { firstName: 'ricky' };

        let element = document.createElement('div');
        element.setAttribute('data-attrs', '{ disabled: false }');

        let attribute = Attv.getAttribute(Attv.DataAttrs.Key);

        let value = new Attv.DataAttrs.Default();
        value.attribute = attribute;
        
        value.load(element, { context: context });

        expect(element.hasAttribute('disabled')).toBeFalse();
    });

});