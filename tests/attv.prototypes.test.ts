/// <reference path="../src/attv.ts" />
/// <reference path="../src/prototypes.ts" />
// ------------------------------------------------- //

describe('Attv.Prototypes for HTMLElement', () => {
    
    it('Should exist', () => {
        expect(HTMLElement.prototype.attvHtml);
        expect(HTMLElement.prototype.attvAttr);
        expect(HTMLElement.prototype.attvShow);
        expect(HTMLElement.prototype.attvHide);
    });
    
    it('attvHtml() - Should get the innerHtml', () => {
        let element = document.createElement('div');
        element.innerHTML = '<strong>very strong</strong>';

        let expected = element.attvHtml();
        expect(expected).toBe('<strong>very strong</strong>');
    });
    
    it('attvHtml() - Should get the innerHtml on script type=text/javascript', () => {
        let element = document.createElement('script');
        element.type = 'text/javascript';
        element.innerHTML = '<strong>very strong</strong>';

        let expected = element.attvHtml();
        expect(expected).toBe('<strong>very strong</strong>');
    });
    
    it('attvHtml(text) - Should set the innerHtml', () => {
        let element = document.createElement('div');
        element.attvHtml('<strong>very strong</strong>');

        expect(element.innerHTML).toBe('<strong>very strong</strong>');
    });
    
    it('attvHtml(text) - Should set the innerHtml #2', () => {
        let element = document.createElement('span');
        element.attvHtml('<strong>very strong</strong>');

        expect(element.innerHTML).toBe('<strong>very strong</strong>');
    });
    
    it('attvShow() - Should show the element', () => {
        let element = document.createElement('span');
        element.style.display = "none";

        element.attvShow();

        expect(element.style.display).toBeFalsy();
    });
    
    it('attvShow() - Should keep showing the element', () => {
        let element = document.createElement('span');
        element.style.display = "block";

        element.attvShow();

        expect(element.style.display).toBeTruthy();
    });
    
    it('attvHide() - Should hide the element', () => {
        let element = document.createElement('span');

        expect(element.style.display).toBeFalsy();

        element.attvHide();

        expect(element.style.display).toEqual("none");
    });
    
    it('attvAttr(name, things) - Should returns the attribute', () => {
        let element = document.createElement('span');
        element.setAttribute('data-stuff', 'things');

        let expected = element.attvAttr('data-stuff');
        expect(expected).toEqual('things');
    });
    
    it('attvAttr(name) - Should set the attribute', () => {
        let element = document.createElement('span');
        element.attvAttr('data-stuff', 'things');

        let expected = element.attvAttr('data-stuff');
        expect(expected).toEqual('things');
    });
    
    it('attvAttr() - Should returns all the attribute as an object', () => {
        let element = document.createElement('span');
        element.attvAttr('data-stuff', 'things');

        let expected = element.attvAttr();
        expect(expected['data-stuff']).toEqual('things');
    });
});

describe('Attv.Prototypes for strings', () => {
    
    it('Should exist', () => {
        expect(String.prototype.contains);
        expect(String.prototype.equalsIgnoreCase);
        expect(String.prototype.camelCaseToDash);
        expect(String.prototype.dashToCamelCase);
        expect(String.prototype.underscoreToDash);
    });

    it('contains() should return true if there\'s a string inside', () => {
        expect("hello world".contains("world")).toBeTrue();
        expect("hello world".contains("hello world")).toBeTrue();
        expect("hello world".contains("mars")).toBeFalse();
    });

    it('contains() should return true if there\'s a string inside (case sensitive)', () => {
        expect("hello world".contains("World")).toBeFalse();
        expect("hello world".contains("hello worlD")).toBeFalse();
    });

    it('startsWith() should return true', () => {
        expect("hello world".startsWith("hello")).toBeTrue();
        expect("hello world".startsWith("hello world")).toBeTrue();
        expect("hello world".startsWith("world")).toBeFalse();
    });

    it('startsWith() should return true (case sensitive)', () => {
        expect("hello world".startsWith("Hello")).toBeFalse();
        expect("hello world".startsWith("Yolo")).toBeFalse();
    });

    it('endsWith() should return true', () => {
        expect("hello world".endsWith("world")).toBeTrue();
        expect("hello world".endsWith("hello world")).toBeTrue();
        expect("hello world".endsWith("hello")).toBeFalse();
    });

    it('endsWith() should return true (case sensitive)', () => {
        expect("hello world".endsWith("Hello")).toBeFalse();
        expect("hello world".endsWith("Yolo")).toBeFalse();
    });

    it('camelCaseToDash()', () => {
        expect("helloWorld".camelCaseToDash()).toEqual("hello-world");
        expect("-helloWorld".camelCaseToDash()).toEqual("-hello-world");
        expect("HelloWorld".camelCaseToDash()).toEqual("-hello-world");
    });

    it('camelCaseToDash() should insert - infront if it starts with uppercase or dash', () => {
        expect("-helloWorld".camelCaseToDash()).toEqual("-hello-world");
        expect("HelloWorld".camelCaseToDash()).toEqual("-hello-world");
    });

    it('dashToCamelCase()', () => {
        expect("hello-world".dashToCamelCase()).toEqual("helloWorld");
        expect("-hello-world".dashToCamelCase()).toEqual("HelloWorld");
    });

    it('dashToCamelCase() should have first uppercase if it starts with dash', () => {
        expect("-hello-world".dashToCamelCase()).toEqual("HelloWorld");
    });

    it('underscoreToDash()', () => {
        expect("hello_world".underscoreToDash()).toEqual("hello-world");
    });

    it('equalsIgnoreCase()', () => {
        expect("hellO World".equalsIgnoreCase("hello world")).toBeTrue();
        expect("HellO World".equalsIgnoreCase("Hello world")).toBeTrue();
    });

    it('equalsIgnoreCase() - returns false', () => {
        expect("hellO World".equalsIgnoreCase("hell0 world")).toBeFalse();
        expect("HellO World".equalsIgnoreCase("Hello22 world")).toBeFalse();
        expect("HellO World".equalsIgnoreCase("")).toBeFalse();
        expect("HellO World".equalsIgnoreCase(undefined)).toBeFalse();
    });
});