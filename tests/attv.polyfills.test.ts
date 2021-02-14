/// <reference path="../src/attv.ts" />
/// <reference path="../src/prototypes.ts" />
// ------------------------------------------------- //

describe('Attv.Polyfilles', () => {
    
    it('Should exist (NodeList)', () => {
        expect(NodeList.prototype.forEach).toBeDefined();
    });
    
    it('Should exist (Element)', () => {
        expect(Element.prototype.matches).toBeDefined();
        expect(Element.prototype.append).toBeDefined();
        expect(Element.prototype.remove).toBeDefined();
    });
    
    it('Should exist (HTMLSelectElement)', () => {
        let descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedOptions');

        expect(descriptor).toBeDefined();
    });
    
    it('Should exist (CustomEvent)', () => {
        expect(window.CustomEvent).toBeDefined();
    });
});