global.Attv = require('../src/attv').Attv;

// ------------------------------------------------- //

describe('Element.prototypes', () => {
    it('Should have all required Element prototypes', () => {
        expect(Element.prototype.attvHtml).toBeTruthy();
    });

    it('Should get the innerHtml from the element', () => {
        let element: Element = document.createElement('div');
        element.innerHTML = '<p>HelloWorld</p>'

        expect(element.attvHtml()).toBe('<p>HelloWorld</p>');
    });

    it('Should set the innerHtml', () => {
        let element: Element = document.createElement('div');
        expect(element.attvHtml()).toBe(''); // still empty

        element.attvHtml('<p>Setting HelloWorld</p>');

        expect(element.attvHtml()).toBe('<p>Setting HelloWorld</p>');
    });
});

describe('HtmlElement.prototypes', () => {
    it('Should have all required HTMLElement prototypes', () => {
        expect(HTMLElement.prototype.attvShow).toBeTruthy();
        expect(HTMLElement.prototype.attvHide).toBeTruthy();
        expect(HTMLElement.prototype.attvAttr).toBeTruthy();
    });

    it('Should show the element (block)', () => {
        let element: HTMLElement = document.createElement('div');
        element.attvShow();

        expect(element.style.display).toBe('block');
    });

    it('Should show the element (inline-block)', () => {
        let element: HTMLElement = document.createElement('div');
        element.style.display = 'inline-block';
        element.attvHide();  // hide first

        element.attvShow();  // then show

        expect(element.style.display).toBe('inline-block');
    });

    it('Should hide the element', () => {
        let element: HTMLElement = document.createElement('div');
        element.attvHide();

        expect(element.style.display).toBe('none');
    });

    it('Should get attribute value (built-in attribute)', () => {
        let element: HTMLElement = document.createElement('div');
        element.style.border = '1px solid black';

        let received = element.attvAttr('style');
        expect(received).toBe('border: 1px solid black;');
    });

    it('Should get attribute value (data attribute - boolean)', () => {
        let element: HTMLElement = document.createElement('div');
        element.setAttribute('data-boolean', 'true');

        let received = element.attvAttr('data-boolean');
        expect(received).toBe(true);
    });

    it('Should get attribute value (data attribute - number)', () => {
        let element: HTMLElement = document.createElement('div');
        element.setAttribute('data-number', '100');

        let received = element.attvAttr('data-number');
        expect(received).toBe(100);
    });

    it('Should get attribute value (data attribute - json)', () => {
        let element: HTMLElement = document.createElement('div');
        element.setAttribute('data-json', '{ key: "some-value"}');

        let received = element.attvAttr('data-json');
        expect(received.key).toBe("some-value");
    });

    it('Should get all attributes', () => {
        let element: HTMLElement = document.createElement('div');
        element.setAttribute('data-json', '{ key: "some-value"}');
        element.style.border = '1px solid black';

        let received = element.attvAttr();
        console.log(received);
        expect(received['data-json']).toBeTruthy();
        expect(received.style).toBeTruthy();
    });

    it('Should set attribute value', () => {
        let element: HTMLElement = document.createElement('div');
        element.attvAttr('data-json', '{ key: "some-value"}');
        
        let received = element.attvAttr('data-json');
        expect(received).toBeTruthy();
    });
});