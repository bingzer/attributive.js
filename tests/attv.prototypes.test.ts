const g = require('../src/attv')
global.Attv = g.Attv;

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

    it('Should show the element', () => {
        let element: HTMLElement = document.createElement('div');
        element.attvShow();

        expect(element.style.display).toBe('block');
    });
});