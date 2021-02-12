/// <reference path="../../src/attv.ts" />
/// <reference path="../../src/data-templates/data-template.ts" />
// ------------------------------------------------- //

describe("Attv.DataTemplate", () => {
    it('Should declared its global variables', () => {
        expect(Attv.DataTemplate).toBeDefined();
        expect(Attv.DataTemplate.Key).toBeDefined();
    });

    it('Attv should have [data-template] registered', () => {
        let attribute = Attv.getAttribute(Attv.DataTemplate.Key);

        expect(attribute).toBeInstanceOf(Attv.DataTemplate);
        expect(attribute.wildcard).toEqual("none");
        expect(attribute.isAutoLoad).toEqual(true);
        expect(attribute.deps.internals.length).toBeGreaterThan(0);
        expect(attribute.priority).toEqual(2);
    });

    it("should create an instance of DataTemplate", () => {
        let attribute = new Attv.DataTemplate();

        expect(attribute).toBeInstanceOf(Attv.Attribute);
        expect(attribute.key).toEqual(Attv.DataTemplate.Key);
        expect(attribute.wildcard).toEqual("none");
        expect(attribute.isAutoLoad).toEqual(true);
        expect(attribute.deps.internals.length).toBeGreaterThan(0);
        expect(attribute.priority).toEqual(2);
    });

    it("render() should render the template to element (div)", () => {
        let model = { employee: { firstName: "john" } }; 

        let html = `
        <div data-template="default">
            <div data-model="employee.firstName"></div>
        </div>
        `;
        let element = Attv.Dom.parseDom(html).firstElementChild as HTMLElement;

        let attribute = new Attv.DataTemplate();
        let value = new Attv.DataTemplate.Default();
        attribute.map(() => value);

        value.load(element, { context: model });

        let expected = attribute.render(element, model);

        expect(expected).toBeInstanceOf(HTMLDivElement);
        
        let dataModel = expected.querySelector('[data-model]');
        expect(dataModel.innerHTML).toEqual('john');
    });

    it("render() should render the template to element (script)", () => {
        let model = { employee: { firstName: "john" } }; 

        let html = `
        <script data-template="script">
            <div data-model="employee.firstName"></div>
        </script>
        `;
        let element = Attv.Dom.parseDom(html).firstElementChild as HTMLElement;

        let attribute = new Attv.DataTemplate();
        let value = new Attv.DataTemplate.Script();
        attribute.map(() => value);

        value.load(element, { context: model });

        let expected = attribute.render(element, model);

        expect(expected).toBeInstanceOf(HTMLDivElement);
        
        let dataModel = expected.querySelector('[data-model]');
        expect(dataModel.innerHTML).toEqual('john');
    });

});