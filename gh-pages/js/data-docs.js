/**
 * Documentation/Help page etc...
 */
var Attv;
(function (Attv) {
    var Documentation;
    (function (Documentation) {
        function showHelp(uniqueIdOrName) {
            var attribute = Attv.attributes.filter(function (att) { return att.uniqueId == uniqueIdOrName || att.name === uniqueIdOrName; })[0];
            console.log(attribute);
        }
        Documentation.showHelp = showHelp;
    })(Documentation = Attv.Documentation || (Attv.Documentation = {}));
})(Attv || (Attv = {}));

//# sourceMappingURL=data-docs.js.map
