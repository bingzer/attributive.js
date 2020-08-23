////////////////////////////////// PROTOTYPES //////////////////////////////////////
HTMLElement.prototype.attr = function (name, value) {
    var element = this;
    var datasetName = (name === null || name === void 0 ? void 0 : name.startsWith('data-')) && name.replace(/^data\-/, '').dashToCamelCase();
    // element.attr()
    if (Attv.isUndefined(name)) {
        var atts = {};
        for (var i = 0; i < element.attributes.length; i++) {
            var attName = element.attributes[i].name;
            var value_1 = Attv.parseJsonOrElse(element.attributes[i].value);
            atts[attName] = value_1;
        }
        // returns all attributes
        return atts;
    }
    // element.attr('data')
    if (name === 'data') {
        if (Attv.isUndefined(value)) {
            // get all data 
            var keys = Object.keys(element.dataset);
            var data_1 = {};
            keys.map(function (key) { return data_1[key] = element.dataset[key]; });
            return data_1;
        }
        else if (Attv.isObject(value)) {
            var keys = Object.keys(element.dataset);
            keys.forEach(function (key) { return delete element.dataset[key]; });
            var newKeys = Object.keys(value);
            newKeys.forEach(function (key) { return element.dataset[key] = value[key]; });
        }
        else {
            throw Error('Only object can be assigned to dataset');
        }
    }
    // element.attr('name')
    else if (Attv.isDefined(value)) {
        if (datasetName) {
            if (Attv.isObject(value)) {
                value = JSON.stringify(value);
            }
            element.dataset[datasetName] = value;
            return this;
        }
        else {
            // just attribute
            element.setAttribute(name, value);
        }
        return element;
    }
    // element.attr('name', 'value')
    else {
        value = element.dataset[datasetName];
        if (!value) {
            // get from the attrbitue
            value = element.getAttribute(name);
        }
        return Attv.parseJsonOrElse(value);
    }
};
String.prototype.startsWith = function (text) {
    var obj = this;
    return obj.indexOf(text) >= 0;
};
String.prototype.camelCaseToDash = function () {
    var text = this;
    return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
String.prototype.dashToCamelCase = function () {
    var text = this;
    return text.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
    });
};
String.prototype.equalsIgnoreCase = function (other) {
    var text = this;
    return (text === null || text === void 0 ? void 0 : text.toLowerCase()) === (other === null || other === void 0 ? void 0 : other.toLowerCase());
};
////////////////////////////////// Attv.DataAttv //////////////////////////////////////
var Attv;
(function (Attv) {
    /**
    * Base class for data-attributes
    */
    var DataAttribute = /** @class */ (function () {
        /**
         *
         * @param attributeName suffix name
         */
        function DataAttribute(attributeName, isAutoLoad) {
            if (isAutoLoad === void 0) { isAutoLoad = true; }
            this.attributeName = attributeName;
            this.isAutoLoad = isAutoLoad;
            if (!attributeName.startsWith('data-'))
                attributeName = 'data-' + attributeName;
        }
        Object.defineProperty(DataAttribute.prototype, "attributeLoadedName", {
            get: function () {
                return this.attributeName + "-loaded";
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Checks to see if element is loaded
         * @param element element to check
         */
        DataAttribute.prototype.isElementLoaded = function (element) {
            var isLoaded = element.attr(this.attributeLoadedName);
            return isLoaded === 'true';
        };
        DataAttribute.prototype.toString = function () {
            return "[" + this.attributeName + "]";
        };
        return DataAttribute;
    }());
    Attv.DataAttribute = DataAttribute;
    /**
     * Base class for DataAttribute-value
     */
    var DataAttributeValue = /** @class */ (function () {
        function DataAttributeValue(attributeValue, dataAttribute, validators) {
            if (validators === void 0) { validators = []; }
            this.attributeValue = attributeValue;
            this.dataAttribute = dataAttribute;
            this.validators = validators;
            // do nothing
        }
        DataAttributeValue.prototype.toString = function () {
            return "[" + this.dataAttribute.attributeName + "]='" + this.attributeValue + "'";
        };
        return DataAttributeValue;
    }());
    Attv.DataAttributeValue = DataAttributeValue;
    ////////////////////////////////// Validators //////////////////////////////////////
    var Validators;
    (function (Validators) {
        var RequiredAttributeValidator = /** @class */ (function () {
            function RequiredAttributeValidator(requiredAttributes) {
                this.requiredAttributes = requiredAttributes;
                // do nothing
            }
            RequiredAttributeValidator.prototype.validate = function (value, element) {
                var isValidated = true;
                // check for other require attributes
                for (var i = 0; i < this.requiredAttributes.length; i++) {
                    var requiredAttributeName = this.requiredAttributes[i];
                    var requiredAttribute = element.attr(requiredAttributeName);
                    if (!requiredAttribute) {
                        Attv.log('error', value + " is requiring [" + requiredAttributeName + "] to be present in DOM", element);
                    }
                    isValidated = isValidated && !!requiredAttribute;
                }
                return isValidated;
            };
            return RequiredAttributeValidator;
        }());
        Validators.RequiredAttributeValidator = RequiredAttributeValidator;
        var RequiredAttributeValidatorWithValue = /** @class */ (function () {
            function RequiredAttributeValidatorWithValue(requiredAttributes) {
                this.requiredAttributes = requiredAttributes;
                // do nothing
            }
            RequiredAttributeValidatorWithValue.prototype.validate = function (value, element) {
                var isValidated = true;
                // check for other require attributes
                for (var i = 0; i < this.requiredAttributes.length; i++) {
                    var attribute = this.requiredAttributes[i];
                    var requiredAttribute = element.attr(attribute.name);
                    if (!requiredAttribute.equalsIgnoreCase(attribute.value)) {
                        Attv.log('error', value + " is requiring [" + attribute.name + "]='" + attribute.value + "' to be present in DOM", element);
                    }
                    isValidated = isValidated && !!requiredAttribute;
                }
                return isValidated;
            };
            return RequiredAttributeValidatorWithValue;
        }());
        Validators.RequiredAttributeValidatorWithValue = RequiredAttributeValidatorWithValue;
        var RequiredElementValidator = /** @class */ (function () {
            function RequiredElementValidator(elementTagNames) {
                this.elementTagNames = elementTagNames;
                // do nothing
            }
            RequiredElementValidator.prototype.validate = function (value, element) {
                var isValidated = true;
                // check for element that this attribute belongs to
                for (var i = 0; i < this.elementTagNames.length; i++) {
                    var elementName = this.elementTagNames[i];
                    isValidated = isValidated && element.tagName.equalsIgnoreCase(elementName);
                }
                if (!isValidated) {
                    Attv.log('error', value + " can only be attached to elements [" + this.elementTagNames + "]", element);
                }
                return isValidated;
            };
            return RequiredElementValidator;
        }());
        Validators.RequiredElementValidator = RequiredElementValidator;
    })(Validators = Attv.Validators || (Attv.Validators = {}));
})(Attv || (Attv = {}));
////////////////////////////////// Config //////////////////////////////////////
(function (Attv) {
    var Configuration = /** @class */ (function () {
        function Configuration() {
            this.isDebug = true;
            this.isLoggingEnabled = true;
            this.attributeValueMissingLogLevel = 'warning';
        }
        Object.defineProperty(Configuration.prototype, "logLevels", {
            get: function () {
                return ['log', 'warning', 'error'];
            },
            enumerable: false,
            configurable: true
        });
        return Configuration;
    }());
    Attv.Configuration = Configuration;
})(Attv || (Attv = {}));
////////////////////////////////// Functions //////////////////////////////////////
(function (Attv) {
    Attv.dataAttributes = [];
    Attv.dataAttributeValues = [];
    Attv.configuration = new Attv.Configuration();
    Attv.loader = {
        pre: [],
        post: []
    };
    var dataAttributeFactory = [];
    var dataAttributeValueFactory = [];
    function isUndefined(any) {
        return isType(any, 'undefined');
    }
    Attv.isUndefined = isUndefined;
    function isDefined(any) {
        return !isType(any, 'undefined');
    }
    Attv.isDefined = isDefined;
    function isString(any) {
        return isType(any, 'string');
    }
    Attv.isString = isString;
    function isObject(any) {
        return isType(any, 'object');
    }
    Attv.isObject = isObject;
    function isType(any, expectedType) {
        return typeof (any) === expectedType;
    }
    Attv.isType = isType;
    function parseJsonOrElse(any) {
        try {
            any = JSON.parse(any);
        }
        catch (_a) {
            // nothing
        }
        return any;
    }
    Attv.parseJsonOrElse = parseJsonOrElse;
    function log() {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (!Attv.configuration.isLoggingEnabled) {
            return;
        }
        var level = data[0];
        if (Attv.configuration.logLevels.indexOf(level) >= 0) {
            data = data.splice(1);
        }
        if (level === 'warning') {
            console.warn.apply(console, data);
        }
        else if (level === 'error') {
            console.error.apply(console, data);
        }
        else {
            console.log.apply(console, data);
        }
    }
    Attv.log = log;
    function loadElements(root) {
        if (isUndefined(root)) {
            root = document.querySelector('body');
        }
        // auto load all attvs that are marked auto load
        Attv.dataAttributes.filter(function (dataAttribute) { return dataAttribute.isAutoLoad; }).forEach(function (dataAttribute, index) {
            root.querySelectorAll("[" + dataAttribute.attributeName + "]").forEach(function (element, index) {
                try {
                    // #1. If it's already loaded return
                    if (dataAttribute.isElementLoaded(element))
                        return;
                    var attributeValue = element.attr(dataAttribute.attributeName);
                    var dataAttributeValue = Attv.getDataAttributeValue(attributeValue, dataAttribute);
                    // #2. Check if the attribute value is supported
                    if (!dataAttributeValue) {
                        Attv.log(Attv.configuration.attributeValueMissingLogLevel, dataAttribute + " does not support " + dataAttribute + "='" + attributeValue + "'", element);
                        return;
                    }
                    // #3. Validate
                    var isValidated = true;
                    for (var i = 0; i < dataAttributeValue.validators.length; i++) {
                        var validator = dataAttributeValue.validators[i];
                        isValidated = isValidated = validator.validate(dataAttributeValue, element);
                    }
                    if (!isValidated) {
                        return;
                    }
                    // #4. Load the stuff!
                    var isLoaded = dataAttributeValue.loadElement(element);
                    element.attr(dataAttribute.attributeLoadedName, isLoaded);
                }
                catch (error) {
                    Attv.log('error', "Unexpected error occurred when loading " + dataAttribute, error, element);
                }
            });
        });
    }
    Attv.loadElements = loadElements;
    function registerDataAttribute(attributeName, fn, replace) {
        if (replace === void 0) { replace = false; }
        var factory = new DataAttributeFactory(attributeName, fn);
        dataAttributeFactory.push(factory);
    }
    Attv.registerDataAttribute = registerDataAttribute;
    function unregisterDataAttribute(attributeName) {
        var attributes = dataAttributeFactory.filter(function (factory) { return factory.attributeName !== attributeName; });
        dataAttributeFactory.splice(0, dataAttributeFactory.length);
        dataAttributeFactory.push.apply(dataAttributeFactory, attributes);
        var values = dataAttributeValueFactory.filter(function (factory) { return factory.attributeName !== attributeName; });
        dataAttributeValueFactory.splice(0, dataAttributeValueFactory.length);
        dataAttributeValueFactory.push.apply(dataAttributeValueFactory, values);
    }
    Attv.unregisterDataAttribute = unregisterDataAttribute;
    function registerAttributeValue(attributeName, fn) {
        var factory = new DataAttributeValueFactory(attributeName, fn);
        dataAttributeValueFactory.push(factory);
    }
    Attv.registerAttributeValue = registerAttributeValue;
    function getDataAttribute(attributeName) {
        return Attv.dataAttributes.filter(function (att) { return att.attributeName == attributeName; })[0];
    }
    Attv.getDataAttribute = getDataAttribute;
    function getDataAttributeValue(attributeValue, dataAttribute) {
        return Attv.dataAttributeValues.filter(function (val) { return val.dataAttribute === dataAttribute && val.attributeValue === attributeValue; })[0];
    }
    Attv.getDataAttributeValue = getDataAttributeValue;
    function onDocumentReady(fn) {
        // without jQuery (doesn't work in older IEs)
        document.addEventListener('DOMContentLoaded', fn, false);
    }
    Attv.onDocumentReady = onDocumentReady;
    // -- helper class 
    var DataAttributeFactory = /** @class */ (function () {
        function DataAttributeFactory(attributeName, fn) {
            this.attributeName = attributeName;
            this.fn = fn;
            // do nothing
        }
        DataAttributeFactory.prototype.create = function () {
            return this.fn(this.attributeName);
        };
        return DataAttributeFactory;
    }());
    var DataAttributeValueFactory = /** @class */ (function () {
        function DataAttributeValueFactory(attributeName, fn) {
            this.attributeName = attributeName;
            this.fn = fn;
            // do nothing
        }
        DataAttributeValueFactory.prototype.create = function () {
            var attribute = Attv.getDataAttribute(this.attributeName);
            return this.fn(attribute);
        };
        return DataAttributeValueFactory;
    }());
    function initialize() {
        Attv.log('* DataAttributes');
        for (var i = 0; i < dataAttributeFactory.length; i++) {
            var dataAttribute = dataAttributeFactory[i].create();
            Attv.log("Instantiating " + dataAttribute, dataAttribute);
            Attv.dataAttributes.push(dataAttribute);
        }
        Attv.log('* DataAttributeValues');
        for (var i = 0; i < dataAttributeValueFactory.length; i++) {
            var dataAttributeValue = dataAttributeValueFactory[i].create();
            Attv.log("Registering attributeValue: " + dataAttributeValue, dataAttributeValue);
            Attv.dataAttributeValues.push(dataAttributeValue);
        }
    }
    Attv.loader.post.push(initialize);
    Attv.loader.post.push(loadElements);
})(Attv || (Attv = {}));
Attv.onDocumentReady(function () {
    for (var i = 0; i < Attv.loader.pre.length; i++) {
        Attv.loader.pre[i]();
    }
    for (var i = 0; i < Attv.loader.post.length; i++) {
        Attv.loader.post[i]();
    }
});
//# sourceMappingURL=attv.js.map