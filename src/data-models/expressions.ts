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

        constructor(private propertyName: string) {
            let split = propertyName.split(" as ");
            this.propertyName = (split[0])?.trim();
            this.title = this.cleanTitle((split[1] || this.propertyName)?.trim());
        }

        /**
         * Evaluate propertyName against context
         * @param context the context object
         */
        evaluate(context: any): string {
            return Attv.DataModel.getProperty(this.propertyName, context) || '';
        }

        /**
         * Remove (',"") from the title
         * @param title title to clean
         */
        private cleanTitle(title: string) {
            if (title.startsWith('(') && title.endsWith(')'))
                title = title.substring(1, title.length - 1);
            if (title.startsWith('\'') && title.endsWith('\''))
                title = title.substring(1, title.length - 1);
            if (title.startsWith('\"') && title.endsWith('\"'))
                title = title.substring(1, title.length - 1);

            return title;
        }
    }
}