/**
 * Documentation/Help page etc...
 */
var Attv;
(function (Attv) {
    var Docs;
    (function (Docs) {
        var ConsoleWriter = /** @class */ (function () {
            function ConsoleWriter() {
            }
            ConsoleWriter.prototype.write = function (text, data) {
                console.log(text);
            };
            ConsoleWriter.prototype.clear = function () {
                console.clear();
            };
            return ConsoleWriter;
        }());
        Docs.ConsoleWriter = ConsoleWriter;
        var HtmlWriter = /** @class */ (function () {
            function HtmlWriter(htmlElement) {
                if (htmlElement === void 0) { htmlElement = Attv.createHTMLElement('<div>'); }
                this.htmlElement = htmlElement;
                // do nothing
                htmlElement.className = "attv-docs";
            }
            HtmlWriter.prototype.write = function (text, data) {
                var p = Attv.createHTMLElement('<p>');
                p.className = "attv-" + data;
                p.innerHTML = text;
                this.htmlElement.append(p);
            };
            HtmlWriter.prototype.clear = function () {
                this.htmlElement.innerHTML = '';
            };
            return HtmlWriter;
        }());
        Docs.HtmlWriter = HtmlWriter;
        var consoleWriter = new ConsoleWriter();
        function showHelp(uniqueIdOrName, writer) {
            if (writer === void 0) { writer = consoleWriter; }
            var attribute = Attv.attributes.filter(function (att) { return att.uniqueId == uniqueIdOrName || att.name === uniqueIdOrName; })[0];
            writer.clear();
            writer.write("Documentation for " + attribute.toString() + ". " + (attribute.description || ''), "attribute");
            attribute.values.forEach(function (val) {
                writer.write("   " + val.toString(true) + ". " + (val.description || ''), "attribute-value");
            });
        }
        Docs.showHelp = showHelp;
    })(Docs = Attv.Docs || (Attv.Docs = {}));
})(Attv || (Attv = {}));

//# sourceMappingURL=data-docs.js.map
