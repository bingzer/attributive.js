// namespace Attv {
//     export interface AjaxOptions {
//         url: string;
//         method?: 'post' | 'put' | 'delete' | 'patch' | 'get';
//         callback: (wasSuccessful: boolean, xhr: XMLHttpRequest) => void;
//     }
//     export class DataAjax extends Attv.DataAttribute {
//         constructor() {
//             super('data-ajax');
//         }
//         loadElement(element: HTMLElement): boolean {
//             let url = element.attr('action') || element.attr('data-url');
//             let method = element.attr('method') || element.attr('data-method');
//             let form = element as HTMLFormElement;
//             form.onsubmit = (ev: Event) => {
//                 let ajaxOptions = {
//                     url: url,
//                     method: method,
//                     callback: (wasSuccessful: boolean, xhr: XMLHttpRequest) => {
//                         if (element.attr('data-bind')) {
//                             let dataBind = Attv.dataAttributes.filter(attv => attv.attributeName === 'data-bind')[0] as Attv.DataBind;
//                             let json = xhr.response;
//                             dataBind.bind(element, json);
//                         }
//                         console.log(wasSuccessful, xhr);
//                     }
//                 }
//                 sendAjax(ajaxOptions);
//                 return false;
//             }
//             return true;
//         }
//     }
//     export function sendAjax(options: AjaxOptions) {
//         let xhr = new XMLHttpRequest();
//         xhr.onreadystatechange = function (e: Event) {
//             let xhr = this as XMLHttpRequest;
//             if (xhr.readyState == 4) {
//                 let wasSuccessful = this.status >= 200 && this.status < 400;
//                 options.callback(wasSuccessful, xhr);
//             }
//         };
//         xhr.onerror = function (e: ProgressEvent<EventTarget>) {
//             options.callback(false, xhr);
//         }
//         xhr.open(options.method, options.url, true);
//         xhr.send();
//     }
// }
// /**
//  * Register to attv
//  */
// Attv.register(() => new Attv.DataAjax());
//# sourceMappingURL=data-ajax.js.map