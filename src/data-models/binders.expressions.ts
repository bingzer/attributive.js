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
        readonly title: string;
        readonly filterFn: (value?: any, context?: any) => string;

        constructor(private propertyName: string) {
            let split = propertyName.split(" as ");
            let prop = this.parsePropertyName((split[0])?.trim());
            this.propertyName = prop.propertyName;
            this.title = this.parseTitle((split[1] || this.propertyName)?.trim());

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
        evaluate(context?: any): string {
            let value = Attv.DataModel.getProperty(this.propertyName, context) || '';
            return this.filterFn(value, context);
        }

        /**
         * Remove (',"") from the title
         * @param title title to clean
         */
        private parseTitle(title: string) {
            if (title.startsWith('(') && title.endsWith(')'))
                title = title.substring(1, title.length - 1);
            if (title.startsWith('\'') && title.endsWith('\''))
                title = title.substring(1, title.length - 1);
            if (title.startsWith('\"') && title.endsWith('\"'))
                title = title.substring(1, title.length - 1);

            return title;
        }

        private parsePropertyName(name: string): { propertyName: string, filterName: string } {
            let split = name.split('|');
            return {
                propertyName: split[0]?.trim(),
                filterName: (split[1] || '')?.trim()
            }
        }
    }
}