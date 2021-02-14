namespace Attv.Binders {
    /**
     * An expression
     */
    export interface Expression {

        /**
         * The property name
         */
        readonly propertyName: string;

        /**
         * Evalue this expression and returns the 'result'
         * @param context context object (optional) to evaluate this expression against
         */
        evaluate(context?: any): any;
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
     * Array expression with the word 'in'
     */
    export class ArrayExpression implements Expression {
        readonly propertyName: string;
        readonly arrayName: string

        constructor(public readonly expression: string){
            let split = expression.split(" in ");
            this.propertyName = split[0]?.trim(),
            this.arrayName = split[1]?.trim();
        }

        /**
         * Evaluate propertyName against context
         * @param context the context object
         */
        evaluate<TAny>(context?: any): TAny[] {
            return Attv.DataModel.getProperty(this.arrayName, context) || [];
        }
    }

    /**
     * Alias expression with the word 'as'
     */
    export class AliasExpression implements Expression {
        readonly alias: string;
        readonly filterFn: (value?: any, context?: any) => string;

        constructor(public propertyName: string) {
            let split = propertyName?.split(" as ");
            let prop = this.parsePropertyName((split[0])?.trim());

            this.propertyName = prop.propertyName;
            this.alias = this.cleanString((split[1] || this.propertyName)?.trim());

            this.filterFn = (value?: any, context?: any) => {
                if (prop.filterName) {
                    try {
                        return Attv.eval$(prop.filterName, context)(value, context);
                    } catch {
                        // ignore
                    }
                }
                    
                return value;
            }
        }

        /**
         * Evaluate propertyName against context
         * @param context the context object
         */
        evaluate(context?: any): AliasValue {
            let value: any;
            let filteredValue: any;
            
            if (!this.propertyName) {
                value = context;
                filteredValue = context;
            }
            else {
                value = Attv.DataModel.getProperty(this.propertyName, context) || '';
                filteredValue = this.filterFn(value, context) || value;
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
}