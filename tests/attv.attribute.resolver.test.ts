beforeEach(() => {
    expect(global.Attv).toBeFalsy();

    global.Attv = require('../src/attv').Attv;

    Attv.configuration = new Attv.DefaultConfiguration();
});

afterEach(() => {
    global.Attv = undefined;
});

// ------------------------------------------------- //

describe('Attv.Attribute.Resolver', () => {

    it('Should have Attv.Attribute.Resolver type', () => {
        expect(Attv.Attribute.Resolver).toBeDefined();
    });

    it('Should be a subtype of Attv.Attribute.Dependency', () => {
        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);
        let val = new Attv.Attribute.Value('some-value', att);
        let resolver = new Attv.Attribute.Resolver(val);

        expect(resolver instanceof Attv.Attribute.Dependency).toBeTruthy();
    });

    it('Should create Attv.Attribute.Resolver', () => {
        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);
        let val = new Attv.Attribute.Value('some-value', att);
        let resolver = new Attv.Attribute.Resolver(val);

        expect(resolver.allDependencies).toBeTruthy();
    });

    it('Should be able to resolve the dependency', () => {
        let somethingAtt = new Attv.Attribute('abcd', 'data-something', true);

        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);
        let val = new Attv.Attribute.Value('some-value', att);

        att.dependency.internals.push('abcd');

        Attv.registerAttribute('data-attribute', () => att);
        Attv.registerAttribute('data-something', () => somethingAtt);

        let event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        document.dispatchEvent(event);

        let expected = val.resolver.resolve('abcd');

        expect(expected).toEqual(somethingAtt);
    });


    it('Should add data-attribute to an alement', () => {
        let elem = document.createElement('div');

        let somethingAtt = new Attv.Attribute('abcd', 'data-something', true);

        let att = new Attv.Attribute('uniqueId', 'data-attribute', true);
        let val = new Attv.Attribute.Value('some-value', att);

        att.dependency.internals.push('abcd');

        Attv.registerAttribute('data-attribute', () => att);
        Attv.registerAttribute('data-something', () => somethingAtt);

        let event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        document.dispatchEvent(event);
        
        val.resolver.addAttribute('abcd', elem, 'some-value');

        expect(elem.getAttribute('data-something')).toEqual('some-value');
    });
});