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

    describe('Attv.parseJsonOrElse()', () => {
        
        it('Should return true/false', () => {
            expect(Attv.parseJsonOrElse(true)).toEqual(true);
            expect(Attv.parseJsonOrElse(false)).toEqual(false);
        });
        
        it('Should return true/false (string)', () => {
            expect(Attv.parseJsonOrElse('true')).toEqual(true);
            expect(Attv.parseJsonOrElse('false')).toEqual(false);
        });
        
        it('Should return an object', () => {
            expect(typeof Attv.parseJsonOrElse('{}')).toBe('object');
        });
        
        it('Should return an array', () => {
            let array = Attv.parseJsonOrElse('[]');
            expect(Array.isArray(array)).toBeTrue();
        });

    });

    describe('Attv.generateElementId()', () => {

        it('Should generate unique ids', () => {
            let id1 = Attv.generateElementId('attv');
            let id2 = Attv.generateElementId('attv');
    
            expect(id1 !== id2).toBeTrue();
        });

    });

    describe('Attv.log()', () => {

        it('Should log', () => {
            Attv.log('');
            Attv.log('info', 'This is info');
            Attv.log('debug', 'This is debug');
            Attv.log('warn', 'This is warn');

            try
            {
                Attv.log('fatal', 'This is fatal');
                throw new Error();

            } catch (e) {
                expect(e.message).toBe('This is fatal');
                // ok
            }
        });

    });

    describe('Attv.whenReady()', () => {
        
        it('Should run the function', () => {
            let ran = false;
            Attv.whenReady(() => {
                ran = true;
            });
            
            expect(ran).toBeTrue();
        });

    });


    describe('Attv.loadElements()', () => {

        it('Should load elements', () => {
            Attv.loadElements();
        });

    });
    
})