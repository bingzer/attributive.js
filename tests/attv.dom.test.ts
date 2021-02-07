/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.Dom', () => {
    
    it('Should exist', () => {
        expect(Attv.Dom).toBeDefined();
        expect(Attv.Dom.tags).toBeDefined();
        expect(Attv.Dom.getParentTag).toBeDefined();
        expect(Attv.Dom.parseDom).toBeDefined();
    });

    it('should parseDom() successfully <ul>', () => {
        let parentElement = Attv.Dom.parseDom(`
            <ul>
                <li></li>
            </ul>
        `);

        expect(parentElement.tagName.toLowerCase()).toEqual('div');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('ul');
    });

    it('should parseDom() successfully <div>', () => {
        let parentElement = Attv.Dom.parseDom(`<div></div>`);

        expect(parentElement.tagName.toLowerCase()).toEqual('div');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('div');
    });

    it('should parseDom() successfully <p>', () => {
        let parentElement = Attv.Dom.parseDom(`<p></p>`);

        expect(parentElement.tagName.toLowerCase()).toEqual('div');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('p');
    });

    it('should parseDom() successfully <li>', () => {
        let parentElement = Attv.Dom.parseDom(`
            <li></li>
        `);

        expect(parentElement.tagName.toLowerCase()).toEqual('ul');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('li');
    });
    
    it('should parseDom() successfully <td>', () => {
        let parentElement = Attv.Dom.parseDom(`
            <td></td>
        `);

        expect(parentElement.tagName.toLowerCase()).toEqual('tr');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('td');
    });
    
    it('should parseDom() successfully <th>', () => {
        let parentElement = Attv.Dom.parseDom(`
            <th></th>
        `);

        expect(parentElement.tagName.toLowerCase()).toEqual('tr');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('th');
    });
    
    it('should parseDom() successfully <tr>', () => {
        let parentElement = Attv.Dom.parseDom(`
            <tr></tr>
        `);

        expect(parentElement.tagName.toLowerCase()).toEqual('tbody');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('tr');
    });
    
    it('should parseDom() successfully <option>', () => {
        let parentElement = Attv.Dom.parseDom(`
            <option></option>
        `);

        expect(parentElement.tagName.toLowerCase()).toEqual('select');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('option');
    });
    
    it('should parseDom() successfully <thead> and <tbody>', () => {
        let parentElement = Attv.Dom.parseDom(`
            <thead></thead>
        `);

        expect(parentElement.tagName.toLowerCase()).toEqual('table');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('thead');
        
        parentElement = Attv.Dom.parseDom(`
            <tbody></tbody>
        `);

        expect(parentElement.tagName.toLowerCase()).toEqual('table');
        expect(parentElement.firstElementChild.tagName.toLowerCase()).toEqual('tbody');
    });
});