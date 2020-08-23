// namespace Attv {
//     export class DataBind extends Attv.DataAttribute {    
//         constructor() {
//             super('data-bind');
//         }
//         loadElement(element: HTMLElement): boolean {
//             let templateId = element.attr('data-bind');
//             let templateElement = element.querySelector(templateId);
//             templateElement.attr('data-template', templateElement.innerHTML);
//             templateElement.innerHTML = '';
//             return true;
//         }
//         bind(element: HTMLElement, json: any) {
//             if (Attv.isString(json)) {
//                 json = Attv.parseJsonOrElse(json);
//             }
//             if (element.attr('data-bind')) {
//                 element = element.querySelector(element.attr('data-bind'));
//             }
//             let templateHtml = element.attr('data-template');
//             let template = document.createElement('div');
//             template.innerHTML = templateHtml;
//             element.innerHTML = '';
//             this.bindElement(element, template, json);
//         }
//         private bindElement(element: HTMLElement, template: HTMLElement, any: any) {
//             if (any instanceof Array) {
//                 element.innerHTML = '';
//                 let array = any as [];
//                 // look for data-bind-for
//                 for (var i = 0 ; i < array.length; i++) {
//                     let targetElement = template.querySelector('[data-bind-for]');
//                     if (!targetElement && template.attr('data-bind-for')) {
//                         targetElement = template;
//                     }
//                     if (targetElement) {
//                         let forEachBind = targetElement.cloneNode(true) as HTMLElement;
//                         this.bindElement(element, forEachBind, array[i]);
//                     } else {
//                         throw new Error("expecting an array");
//                     }
//                 }
//             } else {
//                 let dataBindProperties = template.querySelectorAll('[data-bind-property]');
//                 for (var i = 0; i < dataBindProperties.length; i++) {
//                     let propertyElement = dataBindProperties[i] as HTMLElement;
//                     if (propertyElement.closest('[data-bind-for]') && propertyElement.closest('[data-bind-for]') !== template){
//                         let childForBind = propertyElement.closest('[data-bind-for]') as HTMLElement;
//                         let childPropertyName = childForBind.attr('data-bind-for');
//                         let childPropertyvalue = this.getPropertyValue(childPropertyName, any);
//                         let childTemplate = childForBind.cloneNode(true) as HTMLElement;
//                         this.bindElement(childForBind, childTemplate, childPropertyvalue);
//                     } else {
//                         let propertyName = propertyElement.attr('data-bind-property');
//                         let propertyValue = this.getPropertyValue(propertyName, any);
//                         propertyElement.innerHTML = propertyValue; // TODO: sanitize?
//                     }
//                 }
//                 element.append(template);
//             }
//         }
//         private getPropertyValue(propertyName: string, any: any) {
//             let propertyValue = any;
//             if (propertyName === '$') {
//                 propertyValue = any;
//             }
//             else if (propertyName === '$json') {
//                 propertyValue = JSON.stringify(propertyValue);
//                 return propertyValue;
//             }
//             else {
//                 let propertyChilds = propertyName.split('.');
//                 for (var j = 0; j < propertyChilds.length; j++) {
//                     propertyValue = propertyValue[propertyChilds[j]];
//                 }
//             }
//             return parseJsonOrElse(propertyValue);
//         }
//     }
// }
// /**
//  * Register to attv
//  */
// Attv.register(() => new Attv.DataBind());
//# sourceMappingURL=data-bind.js.map