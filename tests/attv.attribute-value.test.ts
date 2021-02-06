/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.AttributeValue', () => {
    
    it('Should exist', () => {
        expect(Attv.AttributeValue).toBeDefined();
    });

    it('Should create an instance Attv.AttributeValue (with default tag)', () => {
        let attributeValue = new Attv.AttributeValue();
        
        expect(attributeValue.value).toEqual('default');
    });

    it('load() Should load (with loadFn)', () => {
        let counter = 0;

        let element = document.createElement('div');

        let fn = (value: Attv.AttributeValue, element: HTMLElement, options?: Attv.LoadElementOptions): Attv.BooleanOrVoid => {
            counter++;
            return true;   
        }

        let attributeValue = new Attv.AttributeValue('default', fn);
        let expected = attributeValue.load(element);
        
        expect(attributeValue.value).toEqual('default');
        expect(expected).toEqual(true);
        expect(counter).toEqual(1);
    });

    it('load() Should load an element', () => {
        let element = document.createElement('div');

        let attributeValue = new Attv.AttributeValue('default');
        attributeValue.load(element);
        let expected = attributeValue.load(element);
        
        expect(attributeValue.value).toEqual('default');
        expect(expected).toEqual(true);
    });

    it('toString()', () => {
        let attribute = new Attv.Attribute('data-attr');

        let attributeValue = new Attv.AttributeValue('default');
        attributeValue.attribute = attribute;
        
        expect(attributeValue.value).toEqual('default');
        expect(attributeValue.toString()).toEqual('[data-attr="default"]');
    });

    it('toString()', () => {
        let attribute = new Attv.Attribute('data-attr');
        attribute.wildcard = "*";

        let attributeValue = new Attv.AttributeValue();
        attributeValue.value = undefined;
        attributeValue.attribute = attribute;
        
        expect(attributeValue.toString()).toEqual('[data-attr="*"]');
    });
});