/**
 * Documentation/Help page etc...
 */
namespace Attv.Docs {
    export interface Writer {
        write(text: string, data?: string): void;
        clear(): void;
    }

    export class ConsoleWriter implements Writer {
        write(text: string, data?: string): void {
            console.log(text);
        }

        clear(): void {
            console.clear();
        }
    }

    export class HtmlWriter implements Writer {

        constructor (private htmlElement: HTMLElement = Attv.createHTMLElement('<div>')) {
            // do nothing
            htmlElement.className = "attv-docs"
        }

        write(text: string, data?: string): void {
            let p = Attv.createHTMLElement('<p>');
            p.className = "attv-" + data;
            p.innerHTML = text;

            this.htmlElement.append(p);
        }

        clear(): void {
            this.htmlElement.innerHTML = '';
        }

    }

    let consoleWriter = new ConsoleWriter();
    
    export function showHelp(uniqueIdOrName: string, writer: Attv.Docs.Writer = consoleWriter) {
        let attribute = Attv.attributes.filter(att => att.uniqueId == uniqueIdOrName || att.name === uniqueIdOrName)[0];

        writer.clear();
        writer.write(`Documentation for ${attribute.toString()}. ${attribute.description || ''}`, "attribute");
        attribute.values.forEach(val => {
            writer.write(`${val.toString(true)}`, "attribute-value");
        });

        if (attribute.values?.length === 0 && !attribute.isStrict) {
            writer.write(`${attribute.toString()}='*'`);
        }
    }


}