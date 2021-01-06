global.Attv = require('../src/attv').Attv;

// ------------------------------------------------- //

describe('Attv.Ajax', () => {
    it('Should have Attv.Ajax', () => {
        expect(Attv.Ajax).toBeTruthy();
        expect(Attv.Ajax.sendAjax).toBeTruthy();
        expect(Attv.Ajax.buildUrl).toBeTruthy();
        expect(Attv.Ajax.objectToQuerystring).toBeTruthy();
    });

    it('Should get the innerHtml from the element', () => {
        let xhr = new XMLHttpRequest();
        xhr.open = jest.fn();
        xhr.send = jest.fn();

        let ajaxOptions: Attv.Ajax.AjaxOptions = {
            url: '/api/',
            createHttpRequest: () => xhr as any
        };

        Attv.Ajax.sendAjax(ajaxOptions);

        expect(xhr.open).toHaveBeenCalledWith('get', '/api/', true);
        expect(xhr.send).toBeCalled();
    });

    it('Should build url correctly', () => {
        let ajaxOptions: Attv.Ajax.AjaxOptions = {
            url: '/api/'
        };

        expect(Attv.Ajax.buildUrl(ajaxOptions)).toEqual('/api/');
    });

    it('Should build url with parameters', () => {
        let ajaxOptions: Attv.Ajax.AjaxOptions = {
            url: '/api/',
            data: {
                "name": "value"
            }
        };

        expect(Attv.Ajax.buildUrl(ajaxOptions)).toEqual('/api/?name=value');
    });

    it('Should not build url and returns undefiend', () => {
        let ajaxOptions: Attv.Ajax.AjaxOptions = {
            url: undefined
        };

        expect(Attv.Ajax.buildUrl(ajaxOptions)).toBeUndefined();
    });

    it('Should construct query string from an object', () => {
        let obj = {
            name: 'value'
        };

        let actual = Attv.Ajax.objectToQuerystring(obj);
        expect(actual).toEqual('name=value');
    });

    it('Should construct query string from an object with multiple properties', () => {
        let obj = {
            name: 'value',
            name2: 100,
            name3: 'with space'
        };

        let actual = Attv.Ajax.objectToQuerystring(obj);
        expect(actual).toEqual('name=value&name2=100&name3=with%20space');
    });
});