/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv (Test Usages) - js', () => {

    it('Should register an attribute (JS style. variant #1)', () => {
        let attribute;
        let counter = 0;

        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        // -- register
        Attv.register('data-attr', { isAutoLoad: true }, function (att) {
            attribute = att;
            att.map('default', function (value, element, options) {
                counter++;
            });
        });

        // -- load
        Attv.loadElements(element, { includeSelf: true });
        
        Attv.unregister(attribute);

        expect(counter).toBe(1);
    });
    
    it('Should register an attribute (JS style. variant #2)', () => {
        let attribute = new Attv.Attribute('data-attr');
        let counter = 0;

        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        // -- register
        Attv.register(function () { return attribute }, { isAutoLoad: true }, function (att) {
            attribute = att;
            att.map('default', function (value, element, options) {
                counter++;
            });
        });

        // -- load
        Attv.loadElements(element, { includeSelf: true });
        
        Attv.unregister(attribute);

        expect(counter).toBe(1);
    });
    
    it('Should register an attribute (JS style. variant #3)', () => {
        let attribute = new Attv.Attribute('data-attr');
        attribute.isAutoLoad = true;

        let counter = 0;

        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        // -- register
        Attv.register(function () { return attribute }, function (att) {
            attribute = att;
            att.map('default', function (value, element, options) {
                counter++;
            });
        });

        // -- load
        Attv.loadElements(element, { includeSelf: true });
        
        Attv.unregister(attribute);

        expect(counter).toBe(1);
    });


    // --- Attribute Value --- //

    it('Should map an attribute value (JS style. variant #1)', () => {
        let attribute;
        let counter = 0;

        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        // -- register
        Attv.register('data-attr', { isAutoLoad: true }, function (att) {
            attribute = att;
            att.map('default', function (value, element, options) {
                counter++;
            });
        });

        // -- load
        Attv.loadElements(element, { includeSelf: true });
        
        Attv.unregister(attribute);

        expect(counter).toBe(1);
    });

    it('Should map an attribute value (JS style. variant #2)', () => {
        let attribute;
        let counter = 0;

        let attributeValue = new Attv.AttributeValue('default', function () {
            counter++;
        });

        let element = document.createElement('div');
        element.setAttribute('data-attr', 'default');

        // -- register
        Attv.register('data-attr', { isAutoLoad: true }, function (att) {
            attribute = att;
            att.map(function () { return attributeValue });
        });

        // -- load
        Attv.loadElements(element, { includeSelf: true });
        
        Attv.unregister(attribute);

        expect(counter).toBe(1);
    });


    // --- Changing the attribute name --- //

    it('Should register an attribute with different name', () => {
        let attribute;
        let counter = 0;

        let element = document.createElement('div');
        element.setAttribute('data-different', 'default');

        // -- register
        Attv.register('data-attr', { isAutoLoad: true, attributeName: 'data-different' }, function (att) {
            attribute = att;
            att.map('default', function (value, element, options) {
                counter++;
            });
        });

        // -- load
        Attv.loadElements(element, { includeSelf: true });
        
        Attv.unregister(attribute);

        expect(counter).toBe(1);
    });

    it('Should change the attribute name of an existing attribute an attribute with different name', () => {
        let attribute;
        let counter = 0;

        let element = document.createElement('div');
        element.setAttribute('data-different', 'default');

        // -- register
        Attv.register('data-attr', { isAutoLoad: true }, function (att) {
            attribute = att;
            att.map('default', function (value, element, options) {
                counter++;
            });
        });

        // changing the attribute-name after data-attr has been registered
        Attv.register('data-attr', { attributeName: 'data-different' });

        // -- load
        Attv.loadElements(element, { includeSelf: true });
        
        Attv.unregister(attribute);

        expect(counter).toBe(1);
    });

});