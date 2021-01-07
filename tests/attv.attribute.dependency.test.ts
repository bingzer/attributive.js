beforeEach(() => {
    expect(global.Attv).toBeFalsy();

    global.Attv = require('../src/attv').Attv;
});

afterEach(() => {
    global.Attv = undefined;
});

// ------------------------------------------------- //

describe('Attv.Attribute.Dependency', () => {

    it('Should have Attv.Attribute.Dependency type', () => {
        expect(Attv.Attribute.Dependency).toBeDefined();
    });

    it('Should returns all dependencies registered', () => {
        let dep = new Attv.Attribute.Dependency();
        dep.requires.push('requires');
        dep.uses.push('uses');
        dep.internals.push('internals');

        let deps = dep.allDependencies();

        expect(deps.indexOf('requires')).toBeGreaterThan(-1);
        expect(deps.indexOf('uses')).toBeGreaterThan(-1);
        expect(deps.indexOf('internals')).toBeGreaterThan(-1);
        expect(deps.length).toBe(3);
    });
});