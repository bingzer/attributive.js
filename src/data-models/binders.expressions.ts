namespace Attv.Binders {

    /**
     * Array expression with the word 'in'
     */
    export class ArrayExpression {
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
    export class AliasExpression {
        readonly alias: string;
        readonly filterFn: (value?: any, context?: any) => string;

        constructor(public propertyName: string) {
            let split = propertyName.split(" as ");
            let prop = this.parsePropertyName((split[0])?.trim());

            this.propertyName = prop.propertyName;
            this.alias = this.cleanString((split[1] || this.propertyName)?.trim());

            this.filterFn = (value?: any, context?: any) => {
                if (prop.filterName) {
                    try {
                        return Attv.eval$(prop.filterName)(value, context);
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
        evaluate(context?: any): { value: any, filteredValue: any } {
            let value = Attv.DataModel.getProperty(this.propertyName, context) || '';
            let filteredValue = this.filterFn(value, context) || value;

            return {
                value: value,
                filteredValue: filteredValue
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