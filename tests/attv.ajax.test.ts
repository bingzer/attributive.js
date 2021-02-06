/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv.Ajax', () => {
    
    it('Should exist', () => {
        expect(Attv.Ajax).toBeDefined();
        expect(Attv.Ajax.sendAjax).toBeDefined();
        expect(Attv.Ajax.buildUrl).toBeDefined();
        expect(Attv.Ajax.objectToQuerystring).toBeDefined();
    });

    it('buildUrl() should build Url based on the options provider', () => {
        let opt: Attv.Ajax.AjaxOptions = {
            url: "https://github.com"
        };

        let expected = Attv.Ajax.buildUrl(opt);
        
        expect(expected).toBe("https://github.com");
    });

    it('buildUrl() should build Url based on the options provider #2', () => {
        let opt: Attv.Ajax.AjaxOptions = {
            url: "https://github.com",
            data: {
                name: "value"
            }
        };

        let expected = Attv.Ajax.buildUrl(opt);
        
        expect(expected).toBe("https://github.com?name=value");
    });

    it('buildUrl() should build Url based on the options provider #3', () => {
        let opt: Attv.Ajax.AjaxOptions = {
            url: "https://github.com",
            data: {
                name: "value",
                eat: 1,
                bool: true
            }
        };

        let expected = Attv.Ajax.buildUrl(opt);
        
        // maynot be in order so
        // let's just check they exists in the string
        expect(expected.indexOf('name=value')).toBeGreaterThan(-1);
        expect(expected.indexOf('eat=1')).toBeGreaterThan(-1);
        expect(expected.indexOf('bool=true')).toBeGreaterThan(-1);
    });

    it('objectToQuerystring() should build correct query string', () => {
        let any = {
            name: "value",
            eat: 1,
            bool: true
        };

        let expected = Attv.Ajax.objectToQuerystring(any);
        
        // maynot be in order so
        // let's just check they exists in the string
        expect(expected.indexOf('name=value')).toBeGreaterThan(-1);
        expect(expected.indexOf('eat=1')).toBeGreaterThan(-1);
        expect(expected.indexOf('bool=true')).toBeGreaterThan(-1);
    });

    it('sendAjax() should send ajax', () => {
        var xhr: XMLHttpRequest = {
            send: jasmine.createSpy('send'),
            open: jasmine.createSpy('open')
        } as unknown as XMLHttpRequest;
    

        let opt: Attv.Ajax.AjaxOptions = {
            url: "https://github.com",
            createHttpRequest: () => xhr
        };

        Attv.Ajax.sendAjax(opt);

        expect(xhr.open).toHaveBeenCalledWith("get", "https://github.com", true);
        expect(xhr.send).toHaveBeenCalled();
    });

    it('sendAjax() should send ajax #2', () => {
        var xhr: XMLHttpRequest = {
            send: jasmine.createSpy('send'),
            open: jasmine.createSpy('open')
        } as unknown as XMLHttpRequest;
    

        let opt: Attv.Ajax.AjaxOptions = {
            url: "https://github.com",
            method: "post",
            createHttpRequest: () => xhr
        };

        Attv.Ajax.sendAjax(opt);

        expect(xhr.open).toHaveBeenCalledWith("post", "https://github.com", true);
        expect(xhr.send).toHaveBeenCalled();
    });

    it('sendAjax() should not send ajax (missing url)', () => {
        var xhr: XMLHttpRequest = {
            send: jasmine.createSpy('send'),
            open: jasmine.createSpy('open')
        } as unknown as XMLHttpRequest;
    

        let opt: Attv.Ajax.AjaxOptions = {
            url: undefined,
            createHttpRequest: () => xhr
        };

        try {
            Attv.Ajax.sendAjax(opt);
            fail();
        } catch {
            // good
        }
    });
});