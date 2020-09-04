var __extends=this&&this.__extends||function(){var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])})(t,e)};return function(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}(),__spreadArrays=this&&this.__spreadArrays||function(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;for(var n=Array(t),i=0,e=0;e<r;e++)for(var o=arguments[e],a=0,s=o.length;a<s;a++,i++)n[i]=o[a];return n},Attv;(Attv=Attv||{}).version="0.0.1",Element.prototype.attvHtml=function(html){var _a,_b,element=this;if(Attv.isUndefined(html))return element.innerHTML;if(element.innerHTML=html,html)for(var innerHtmlElement=Attv.createHTMLElement(html),scripts=innerHtmlElement.querySelectorAll("script"),i=0;i<scripts.length;i++)null!==(_b=null===(_a=scripts[i].type)||void 0===_a?void 0:_a.toLowerCase())&&void 0!==_b&&_b.contains("javascript")&&eval(scripts[i].text)},HTMLElement.prototype.attvShow=function(){var t=this,e=Attv.parseJsonOrElse(t.attvAttr("data-style"),{});e.display?t.style.display=null==e?void 0:e.display:t.style.display="block"},HTMLElement.prototype.attvHide=function(){var t=this,e=Attv.parseJsonOrElse(t.attvAttr("data-style"),{});"none"!==t.style.display&&(e.display=t.style.display,t.attvAttr("data-style",e)),t.style.display="none"},HTMLElement.prototype.attvAttr=function(t,e){var r,n;t=null===(n=null===(r=null==t?void 0:t.toString())||void 0===r?void 0:r.replace("[",""))||void 0===n?void 0:n.replace("]","");var i=this,o=(null==t?void 0:t.startsWith("data-"))&&t.replace(/^data\-/,"").dashToCamelCase();if(Attv.isUndefined(t)){for(var a={},s=0;s<i.attributes.length;s++){var u=i.attributes[s].name,l=Attv.parseJsonOrElse(i.attributes[s].value);a[u]=l}return a}if("data"!==t)return Attv.isDefined(e)?o?(Attv.isObject(e)&&(e=JSON.stringify(e)),i.dataset[o]=e,this):(i.setAttribute(t,e),i):(e=(e=i.dataset[o])||(i.getAttribute(t)||void 0),Attv.parseJsonOrElse(e));if(Attv.isUndefined(e)){var d=Object.keys(i.dataset),c={};return d.map(function(t){return c[t]=i.dataset[t]}),c}if(!Attv.isObject(e))throw Error("Only object can be assigned to dataset");(d=Object.keys(i.dataset)).forEach(function(t){return delete i.dataset[t]}),Object.keys(e).forEach(function(t){return i.dataset[t]=e[t]})},String.prototype.contains=function(t){return 0<=this.indexOf(t)},String.prototype.startsWith=function(t){return 0==this.indexOf(t)},String.prototype.endsWith=function(t){return-1!==this.indexOf(t,this.length-t.length)},String.prototype.camelCaseToDash=function(){return this.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()},String.prototype.dashToCamelCase=function(){return this.toLowerCase().replace(/-(.)/g,function(t,e){return e.toUpperCase()})},String.prototype.equalsIgnoreCase=function(t){var e=this;return(null==e?void 0:e.toLowerCase())===(null==t?void 0:t.toLowerCase())},function(n){var t;function r(e){return e?n.isString(e)&&(e=n.parseJsonOrElse(e),n.isString(e))?e:Object.keys(e).sort().map(function(t){return window.encodeURIComponent(t)+"="+window.encodeURIComponent(e[t])}).join("&"):""}(t=n.Ajax||(n.Ajax={})).sendAjax=function(r){var t,e=new XMLHttpRequest;if(e.onreadystatechange=function(t){var e;4==this.readyState&&(e=200<=this.status&&this.status<400,null!=r&&r.callback&&null!=r&&r.callback(r,e,this))},e.onerror=function(t){null!=r&&r.callback&&null!=r&&r.callback(r,!1,e)},null!==(t=r.headers)&&void 0!==t&&t.forEach(function(t){return e.setRequestHeader(t.name,t.value)}),n.isUndefined(r.url))throw new Error("url is empty");e.open(r.method,r.url,!0),e.send()},t.buildUrl=function(t){if(!n.isUndefined(t.url)){var e=t.url;return"get"===t.method&&(e+="?"+r(t.data)),e}},t.objectToQuerystring=r}(Attv=Attv||{}),function(i){var t=(o.prototype.registerAttributeValues=function(t){for(var e,r,n,i,o=0;o<t.length;o++)(e=t[o].resolver.requires).push.apply(e,this.dependency.requires),(r=t[o].resolver.uses).push.apply(r,this.dependency.uses),(n=t[o].resolver.internals).push.apply(n,this.dependency.internals);(i=this.values).push.apply(i,t)},o.prototype.exists=function(t){return!(null==t||!t.attvAttr(this.name))},o.prototype.getValue=function(r){var t,n=null==r?void 0:r.attvAttr(this.name),e=this.values.filter(function(t){var e;return null===(e=t.getRaw(r))||void 0===e?void 0:e.equalsIgnoreCase(n)})[0];return!e&&this.isStrict&&i.log("fatal",this+"='"+(n||"")+"' is not valid",r),(e=(e=e||this.values.filter(function(t){var e;return null===(e=t.getRaw(r))||void 0===e?void 0:e.equalsIgnoreCase(i.configuration.defaultTag)})[0])||this.values[0])||(t=null==r?void 0:r.attvAttr(this.name),e=new o.Value(t,this)),e},o.prototype.isElementLoaded=function(t){var e=t.attvAttr(this.loadedName);return"true"===e||!!e},o.prototype.markElementLoaded=function(t,e){return t.attvAttr(this.loadedName,e),e},o.prototype.toString=function(){return"["+this.name+"]"},o);function o(t,e,r){void 0===r&&(r=!1),this.uniqueId=t,this.name=e,this.isAutoLoad=r,this.values=[],this.dependency=new o.Dependency,this.priority=1,this.isStrict=!1,this.loadedName=this.name+"-loaded",this.settingsName=this.name+"-settings",this.dependency.internals.push(i.DataSettings.UniqueId)}i.Attribute=t}(Attv=Attv||{}),function(u){!function(t){var e=(r.prototype.getRaw=function(t){var e;return(null===(e=this.value)||void 0===e?void 0:e.toString())||(null==t?void 0:t.attvAttr(this.attribute.name))},r.prototype.loadElement=function(t){return!0},r.prototype.loadSettings=function(t,e){var r=this.resolver.resolve(u.DataSettings.UniqueId);return this.settings=r.getSettingsForValue(this,t),this.settings&&(e&&e(this.settings),u.Attribute.Settings.commit(t,this.settings)),!0},r.prototype.toString=function(t){return t?"["+this.attribute.name+"]='"+(this.value||"*")+"'":"["+this.attribute.name+"]"+(this.value?"="+this.value:"")},r);function r(t,e,r){void 0===r&&(r=[]),this.value=t,this.attribute=e,this.validators=r,this.resolver=new a(this)}t.Value=e;var n=(i.prototype.allDependencies=function(){return this.requires.concat(this.uses).concat(this.internals)},i);function i(){this.requires=[],this.uses=[],this.internals=[]}t.Dependency=n;var o,a=(__extends(s,o=n),s.prototype.resolve=function(e){var t=u.getAttribute(e);if(this.allDependencies().some(function(t){return t===e})||u.log("warning",(t||e)+" should be declared as the dependant in "+this.attributeValue.attribute+". This is for documentation purposes"),!t)throw new Error((t||e)+" can not be found. Did you register "+(t||e)+"?");return t},s.prototype.addAttribute=function(t,e,r){var n=this.resolve(t);e.attvAttr(n.name,r)},s);function s(t){var e=o.call(this)||this;return e.attributeValue=t,e}t.Resolver=a}(u.Attribute||(u.Attribute={}))}(Attv=Attv||{}),function(s){var t,e,u;t=s.Attribute||(s.Attribute={}),e=t.Settings||(t.Settings={}),u=["attributeValue","override","style","styleUrls","jsUrls"],e.commit=function(t,o){var e,r,a=!0;o.style&&(e="style-"+o.attributeValue.attribute.settingsName,r=document.querySelector("style#"+e),a=o.override||!r,r||((r=s.createHTMLElement("<style>")).id=e,document.head.append(r)),a&&(r.innerHTML=o.style)),o.styleUrls&&o.styleUrls.forEach(function(t){var e,r,n="link-"+t.name+"-"+o.attributeValue.attribute.settingsName,i=document.querySelector("link#"+n);a=o.override||!i,i||(i=s.createHTMLElement("<link>"),document.head.append(i)),a&&(i.id=n,i.rel="stylesheet",i.href=t.url,i.integrity=null===(e=t.options)||void 0===e?void 0:e.integrity,i.crossOrigin=null===(r=t.options)||void 0===r?void 0:r.crossorigin)}),o.jsUrls&&o.jsUrls.forEach(function(t){var e,r,n="script-"+t.name+"-"+o.attributeValue.attribute.settingsName,i=document.querySelector("script#"+n);a=o.override||!i,i||(i=s.createHTMLElement("<script>"),document.body.append(i)),a&&(i.id=n,i.src=t.url,i.integrity=null===(e=t.options)||void 0===e?void 0:e.integrity,i.crossOrigin=null===(r=t.options)||void 0===r?void 0:r.crossorigin,i.onload=function(){return s.loadElements()})});var n=Object.keys(o).filter(function(e){return!u.some(function(t){return t.equalsIgnoreCase(e)})}),i={};n.forEach(function(t){return i[t]=o[t]}),t.attvAttr(o.attributeValue.attribute.settingsName,i)}}(Attv=Attv||{}),function(i){var e,t=(e=i.Attribute,__extends(r,e),r.prototype.getSettings=function(t){var e=this.getValue(t).getRaw(t);return i.parseJsonOrElse(e,{})},r.prototype.getSettingsForValue=function(t,e){var r=e.attvAttr(t.attribute.settingsName),n=i.parseJsonOrElse(r,{});return n.attributeValue=n.attributeValue||t,n},r.UniqueId="DataSettings",r);function r(t){return e.call(this,r.UniqueId,t)||this}i.DataSettings=t}(Attv=Attv||{}),function(s){!function(t){var e=(r.prototype.validate=function(t,e){for(var r=!0,n=this.requiredAttributeIds.map(function(t){return s.getAttribute(t)}),i=0;i<n.length;i++){var o=n[i],a=o.getValue(e);null!=a&&a.getRaw(e)||s.log("error",t.toString(!0)+" is requiring "+o+" to be present in DOM",e),r=r&&!!o}return r},r);function r(t){this.requiredAttributeIds=t}t.RequiredAttribute=e;var n=(i.prototype.validate=function(t,e){for(var r=!0,n=0;n<this.requiredAttributes.length;n++){var i=this.requiredAttributes[n],o=e.attvAttr(i.name);o.equalsIgnoreCase(i.value)||s.log("error",t.toString(!0)+" is requiring ["+i.name+"]='"+i.value+"' to be present in DOM",e),r=r&&!!o}return r},i);function i(t){this.requiredAttributes=t}t.RequiredAttributeWithValue=n;var o=(a.prototype.validate=function(t,e){for(var r=!1,n=0;n<this.elementTagNames.length;n++){var i=this.elementTagNames[n];if(e.tagName.equalsIgnoreCase(i)){r=!0;break}}return r||s.log("error",t.toString(!0)+" can only be attached to elements ["+this.elementTagNames+"]",e),r},a);function a(t){this.elementTagNames=t}t.RequiredElement=o}(s.Validators||(s.Validators={}))}(Attv=Attv||{}),function(t){var e=(Object.defineProperty(r.prototype,"defaultTag",{get:function(){return"default"},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"logLevels",{get:function(){return["log","warning","error","debug","fatal"]},enumerable:!1,configurable:!0}),r);function r(){this.isDebug=!0,this.isLoggingEnabled=!0}t.DefaultConfiguration=e}(Attv=Attv||{}),function(a){var t;function i(t){var e,r=(null===t||void 0===t?void 0:t.tagName)||t;return(null===(e=a.Dom.htmlTags.filter(function(t){return t.tag.equalsIgnoreCase(r)})[0])||void 0===e?void 0:e.parentTag)||"div"}(t=a.Dom||(a.Dom={})).htmlTags=[{tag:"tr",parentTag:"tbody"},{tag:"th",parentTag:"thead"},{tag:"td",parentTag:"tr"}],t.getParentTag=i,t.createHTMLElement=function(t,e){var r=i(t),n=document.createElement(r);return n.innerHTML=e,n},t.parseDom=function(t){if(a.isString(t)){var e=t,r=void 0;if((o=e.toString()).startsWith("<")&&o.endsWith(">")){var n=o.substring(1,o.length-1);try{r=window.document.createElement(n)}catch(t){}}if(!r){try{a.Dom.domParser||(a.Dom.domParser=new DOMParser);var i=a.Dom.domParser.parseFromString(e,"text/xml"),o=i.firstElementChild.tagName;i.querySelector("parsererror")&&(o="div")}catch(t){}r=a.Dom.createHTMLElement(o,e)}t=r}return t}}(Attv=Attv||{}),function(i){var e=0;function r(t,e){return typeof t===e}i.isUndefined=function(t){return void 0===t},i.isDefined=function(t){return!(void 0===t)},i.isString=function(t){return r(t,"string")},i.isObject=function(t){return r(t,"object")},i.isType=r,i.isEvaluatable=function(t){return(null==t?void 0:t.startsWith("("))&&(null==t?void 0:t.endsWith(")"))},i.eval=function(t){return window.eval(t)},i.navigate=function(t,e){e?window.open(t,e):window.location.href=t},i.createHTMLElement=function(t){return i.Dom.parseDom(t)},i.parseJsonOrElse=function(t,e){var r;i.isString(t)&&(null!=(r=t)&&r.startsWith("{")&&null!=r&&r.endsWith("}")&&(r="("+r+")"),i.isEvaluatable(r)&&(r=i.eval(r)),t=r);try{t=JSON.parse(t)}catch(t){}return t||e},i.generateElementId=function(t){return(t=t.camelCaseToDash())+"-"+ ++e},i.log=function(){for(var t,e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];if(i.configuration.isLoggingEnabled||"fatal"===e[0]){var n=e[0];if(0<=(null===(t=i.configuration.logLevels)||void 0===t?void 0:t.indexOf(n))&&(e=e.splice(1)),"warning"===n)console.warn.apply(console,e);else if("error"===n)console.error.apply(console,e);else{if("fatal"===n)throw console.error.apply(console,e),new(Error.bind.apply(Error,__spreadArrays([void 0],e)));"debug"===n?console.debug.apply(console,e):console.log.apply(console,e)}}},i.onDocumentReady=function(t){document.addEventListener("DOMContentLoaded",t,!1)}}(Attv=Attv||{}),function(u){u.attributes=[],u.loader={init:[],pre:[],post:[]},u.loadElements=function(e){u.isUndefined(e)&&(e=document.querySelector("html")),u.log("debug","Loading element",e),u.attributes.filter(function(t){return t.isAutoLoad}).sort(function(t,e){return t.priority<e.priority?-1:0}).forEach(function(s,t){e.querySelectorAll(""+s).forEach(function(e,t){try{if(s.isElementLoaded(e))return;var r=s.getValue(e);if(!r){var n=e.attvAttr(s.name);return void u.log("warning",s+" does not support "+s+"='"+n+"'",e)}for(var i=!0,o=0;o<r.validators.length;o++)i=r.validators[o].validate(r,e);if(!i)return;var a=r.loadElement(e);a&&s.markElementLoaded(e,a)}catch(t){u.log("error","Unexpected error occurred when loading "+s,t,e)}})})},u.getAttribute=function(e){return u.attributes.filter(function(t){return t.uniqueId==e})[0]}}(Attv=Attv||{}),function(n){var i=[],o=[];n.registerAttribute=function(t,e,r){var n=new a(t,e,r);i.push(n)},n.registerAttributeValue=function(t,e){var r=new s(t,e);o.push(r)},n.unregisterAttribute=function(e){var t=i.filter(function(t){return t.attributeName!==e});i.splice(0,i.length),i.push.apply(i,t)};var a=(t.prototype.register=function(){var e=this.fn(this.attributeName);n.log("debug",""+e,e);var r=[];this.valuesFn&&this.valuesFn(e,r),o.filter(function(t){return t.attributeUniqueId===e.uniqueId}).forEach(function(t){t.register(e,r)});var t=r.reverse();return e.registerAttributeValues(t),0<r.length&&n.log("debug",""+r.map(function(t){return t.toString(!0)}),r),e},t);function t(t,e,r){this.attributeName=t,this.fn=e,this.valuesFn=r}var s=function(t,e){this.attributeUniqueId=t,this.register=e};n.loader.init.push(function(){n.configuration||(n.configuration=new n.DefaultConfiguration)}),n.loader.pre.push(function(){n.log("Attv v."+n.version)}),n.loader.post.push(function(){for(var t=0;t<i.length;t++){var e=i[t].register();n.attributes.push(e)}}),n.loader.post.push(n.loadElements),n.loader.post.push(function(){i=[],o=[]})}(Attv=Attv||{}),Attv.onDocumentReady(function(){for(var t=0;t<Attv.loader.init.length;t++)Attv.loader.init[t]();for(t=0;t<Attv.loader.pre.length;t++)Attv.loader.pre[t]();for(t=0;t<Attv.loader.post.length;t++)Attv.loader.post[t]();Attv.loader.init=[],Attv.loader.pre=[],Attv.loader.post=[]});