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
            // do nothing
        });

        Attv.unregister('register');
        Attv.unregister('data-appx');
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

    describe('Attv.concatArrays()', () => {
        
        it('Should concat multiple arrays correctly', () => {
            let array1 = ["a", "b", "c"];
            let array2 = ["d"];
            let array3 = ["e", "f"];

            let expected = Attv.concatArrays(array1, array2, array3);

            expect(expected.length).toEqual(array1.length + array2.length + array3.length);
            expect(expected[0]).toEqual("a");
            expect(expected[1]).toEqual("b");
            expect(expected[2]).toEqual("c");
            expect(expected[3]).toEqual("d");
            expect(expected[4]).toEqual("e");
            expect(expected[5]).toEqual("f");
        });
        
        it('Should concat multiple arrays correctly (with an undefined array)', () => {
            let array1 = ["a", "b", "c"];
            let array2 = undefined;
            let array3 = ["e", "f"];

            let expected = Attv.concatArrays(array1, array2, array3);

            expect(expected.length).toEqual(array1?.length + array3?.length);
            expect(expected[0]).toEqual("a");
            expect(expected[1]).toEqual("b");
            expect(expected[2]).toEqual("c");
            expect(expected[3]).toEqual("e");
            expect(expected[4]).toEqual("f");
        });
        
        it('Should concat multiple arrays correctly (with an empty array)', () => {
            let array1 = ["a", "b", "c"];
            let array2 = [];
            let array3 = ["e", "f"];

            let expected = Attv.concatArrays(array1, array2, array3);

            expect(expected.length).toEqual(array1?.length + array2.length + array3?.length);
            expect(expected[0]).toEqual("a");
            expect(expected[1]).toEqual("b");
            expect(expected[2]).toEqual("c");
            expect(expected[3]).toEqual("e");
            expect(expected[4]).toEqual("f");
        });

    });

    describe('Attv.concatObject()', () => {
        it('Should concat object but not replacing the existing properties', () => {
            let from: any = {
                name: 'from',
                data: 'data'
            };

            let to: any = {
                name: 'to'
            }

            Attv.concatObject(from, to);

            expect(to.name).toEqual('to');
            expect(to.data).toEqual('data');

        });

        it('Should concat object and replacing the existing properties', () => {
            let from: any = {
                name: 'from',
                data: 'data'
            };

            let to: any = {
                name: 'to'
            }

            Attv.concatObject(from, to, true);

            expect(to.name).toEqual('from');
            expect(to.data).toEqual('data');

        });

        it('Should concat object but not replacing the existing properties and using a temporary function', () => {
            let tempFnIsCalled = false;
            let from: any = {
                name: 'from',
                data: 'data'
            };

            let to: any = {
                name: 'to'
            }

            Attv.concatObject(from, to, false, () => {
                tempFnIsCalled = true;
                expect(to.data).toEqual('data');
            });

            expect(to.name).toEqual('to');
            expect(to.data).toBeUndefined();
            expect(tempFnIsCalled).toBeTrue();

        });

        it('Should concat array', () => {
            let tempFnIsCalled = false;
            let from: any = ["a", "b", "c"];

            let to: any = {
                name: 'to'
            }

            Attv.concatObject(from, to);

            expect(from.length).toEqual(to.length);
            expect(to.name).toBe('to');

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

    describe('Attv.isEvaluatableStatement()', () => {
        
        it('Should returns true if starts with { and ends with }', () => {
            expect(Attv.isEvaluatableStatement('{}')).toBeTrue();
        });
        
        it('Should returns true if starts with [ and ends with ]', () => {
            expect(Attv.isEvaluatableStatement('[]')).toBeTrue();
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
            let id1 = Attv.generateId('attv');
            let id2 = Attv.generateId('attv');
    
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
    
    describe('Attv.getAttribute()', () => {

        it('Should returns an attribute', () => {
            expect(Attv.getAttribute(Attv.DataActive.Key)).toBeInstanceOf(Attv.Attribute);
        });

        it('Should returns an undefined', () => {
            expect(Attv.getAttribute('data-missing-attribute')).toBeUndefined();
        });

        it('Should returns an undefined #2', () => {
            expect(Attv.getAttribute('')).toBeUndefined();
        });

        it('Should returns an undefined #3', () => {
            let key = undefined;
            expect(Attv.getAttribute(key)).toBeUndefined();
        });

    });
    
    describe('Attv.register()', () => {

        it('Should register an autoLoad attribute', () => {
            // -- register
            Attv.register('data-attr', { isAutoLoad: true });

            let attribute = Attv.attributes.filter(att => att.key === 'data-attr')[0];

            expect(attribute.isAutoLoad).toBeTrue();
            expect(attribute).toBeInstanceOf(Attv.Attribute);
    
            Attv.unregister(attribute);

            expect(Attv.attributes.filter(att => att.key === 'data-attr')[0]).toBeUndefined();
        });

        it('Should register a NOT autoload attribute', () => {
            // -- register
            Attv.register('data-attr', { isAutoLoad: false });

            let attribute = Attv.attributes.filter(att => att.key === 'data-attr')[0];

            expect(attribute.isAutoLoad).toBeFalse();
            expect(attribute).toBeInstanceOf(Attv.Attribute);
    
            Attv.unregister(attribute);

            expect(Attv.attributes.filter(att => att.key === 'data-attr')[0]).toBeUndefined();
        });

        it('Should register autoLoad by default', () => {
            // -- register
            Attv.register('data-attr');

            let attribute = Attv.attributes.filter(att => att.key === 'data-attr')[0];

            expect(attribute.isAutoLoad).toBeTrue();
            expect(attribute).toBeInstanceOf(Attv.Attribute);
    
            Attv.unregister(attribute);

            expect(Attv.attributes.filter(att => att.key === 'data-attr')[0]).toBeUndefined();
        });

    });
    
    describe('Attv.unregister()', () => {

        it('Should unregister an attribute', () => {
            // -- register
            Attv.register('data-attr', { isAutoLoad: true });

            expect(Attv.attributes.filter(att => att.key === 'data-attr')[0]).toBeDefined();

            let removed = Attv.unregister('data-attr');

            expect(Attv.attributes.filter(att => att.key === 'data-attr')[0]).toBeUndefined();
            expect(removed).toBeInstanceOf(Attv.Attribute);
        });

    });
    
    describe('Attv.resolveAttribute()', () => {

        it('Should resolve to an attribute that the child depends on', () => {
            // -- register
            Attv.register('data-parent', { isAutoLoad: true });
            Attv.register('data-child', { isAutoLoad: true }, att => {
                att.deps.uses = ['data-parent'];
            });
            
            let parent = Attv.getAttribute('data-parent');
            let child = Attv.getAttribute('data-child');

            expect(Attv.resolveAttribute(child, parent.key)).toBe(parent);
            
            Attv.unregister(parent);
            Attv.unregister(child);
        });

        it('Should resolve to an attribute that the child depends on (with warning)', () => {
            // -- register
            Attv.register('data-parent', { isAutoLoad: true });
            Attv.register('data-child', { isAutoLoad: true }, att => {
            });
            
            let parent = Attv.getAttribute('data-parent');
            let child = Attv.getAttribute('data-child');

            expect(Attv.resolveAttribute(child, parent.key)).toBe(parent);
            
            Attv.unregister(parent);
            Attv.unregister(child);
        });

        it('Should not resolve to any attribute', () => {
            let parent = Attv.getAttribute('data-parent');
            let child = Attv.getAttribute('data-child');

            let att = Attv.resolveAttribute(child, parent?.key);
            expect(att).toBeUndefined();
            
            Attv.unregister(parent);
            Attv.unregister(child);
        });

    });
    
    describe('Attv.resolveAttributeValue()', () => {

        it('Should resolve to an attribute value', () => {
            let element = document.createElement('div');
            element.setAttribute('data-parent', 'default');
            element.setAttribute('data-child', 'default');

            // -- register
            Attv.register('data-parent', { isAutoLoad: true });
            Attv.register('data-child', { isAutoLoad: true }, att => {
                att.deps.uses = ['data-parent'];
            });
            
            let parent = Attv.getAttribute('data-parent');
            let child = Attv.getAttribute('data-child');

            let expected = Attv.resolveAttributeValue(child, parent.key, element);

            expect(expected).toBeInstanceOf(Attv.AttributeValue);
            expect(expected).toBeInstanceOf(Attv.AttributeValue);
            
            Attv.unregister(parent);
            Attv.unregister(child);
        });

        it('Should resolve to an attribute value (with warning)', () => {
            let element = document.createElement('div');
            element.setAttribute('data-parent', 'default');
            element.setAttribute('data-child', 'default');

            // -- register
            Attv.register('data-parent', { isAutoLoad: true });
            Attv.register('data-child', { isAutoLoad: true });
            
            let parent = Attv.getAttribute('data-parent');
            let child = Attv.getAttribute('data-child');

            let expected = Attv.resolveAttributeValue(child, parent.key, element);

            expect(expected).toBeInstanceOf(Attv.AttributeValue);
            
            Attv.unregister(parent);
            Attv.unregister(child);
        });

    });
    
})