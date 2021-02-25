/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-attributes/data-url.ts" />
/// <reference path="../../src/data-attributes/data-target.ts" />
/// <reference path="../../src/data-partials/data-partial.ts" />
// ------------------------------------------------- //

describe("Attv.DataPartial", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataPartial).toBeDefined();
        expect(Attv.DataPartial.Key).toBeDefined();
    });

    it('Attv should have [data-partial] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataPartial.Key);

        expect(attribute).toBeInstanceOf(Attv.DataPartial);
        expect(attribute.wildcard).toEqual("none");
        expect(attribute.isAutoLoad).toEqual(true);
        expect(attribute.deps.requires.length).toBeGreaterThan(0);
        expect(attribute.deps.uses.length).toBeGreaterThan(0);
    });

    it("should create an instance of DataPartial", () => {
        let attribute = new Attv.DataPartial();

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.key).toEqual(Attv.DataPartial.Key);
        expect(attribute.wildcard).toEqual("none");
        expect(attribute.isAutoLoad).toEqual(true);
        expect(attribute.deps.requires.length).toBeGreaterThan(0);
        expect(attribute.deps.uses.length).toBeGreaterThan(0);
    });

});


describe("Attv.DataPartial.Default", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataPartial.Default).toBeDefined();
    });

    it("should create an instance of DataPartial.Default", () => {
        let value = new Attv.DataPartial.Default();

        let valType = value.validators.filter(val => val.name === Attv.Validators.NeedAttrKeys)[0] as Attv.Validators.ValidatingObj;
        expect(valType).toBeDefined();
        expect(valType.options.indexOf(Attv.DataUrl.Key)).toBeGreaterThanOrEqual(0);
    });

});

describe("Attv.DataPartial.Auto", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataPartial.Auto).toBeDefined();
    });

    it("should create an instance of DataPartial.Auto", () => {
        let value = new Attv.DataPartial.Auto();

        let valType = value.validators.filter(val => val.name === Attv.Validators.NeedAttrKeys)[0] as Attv.Validators.ValidatingObj;
        expect(valType).toBeDefined();
        expect(valType.options.indexOf(Attv.DataUrl.Key)).toBeGreaterThanOrEqual(0);
    });
});

describe("Attv.DataPartial.Click", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataPartial.Click).toBeDefined();
    });

    it("should create an instance of DataPartial.Click", () => {
        let value = new Attv.DataPartial.Click();

        let valType = value.validators.filter(val => val.name === Attv.Validators.NeedAttrKeys)[0] as Attv.Validators.ValidatingObj;
        expect(valType).toBeDefined();
        expect(valType.options.indexOf(Attv.DataUrl.Key)).toBeGreaterThanOrEqual(0);
    });
});

describe("Attv.DataPartial.Nonce", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataPartial.Nonce).toBeDefined();
    });

    it("should create an instance of DataPartial.Nonce", () => {
        let value = new Attv.DataPartial.Nonce();

        let valType = value.validators.filter(val => val.name === Attv.Validators.NeedAttrKeys)[0] as Attv.Validators.ValidatingObj;
        expect(valType).toBeDefined();
        expect(valType.options.indexOf(Attv.DataUrl.Key)).toBeGreaterThanOrEqual(0);
    });
});