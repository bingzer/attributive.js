var Attv;
(function (Attv) {
    /**
     * Version. This should be replaced and updated by the CI/CD process
     */
    Attv.version = '0.0.1';
})(Attv || (Attv = {}));
HTMLElement.prototype.attr = function (name, value) {
    var _a, _b;
    name = (_b = (_a = name === null || name === void 0 ? void 0 : name.toString()) === null || _a === void 0 ? void 0 : _a.replace('[', '')) === null || _b === void 0 ? void 0 : _b.replace(']', '');
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
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Base classes ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Dependency = /** @class */ (function () {
        function Dependency(dataAttribute) {
            this.dataAttribute = dataAttribute;
            /**
             * List of DataAttribute Ids that we require
             */
            this.requires = [];
            /**
             * List of DataAttribute Id that we use
             */
            this.uses = [];
            // do nothing
        }
        /**
         * List of all dependencies
         */
        Dependency.prototype.allDependencies = function () {
            return this.requires.concat(this.uses).concat(this.dataAttribute.id);
        };
        /**
         * Returns the data attribute
         * @param dataAttributeId id
         */
        Dependency.prototype.getDataAttribute = function (dataAttributeId) {
            var dependencyDataAttribute = Attv.getDataAttribute(dataAttributeId);
            if (!this.allDependencies().some(function (dep) { return dep === dataAttributeId; })) {
                Attv.log('warning', (dependencyDataAttribute || dataAttributeId) + " should be declared as the dependant in " + this.dataAttribute + ". This is for documentation purposes");
            }
            return dependencyDataAttribute;
        };
        return Dependency;
    }());
    Attv.Dependency = Dependency;
    /**
    * Base class for data-attributes
    */
    var DataAttribute = /** @class */ (function () {
        /**
         *
         * @param id unique id
         * @param attributeName  the attribute name
         * @param description description
         * @param isAutoLoad is auto-load
         */
        function DataAttribute(id, attributeName, description, isAutoLoad) {
            if (isAutoLoad === void 0) { isAutoLoad = true; }
            this.id = id;
            this.attributeName = attributeName;
            this.description = description;
            this.isAutoLoad = isAutoLoad;
            this.dependencies = new Dependency(this);
            this.attributeValues = [];
            if (!attributeName.startsWith('data-')) {
                attributeName = 'data-' + attributeName;
            }
        }
        Object.defineProperty(DataAttribute.prototype, "attributeLoadedName", {
            /**
             * Attribute when it's loaded
             */
            get: function () {
                return this.attributeName + "-loaded";
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Register attribute values
         * @param attributeValues attribute values
         */
        DataAttribute.prototype.registerAttributeValues = function (attributeValues) {
            var _a;
            (_a = this.attributeValues).push.apply(_a, attributeValues);
        };
        /**
         * Returns the current attribute value
         * @param element the element
         */
        DataAttribute.prototype.getDataAttributeValue = function (element) {
            var value = element === null || element === void 0 ? void 0 : element.attr(this.attributeName);
            var attributeValue = this.attributeValues.filter(function (val) { return val.attributeValue === value; })[0];
            // #1. if attribute is undefined
            // find the one with the .isDefault == true
            if (!attributeValue) {
                attributeValue = this.attributeValues.filter(function (val) { return val.attributeValue === Attv.configuration.defaultTag; })[0];
            }
            if (!attributeValue) {
                var rawAttributeValue = element === null || element === void 0 ? void 0 : element.attr(this.attributeName);
                attributeValue = new DataAttributeValue(rawAttributeValue, this);
            }
            return attributeValue;
        };
        /**
         * Adds a dependency data attribute to the 'element'
         * @param element the element
         * @param value the value
         */
        DataAttribute.prototype.addDependencyDataAttribute = function (uniqueId, element, any) {
            var depedencyDataAttribute = this.dependencies.getDataAttribute(uniqueId);
            element.attr(depedencyDataAttribute.attributeName, any);
        };
        /**
         * Adds a dependency data attribute to the 'element'
         * @param element the element
         * @param value the value
         */
        DataAttribute.prototype.getDependencyDataAttribute = function (uniqueId, element) {
            var dependencyDataAttribute = this.dependencies.getDataAttribute(uniqueId);
            return dependencyDataAttribute.getDataAttributeValue(element).attributeValue;
        };
        /**
         * Equivalent to calling element.attr('data'). However, we use dependencies om this method
         * @param element element
         * @param uniqueId all unique ids
         */
        DataAttribute.prototype.getData = function (element) {
            var _this = this;
            var dataAttributes = this.dependencies.allDependencies().map(function (id) { return _this.dependencies.getDataAttribute(id); });
            var obj = {};
            dataAttributes.forEach(function (att) {
                var _a;
                var name = att.attributeName;
                var datasetName = (name === null || name === void 0 ? void 0 : name.startsWith('data-')) && name.replace(/^data\-/, '').dashToCamelCase();
                obj[datasetName] = (_a = att.getDataAttributeValue(element)) === null || _a === void 0 ? void 0 : _a.attributeValue;
            });
            return obj;
        };
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
        /**
         * Find all element and construct
         * @param root the root
         */
        DataAttributeValue.prototype.loadElement = function (element) {
            return true;
        };
        /**
         * To string
         */
        DataAttributeValue.prototype.toString = function () {
            return "[" + this.dataAttribute.attributeName + "]='" + this.attributeValue + "'";
        };
        return DataAttributeValue;
    }());
    Attv.DataAttributeValue = DataAttributeValue;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Validators /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var Validators;
    (function (Validators) {
        var RequiredRawAttributeValidator = /** @class */ (function () {
            function RequiredRawAttributeValidator(requiredRawAttributes) {
                this.requiredRawAttributes = requiredRawAttributes;
                // do nothing
            }
            RequiredRawAttributeValidator.prototype.validate = function (value, element) {
                var isValidated = true;
                // check for other require attributes
                for (var i = 0; i < this.requiredRawAttributes.length; i++) {
                    var requiredAttributeName = this.requiredRawAttributes[i];
                    var requiredAttribute = element.attr(requiredAttributeName);
                    if (!requiredAttribute) {
                        Attv.log('error', value + " is requiring [" + requiredAttributeName + "] to be present in DOM", element);
                    }
                    isValidated = isValidated && !!requiredAttribute;
                }
                return isValidated;
            };
            return RequiredRawAttributeValidator;
        }());
        Validators.RequiredRawAttributeValidator = RequiredRawAttributeValidator;
        var RequiredAttributeValidator = /** @class */ (function () {
            function RequiredAttributeValidator(requiredAttributeIds) {
                this.requiredAttributeIds = requiredAttributeIds;
                // do nothing
            }
            RequiredAttributeValidator.prototype.validate = function (value, element) {
                var isValidated = true;
                var dataAttributes = this.requiredAttributeIds.map(function (attId) { return Attv.getDataAttribute(attId); });
                // check for other require attributes
                for (var i = 0; i < dataAttributes.length; i++) {
                    var dataAttribute = dataAttributes[i];
                    var dataAttributeValue = dataAttribute.getDataAttributeValue(element);
                    if (!(dataAttributeValue === null || dataAttributeValue === void 0 ? void 0 : dataAttributeValue.attributeValue)) {
                        Attv.log('error', value + " is requiring " + dataAttribute + " to be present in DOM", element);
                    }
                    isValidated = isValidated && !!dataAttribute;
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
        var RequiredAnyElementsValidator = /** @class */ (function () {
            function RequiredAnyElementsValidator(elementTagNames) {
                this.elementTagNames = elementTagNames;
                // do nothing
            }
            RequiredAnyElementsValidator.prototype.validate = function (value, element) {
                var isValidated = false;
                // check for element that this attribute belongs to
                for (var i = 0; i < this.elementTagNames.length; i++) {
                    var elementName = this.elementTagNames[i];
                    if (element.tagName.equalsIgnoreCase(elementName)) {
                        isValidated = true;
                        break;
                    }
                }
                if (!isValidated) {
                    Attv.log('error', value + " can only be attached to elements [" + this.elementTagNames + "]", element);
                }
                return isValidated;
            };
            return RequiredAnyElementsValidator;
        }());
        Validators.RequiredAnyElementsValidator = RequiredAnyElementsValidator;
    })(Validators = Attv.Validators || (Attv.Validators = {}));
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Configuration ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    var DefaultConfiguration = /** @class */ (function () {
        function DefaultConfiguration() {
            this.isDebug = true;
            this.isLoggingEnabled = true;
        }
        Object.defineProperty(DefaultConfiguration.prototype, "defaultTag", {
            get: function () {
                return "default";
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DefaultConfiguration.prototype, "logLevels", {
            get: function () {
                return ['log', 'warning', 'error', 'debug'];
            },
            enumerable: false,
            configurable: true
        });
        return DefaultConfiguration;
    }());
    Attv.DefaultConfiguration = DefaultConfiguration;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Helper functions ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
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
    function createHTMLElement(any) {
        if (isString(any)) {
            var htmlElement = document.createElement('div');
            htmlElement.innerHTML = any;
            any = htmlElement;
        }
        return any;
    }
    Attv.createHTMLElement = createHTMLElement;
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
        var _a;
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (!Attv.configuration.isLoggingEnabled) {
            return;
        }
        var level = data[0];
        if (((_a = Attv.configuration.logLevels) === null || _a === void 0 ? void 0 : _a.indexOf(level)) >= 0) {
            data = data.splice(1);
        }
        if (level === 'warning') {
            console.warn.apply(console, data);
        }
        else if (level === 'error') {
            console.error.apply(console, data);
        }
        else if (level === 'debug') {
            console.debug.apply(console, data);
        }
        else {
            console.log.apply(console, data);
        }
    }
    Attv.log = log;
    function onDocumentReady(fn) {
        // without jQuery (doesn't work in older IEs)
        document.addEventListener('DOMContentLoaded', fn, false);
    }
    Attv.onDocumentReady = onDocumentReady;
})(Attv || (Attv = {}));
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Attv Functions ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
(function (Attv) {
    Attv.dataAttributes = [];
    Attv.loader = {
        pre: [],
        post: []
    };
    var dataAttributeFactory = [];
    function loadElements(root) {
        if (Attv.isUndefined(root)) {
            root = document.querySelector('body');
        }
        // auto load all attvs that are marked auto load
        Attv.dataAttributes.filter(function (dataAttribute) { return dataAttribute.isAutoLoad; }).forEach(function (dataAttribute, index) {
            root.querySelectorAll("[" + dataAttribute.attributeName + "]").forEach(function (element, index) {
                try {
                    // #1. If it's already loaded return
                    if (dataAttribute.isElementLoaded(element))
                        return;
                    var dataAttributeValue = dataAttribute.getDataAttributeValue(element);
                    // #2. Check if the attribute value is supported
                    if (!dataAttributeValue) {
                        var attributeValue = element.attr(dataAttribute.attributeName);
                        Attv.log('warning', dataAttribute + " does not support " + dataAttribute + "='" + attributeValue + "'", element);
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
    function getDataAttribute(id) {
        return Attv.dataAttributes.filter(function (att) { return att.id == id; })[0];
    }
    Attv.getDataAttribute = getDataAttribute;
    function registerDataAttribute(attributeName, fn, valuesFn) {
        var factory = new DataAttributeFactory(attributeName, fn, valuesFn);
        dataAttributeFactory.push(factory);
    }
    Attv.registerDataAttribute = registerDataAttribute;
    function unregisterDataAttribute(attributeName) {
        var attributes = dataAttributeFactory.filter(function (factory) { return factory.attributeName !== attributeName; });
        dataAttributeFactory.splice(0, dataAttributeFactory.length);
        dataAttributeFactory.push.apply(dataAttributeFactory, attributes);
    }
    Attv.unregisterDataAttribute = unregisterDataAttribute;
    // -- helper class 
    var DataAttributeFactory = /** @class */ (function () {
        function DataAttributeFactory(attributeName, fn, valuesFn) {
            this.attributeName = attributeName;
            this.fn = fn;
            this.valuesFn = valuesFn;
            // do nothing
        }
        DataAttributeFactory.prototype.create = function () {
            var dataAttribute = this.fn(this.attributeName);
            Attv.log('debug', "* " + dataAttribute, dataAttribute);
            if (this.valuesFn) {
                var attributeValues = [];
                this.valuesFn(dataAttribute, attributeValues);
                Attv.log('debug', "** " + dataAttribute + " adding " + attributeValues, attributeValues);
                dataAttribute.registerAttributeValues(attributeValues);
            }
            return dataAttribute;
        };
        return DataAttributeFactory;
    }());
    function initialize() {
        if (!Attv.configuration) {
            Attv.configuration = new Attv.DefaultConfiguration();
        }
        Attv.log('debug', 'Initialize...');
        for (var i = 0; i < dataAttributeFactory.length; i++) {
            var dataAttribute = dataAttributeFactory[i].create();
            Attv.dataAttributes.push(dataAttribute);
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