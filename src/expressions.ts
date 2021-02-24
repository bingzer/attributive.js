namespace Attv.Expressions {
    /**
     * An expression
     */
    export interface Expression {

        /**
         * The original expression
         */
        readonly expression: string;

        /**
         * The property name
         */
        readonly propertyName: string;

        /**
         * Evalue this expression and returns the 'result'
         * @param context context object (optional) to evaluate this expression against
         * @param arg additional object to evaluate
         */
        evaluate(context?: any, arg?: any, options?: LoadElementOptions): any;
    }

    /**
     * A value of an alias of a variable.
     * Value is the original value, filtered is the applied value
     * /filtered value if there's any filter
     */
    export interface AliasValue {
        /**
         * The original value
         */
        value: any;

        /**
         * The filtered value
         */
        filtered: any;
    }

    /**
     * A filter object
     */
    export interface Filter {
        /**
         * Optional additional function that returns a string
         */
        [key: string]: (any: any) => any;

        /**
         * To uppercase
         */
        uppercase: (any: string) => string;

        /**
         * To lower case
         */
        lowercase: (any: string) => string;
    }

    /**
     * List of available filters
     */
    export const filters: Filter = {
        uppercase: (any: string) => any.toLocaleUpperCase(),
        lowercase: (any: string) => any.toLowerCase()
    };

    /**
     * Array expression with the word 'in'
     */
    export class ArrayExpression implements Expression {
        readonly propertyName: string;
        readonly itemName: string

        constructor(public readonly expression: string){
            let split = expression.split(" in ");
            this.itemName = split[0]?.trim();
            this.propertyName = split[1]?.trim();
        }

        /**
         * Evaluate propertyName against context
         * @param context the context object
         */
        evaluate<TAny>(context?: any, arg?: any, options?: LoadElementOptions): TAny[] {
            let evaluatedValue = Expressions.evaluateExpression(this, context, arg);

            return evaluatedValue || [];
        }
    }

    /**
     * Alias expression with the word 'as'
     */
    export class AliasExpression implements Expression {
        readonly alias: string;
        readonly propertyName: string;
        readonly filterFn: (value?: any, context?: any, arg?: any, options?: LoadElementOptions) => string;

        constructor(public readonly expression: string) {
            let split = expression?.split(" as ");
            let prop = this.parsePropertyName((split[0])?.trim());

            this.propertyName = prop.propertyName;
            this.alias = this.cleanString((split[1] || this.propertyName)?.trim());

            this.filterFn = (value?: any, context?: any, arg?: any, options?: LoadElementOptions) => {
                if (prop.filterName) {
                    let result = undefined;

                    let argx = Attv.concatObject(filters, arg);
                    let evalFn = Attv.eval$(prop.filterName, context, argx);
                    if (Attv.isUndefined(evalFn))
                        throw new Error('Not a function: ' + prop.filterName);
                    result = evalFn(value, context, argx, options);
                    
                    return result;
                }
                    
                return value;
            }
        }

        /**
         * Evaluate propertyName against context
         * @param context the context object
         */
        evaluate(context?: any, arg?: any, options?: LoadElementOptions): AliasValue {
            let value: any;
            let filteredValue: any;
            
            if (!this.propertyName) {
                value = context;
                filteredValue = context;
            }
            else {
                value = Expressions.evaluateExpression(this, context, arg);
                filteredValue = this.filterFn(value, context, arg, options) || value;
            }

            return {
                value: value,
                filtered: filteredValue
            };
        }

        /**
         * 
         * @param name the name to parse
         */
        private parsePropertyName(name: string): { propertyName: string, filterName: string } {
            let split = this.cleanString(name).split('|');
            return {
                propertyName: split[0]?.trim(),
                filterName: (split[1] || '')?.trim()
            }
        }

        /**
         * Remove (',"") from the title
         * @param any title to clean
         */
        private cleanString(any: string) {
            if (any.startsWith('(') && any.endsWith(')'))
                any = any.substring(1, any.length - 1);
            if (any.startsWith('\'') && any.endsWith('\''))
                any = any.substring(1, any.length - 1);
            if (any.startsWith('\"') && any.endsWith('\"'))
                any = any.substring(1, any.length - 1);

            return any?.trim();
        }
    }

    /**
     * Evaluate any expression
     * @param expression expression to evalue
     * @param context context
     * @param arg additional argument object
     */
    export function evaluateExpression(expression: Expression, context?: any, arg?: any): any {
        // first check if it's a property statement
        let evaluatedValue: any = undefined;
        if (Attv.isEvaluatableStatement(expression.propertyName)) {
            evaluatedValue = Attv.parseJsonOrElse(expression.propertyName, undefined, context, arg);
        } else {
            // treat is a property name
            evaluatedValue = Attv.Expressions.getProperty(expression.propertyName, context);
        }

        // if not check see if we can execute the expression
        if (Attv.isUndefined(evaluatedValue)) {
            let parsedExpression = expression.expression;
            if (!parsedExpression.startsWith('(') && !parsedExpression.endsWith(')')) {
                parsedExpression = `(${expression.expression})`;
            }

            // try parse
            let parsed = Attv.parseJsonOrElse(parsedExpression, undefined, context, arg);

            // if it's not a string then it is an expression
            if (!Attv.isString(parsed) && Attv.isDefined(parsed)) {
                evaluatedValue = parsed;
            }
        }

        evaluatedValue = Attv.isDefined(evaluatedValue) ? evaluatedValue : undefined;

        return evaluatedValue;
    }
        
    /**
     * Returns a property of an object
     * @param model the object
     * @param propertyName the property name
     */
    export function getProperty(propertyName: string, model?: any): any {
        if (!model) {
            model = Attv.globalThis$();
        }

        let propertyValue = model;
        let propertyChilds = propertyName.split('.');
        
        for (let j = 0; j < propertyChilds.length; j++) {
            try {
                let child = propertyChilds[j];
                if (child === 'this') {
                    propertyValue = propertyValue;
                } else {
                    // see if the propertyName is a global variable
                    if (j == 0 && isGlobal(child, propertyValue)) {
                        propertyValue = Attv.globalThis$()[child];
                    }
                    else {
                        propertyValue = propertyValue[child];
                    }
                }
            }
            catch (e) {
                propertyValue = undefined;
                break;
            }
        }

        return Attv.parseJsonOrElse(propertyValue);
    }

    /**
     * Sets a property in an object
     * @param model the object
     * @param propertyName the property name
     * @param propertyValue the property value
     */
    export function setProperty(propertyName: string, propertyValue: any, model: any) {
        if (!model) {
            model = Attv.globalThis$();
        }

        let property = model;
        let propertyChilds = propertyName.split('.');
        
        let len = propertyChilds.length;
        for (let j = 0; j < len - 1; j++) {
            let childProperty = propertyChilds[j];
            property = property[childProperty];

            // throw warning
            if (Attv.isUndefined(property)) {
                if (isGlobal(property)) {
                    return Attv.Expressions.setProperty(propertyName, propertyValue, undefined);
                }
                else {
                    Attv.log('warning', `No property ${propertyName}`, property);
                }
            }
        }

        property[propertyChilds[len-1]] = propertyValue;
    }

    /**
     * Checks to see if property name is part of a global context
     * @param propertyName variable name to check
     * @param scoped optionally object to check if propertyName actually belongs the scoped object
     */
    export function isGlobal(propertyName: string, scoped?: any): boolean {
        if (Attv.isUndefined(propertyName))
            return false;
        return !scoped?.hasOwnProperty(propertyName) && Attv.globalThis$().hasOwnProperty(propertyName);
    }

    /**
     * Escape single quote and extract variable using ${} or `
     * @param any 
     */
    export function escapeQuote(any: string): string {
        if (!any)
            return any;

        let escapeVar = (text: string) => {
            const regex = /(\$\{.*?\})/gi;
            let match = text.match(regex);
            match?.forEach(match => {
                let replacement = match.replace('${', "\' + ").replace('}', " + \'");
                text = text.replace(match, replacement);
            });

            return text;
        };

        let escapeTick = (text: string) => {
            const regex = /([`])(?:(?=(\\?))\2.)*?\1/gi;
            let match = text.match(regex);
            match?.forEach(match => {
                let replacement = match.replace('`', "\\'").replace('`', "\\'");
                text = text.replace(match, replacement);
            });

            return text;
        };

        any = escapeVar(escapeTick(any));
        
        return any;
    }

    export function replaceVar(any: string, context?: any, arg?: any): string {
        const regex = /(\$\{.*?\})/gi;
        let match = any.match(regex);
        match?.forEach(match => {
            let variableName = match.replace(/(\$\{|\})/gi, '');
            let replacement = Attv.eval$(variableName, context, arg);
            any = any.replace(match, replacement);
        });

        return any;
    }
}