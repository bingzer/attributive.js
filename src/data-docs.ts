/**
 * Documentation/Help page etc...
 */
namespace Attv.Documentation {
    
    export function showHelp(uniqueIdOrName: string) {
        let attribute = Attv.attributes.filter(att => att.uniqueId == uniqueIdOrName || att.name === uniqueIdOrName)[0];
        
        console.log(attribute);
    }
}