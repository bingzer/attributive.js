namespace Attv.Binders {
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
        evaluate(context?: any, arg?: any): any;
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
     * List of available filters
     */
    export const filters: object = {
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
        evaluate<TAny>(context?: any, arg?: any): TAny[] {
            let evaluatedValue = Binders.evaluateExpression(this, context, arg);

            return evaluatedValue || [];
        }
    }

    /**
     * Alias expression with the word 'as'
     */
    export class AliasExpression implements Expression {
        readonly alias: string;
        readonly propertyName: string;
        readonly filterFn: (value?: any, context?: any, arg?: any) => string;

        constructor(public readonly expression: string) {
            let split = expression?.split(" as ");
            let prop = this.parsePropertyName((split[0])?.trim());

            this.propertyName = prop.propertyName;
            this.alias = this.cleanString((split[1] || this.propertyName)?.trim());

            this.filterFn = (value?: any, context?: any, arg?: any) => {
                if (prop.filterName) {
                    let result = undefined;

                    Attv.concatObject(filters, arg || {}, false, () => {
                        result = Attv.eval$(prop.filterName, context, arg)(value, context, arg);
                    });
                    
                    return result;
                }
                    
                return value;
            }
        }

        /**
         * Evaluate propertyName against context
         * @param context the context object
         */
        evaluate(context?: any, arg?: any): AliasValue {
            let value: any;
            let filteredValue: any;
            
            if (!this.propertyName) {
                value = context;
                filteredValue = context;
            }
            else {
                value = Binders.evaluateExpression(this, context, arg);
                filteredValue = this.filterFn(value, context, arg) || value;
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
            evaluatedValue = Attv.DataModel.getProperty(expression.propertyName, context);
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
}