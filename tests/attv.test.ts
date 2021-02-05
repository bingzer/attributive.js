/// <reference path="../src/attv.ts" />
// ------------------------------------------------- //

describe('Attv constants and global vars', () => {
    it('Should have Attv global variables', () => {
        expect(ATTV_DEBUG).toBeDefined();
        expect(ATTV_VERBOSE_LOGGING).toBeDefined();
        expect(ATTV_VERSION).toBeDefined();

        expect(Attv).toBeDefined();
        expect(Attv.version).toBeDefined();
        expect(Attv.Attribute).toBeDefined();
        expect(Attv.AttributeValue).toBeDefined();
        expect(Attv.Registrar).toBeDefined();
        expect(Attv.Validators).toBeDefined();
        expect(Attv.Dom).toBeDefined();
        expect(Attv.Ajax).toBeDefined();
    });

    it('Should do nothing (test usage)', () => {
        Attv.register('register')
        Attv.register('data-app', (att) => {
        });
    });
});


describe('Attv functions', () => {
    describe('Attv.isUndefined()', () => {

        it('Should returns false if defined', () => {
            expect(Attv.isUndefined({})).toBeFalse();
        });
        
        it('Should returns true if undefined', () => {
            expect(Attv.isUndefined(undefined)).toBeTrue();
        });

    });

    describe('Attv.isDefined()', () => {
        
        it('Should returns false if undefined', () => {
            expect(Attv.isDefined(undefined)).toBeFalse();
        });

        it('Should returns true if defined', () => {
            expect(Attv.isDefined({})).toBeTrue();
            expect(Attv.isDefined([])).toBeTrue();
        });

    });

    describe('Attv.isString()', () => {
        
        it('Should returns false if undefined', () => {
            expect(Attv.isString(undefined)).toBeFalse();
            expect(Attv.isString({})).toBeFalse();
            expect(Attv.isString([])).toBeFalse();
        });

        it('Should returns true if defined', () => {
            expect(Attv.isString('string')).toBeTrue();
        });

    });

    describe('Attv.isObject()', () => {
        
        it('Should returns false if undefined', () => {
            expect(Attv.isObject(undefined)).toBeFalse();
            expect( Attv.isObject('string')).toBeFalse();
        });

        it('Should returns true if object', () => {
            expect( Attv.isObject({})).toBeTrue();
        });

    });

    describe('Attv.isType()', () => {
        
        it('Should returns true if undefined', () => {
            expect(Attv.isType(undefined, 'undefined')).toBeTrue();
            expect(Attv.isType('hello world', 'string')).toBeTrue();
            expect(Attv.isType({}, 'object')).toBeTrue();
        });

    });

    describe('Attv.isEvaluatable()', () => {
        
        it('Should returns true if starts with ( and ends with )', () => {
            expect(Attv.isEvaluatable('( var emp = """" )')).toBeTrue();
        });
        
        it('Should returns false if starts with ( and ends with )', () => {
            expect(Attv.isEvaluatable('{}')).toBeFalse();
            expect(Attv.isEvaluatable('[]')).toBeFalse();
        });

    });

    describe('Attv.eval$()', () => {
        
        it('Should returns truthy', () => {
            expect(Attv.eval$('this')).toBeTruthy();
        });

        it('Should returns truthy (with context)', () => {
            let employee = { firstName: 'ricky' };
            expect(Attv.eval$('firstName', employee)).toBeTruthy();
        });

    });

    describe('Attv.globalThis$()', () => {
        
        it('Should returns something never undefined', () => {
            expect(Attv.globalThis$()).toBeTruthy();
        });

    });

    describe('Attv.select()', () => {
        
        it('Should returns a body element', () => {
            expect(Attv.select('body')).toBeTruthy();
        });

    });

    describe('Attv.selectAll()', () => {
        
        it('Should returns a body element', () => {
            expect(Attv.selectAll('body')).toBeTruthy();
        });

    });

    describe('Attv.selectMany()', () => {
        
        it('Should returns a body element', () => {
            expect(Attv.selectMany([Attv.select('body')], 'body', true)).toBeTruthy();
        });

    });

    describe('Attv.toArray()', () => {
        
        it('Should returns an array', () => {
            let array = Attv.toArray([]);

            expect(Array.isArray(array)).toBeTruthy();
        });

    });

    // describe('Attv.createHTMLElement()', () => {
        
    //     it('Should returns an HTMLDivElement', () => {
    //         let element = Attv.createHTMLElement('<div></div>');

    //         expect(element.firstElementChild).toBeInstanceOf(HTMLDivElement);
    //     });
        
    //     it('Should returns an HTMLUListElement', () => {
    //         let element = Attv.createHTMLElement('<ul></ul>');

    //         expect(element.firstElementChild).toBeInstanceOf(HTMLUListElement);
    //     });
        
    //     it('Should returns an HTMLLIElement', () => {
    //         let element = Attv.createHTMLElement('<li></li>');

    //         expect(element.firstElementChild).toBeInstanceOf(HTMLLIElement);
    //     });

    // });
})