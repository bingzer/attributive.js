var __extends=this&&this.__extends||function(){var r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)};return function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}}(),__spreadArrays=this&&this.__spreadArrays||function(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;for(var r=Array(t),i=0,e=0;e<n;e++)for(var o=arguments[e],a=0,s=o.length;a<s;a++,i++)r[i]=o[a];return r},Attv;(Attv=Attv||{}).version="0.0.1",Element.prototype.html=function(html){var _a,_b,element=this;if(Attv.isUndefined(html))return element.innerHTML;if(element.innerHTML=html,html)for(var innerHtmlElement=Attv.createHTMLElement(html),scripts=innerHtmlElement.querySelectorAll("script"),i=0;i<scripts.length;i++)null!==(_b=null===(_a=scripts[i].type)||void 0===_a?void 0:_a.toLowerCase())&&void 0!==_b&&_b.contains("javascript")&&eval(scripts[i].text)},HTMLElement.prototype.show=function(){var t=this,e=Attv.parseJsonOrElse(t.attr("data-style"))||{};t.style.display=e.display?null===e?void 0:e.display:"block"},HTMLElement.prototype.hide=function(){var t=this,e=Attv.parseJsonOrElse(t.attr("data-style"))||{};"none"!==t.style.display&&(e.display=t.style.display,t.attr("data-style",e)),t.style.display="none"},HTMLElement.prototype.attr=function(t,e){var n,r;t=null===(r=null===(n=null==t?void 0:t.toString())||void 0===n?void 0:n.replace("[",""))||void 0===r?void 0:r.replace("]","");var i=this,o=(null==t?void 0:t.startsWith("data-"))&&t.replace(/^data\-/,"").dashToCamelCase();if(Attv.isUndefined(t)){for(var a={},s=0;s<i.attributes.length;s++){var u=i.attributes[s].name,l=Attv.parseJsonOrElse(i.attributes[s].value);a[u]=l}return a}if("data"!==t)return Attv.isDefined(e)?o?(Attv.isObject(e)&&(e=JSON.stringify(e)),i.dataset[o]=e,this):(i.setAttribute(t,e),i):(e=(e=i.dataset[o])||(i.getAttribute(t)||void 0),Attv.parseJsonOrElse(e));if(Attv.isUndefined(e)){var d=Object.keys(i.dataset),c={};return d.map(function(t){return c[t]=i.dataset[t]}),c}if(!Attv.isObject(e))throw Error("Only object can be assigned to dataset");(d=Object.keys(i.dataset)).forEach(function(t){return delete i.dataset[t]}),Object.keys(e).forEach(function(t){return i.dataset[t]=e[t]})},String.prototype.contains=function(t){return 0<=this.indexOf(t)},String.prototype.startsWith=function(t){return 0==this.indexOf(t)},String.prototype.endsWith=function(t){return-1!==this.indexOf(t,this.length-t.length)},String.prototype.camelCaseToDash=function(){return this.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()},String.prototype.dashToCamelCase=function(){return this.toLowerCase().replace(/-(.)/g,function(t,e){return e.toUpperCase()})},String.prototype.equalsIgnoreCase=function(t){var e=this;return(null==e?void 0:e.toLowerCase())===(null==t?void 0:t.toLowerCase())},function(r){var t;function n(e){return e?r.isString(e)&&(e=r.parseJsonOrElse(e),r.isString(e))?e:Object.keys(e).sort().map(function(t){return window.encodeURIComponent(t)+"="+window.encodeURIComponent(e[t])}).join("&"):""}(t=r.Ajax||(r.Ajax={})).sendAjax=function(n){var t,e=new XMLHttpRequest;if(e.onreadystatechange=function(t){var e;4==this.readyState&&(e=200<=this.status&&this.status<400,null!=n&&n._internalCallback(n,e,this))},e.onerror=function(t){null!=n&&n._internalCallback(n,!1,e)},null!==(t=n.headers)&&void 0!==t&&t.forEach(function(t){return e.setRequestHeader(t.name,t.value)}),r.isUndefined(n.url))throw new Error("url is empty");e.open(n.method,n.url,!0),e.send()},t.buildUrl=function(t){if(!r.isUndefined(t.url)){var e=t.url;return"get"===t.method&&(e+="?"+n(t.data)),e}},t.objectToQuerystring=n}(Attv=Attv||{}),function(i){var t=(o.prototype.registerAttributeValues=function(t){for(var e,n,r,i,o=0;o<t.length;o++)(e=t[o].resolver.requires).push.apply(e,this.dependency.requires),(n=t[o].resolver.uses).push.apply(n,this.dependency.uses),(r=t[o].resolver.internals).push.apply(r,this.dependency.internals);(i=this.values).push.apply(i,t)},o.prototype.exists=function(t){return!(null==t||!t.attr(this.name))},o.prototype.getValue=function(n){var t,r=null==n?void 0:n.attr(this.name),e=this.values.filter(function(t){var e;return null===(e=t.getRaw(n))||void 0===e?void 0:e.equalsIgnoreCase(r)})[0];return!e&&this.isStrict&&i.log("fatal",this+"='"+(r||"")+"' is not valid",n),(e=(e=e||this.values.filter(function(t){var e;return null===(e=t.getRaw(n))||void 0===e?void 0:e.equalsIgnoreCase(i.configuration.defaultTag)})[0])||this.values[0])||(t=null==n?void 0:n.attr(this.name),e=new o.Value(t,this)),e},o.prototype.isElementLoaded=function(t){var e=t.attr(this.loadedName);return"true"===e||!!e},o.prototype.markElementLoaded=function(t,e){t.attr(this.loadedName,e)},o.prototype.toString=function(){return"["+this.name+"]"},o);function o(t,e,n){void 0===n&&(n=!1),this.uniqueId=t,this.name=e,this.isAutoLoad=n,this.values=[],this.dependency=new o.Dependency,this.isStrict=!1,this.loadedName=this.name+"-loaded",this.settingsName=this.name+"-settings",this.dependency.internals.push(i.DataSettings.UniqueId)}i.Attribute=t}(Attv=Attv||{}),function(u){!function(t){var e=(n.prototype.getRaw=function(t){var e;return(null===(e=this.value)||void 0===e?void 0:e.toString())||(null==t?void 0:t.attr(this.attribute.name))},n.prototype.loadElement=function(t){return!0},n.prototype.loadSettings=function(t,e){var n=this.resolver.resolve(u.DataSettings.UniqueId);return this.settings=n.getSettingsForValue(this,t),this.settings&&(e&&e(this.settings),u.Attribute.Settings.commit(this.settings)),!0},n.prototype.toString=function(t){return t?"["+this.attribute.name+"]='"+(this.value||"*")+"'":"["+this.attribute.name+"]"+(this.value?"="+this.value:"")},n);function n(t,e,n){void 0===n&&(n=[]),this.value=t,this.attribute=e,this.validators=n,this.resolver=new a(this)}t.Value=e;var r=(i.prototype.allDependencies=function(){return this.requires.concat(this.uses).concat(this.internals)},i);function i(){this.requires=[],this.uses=[],this.internals=[]}t.Dependency=r;var o,a=(__extends(s,o=r),s.prototype.resolve=function(e){var t=u.getAttribute(e);if(this.allDependencies().some(function(t){return t===e})||u.log("warning",(t||e)+" should be declared as the dependant in "+this.attributeValue.attribute+". This is for documentation purposes"),!t)throw new Error((t||e)+" can not be found. Did you register "+(t||e)+"?");return t},s.prototype.addAttribute=function(t,e,n){var r=this.resolve(t);e.attr(r.name,n)},s);function s(t){var e=o.call(this)||this;return e.attributeValue=t,e}t.Resolver=a}(u.Attribute||(u.Attribute={}))}(Attv=Attv||{}),function(s){var t;((t=s.Attribute||(s.Attribute={})).Settings||(t.Settings={})).commit=function(o){var t,e,a=!0;o.style&&(t="style-"+o.attributeValue.attribute.settingsName,e=document.querySelector("style#"+t),a=o.override||!e,e||((e=s.createHTMLElement("<style>")).id=t,document.head.append(e)),a&&(e.innerHTML=o.style)),o.styleUrls&&o.styleUrls.forEach(function(t){var e,n,r="link-"+o.attributeValue.attribute.settingsName,i=document.querySelector("link#"+r);a=o.override||!i,i||(i=s.createHTMLElement("<link>"),document.head.append(i)),a&&(i.id=r,i.rel="stylesheet",i.href=t.url,i.integrity=null===(e=t.options)||void 0===e?void 0:e.integrity,i.crossOrigin=null===(n=t.options)||void 0===n?void 0:n.crossorigin)}),o.jsUrls&&o.jsUrls.forEach(function(t){var e,n,r="script-"+o.attributeValue.attribute.settingsName,i=document.querySelector("script#"+r);a=o.override||!i,i||(i=s.createHTMLElement("<script>"),document.body.append(i)),a&&(i.id=r,i.src=t.url,i.integrity=null===(e=t.options)||void 0===e?void 0:e.integrity,i.crossOrigin=null===(n=t.options)||void 0===n?void 0:n.crossorigin)})}}(Attv=Attv||{}),function(e){var n,t=(n=e.Attribute,__extends(i,n),i.prototype.getSettings=function(t){var e=this.getValue(t).getRaw(t);return i.parseSettings(e)},i.prototype.getSettingsForValue=function(t,e){var n=e.attr(t.attribute.settingsName),r=i.parseSettings(n);return r.attributeValue=r.attributeValue||t,r},i.parseSettings=function(t){return null!=t&&t.startsWith("{")&&null!=t&&t.endsWith("}")&&(t="("+t+")"),e.isEvaluatable(t)&&(t=e.eval(t)),e.parseJsonOrElse(t)||{}},i.UniqueId="DataSettings",i);function i(t){return n.call(this,i.UniqueId,t)||this}e.DataSettings=t}(Attv=Attv||{}),function(s){!function(t){var e=(n.prototype.validate=function(t,e){for(var n=!0,r=this.requiredAttributeIds.map(function(t){return s.getAttribute(t)}),i=0;i<r.length;i++){var o=r[i],a=o.getValue(e);null!=a&&a.getRaw(e)||s.log("error",t+" is requiring "+o+" to be present in DOM",e),n=n&&!!o}return n},n);function n(t){this.requiredAttributeIds=t}t.RequiredAttribute=e;var r=(i.prototype.validate=function(t,e){for(var n=!0,r=0;r<this.requiredAttributes.length;r++){var i=this.requiredAttributes[r],o=e.attr(i.name);o.equalsIgnoreCase(i.value)||s.log("error",t+" is requiring ["+i.name+"]='"+i.value+"' to be present in DOM",e),n=n&&!!o}return n},i);function i(t){this.requiredAttributes=t}t.RequiredAttributeWithValue=r;var o=(a.prototype.validate=function(t,e){for(var n=!1,r=0;r<this.elementTagNames.length;r++){var i=this.elementTagNames[r];if(e.tagName.equalsIgnoreCase(i)){n=!0;break}}return n||s.log("error",t+" can only be attached to elements ["+this.elementTagNames+"]",e),n},a);function a(t){this.elementTagNames=t}t.RequiredElement=o}(s.Validators||(s.Validators={}))}(Attv=Attv||{}),function(t){var e=(Object.defineProperty(n.prototype,"defaultTag",{get:function(){return"default"},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"logLevels",{get:function(){return["log","warning","error","debug","fatal"]},enumerable:!1,configurable:!0}),n);function n(){this.isDebug=!0,this.isLoggingEnabled=!0}t.DefaultConfiguration=e}(Attv=Attv||{}),function(a){var t;function i(t){var e,n=(null===t||void 0===t?void 0:t.tagName)||t;return(null===(e=a.Dom.htmlTags.filter(function(t){return t.tag.equalsIgnoreCase(n)})[0])||void 0===e?void 0:e.parentTag)||"div"}(t=a.Dom||(a.Dom={})).htmlTags=[{tag:"tr",parentTag:"tbody"},{tag:"th",parentTag:"thead"},{tag:"td",parentTag:"tr"}],t.getParentTag=i,t.createHTMLElement=function(t,e){var n=i(t),r=document.createElement(n);return r.innerHTML=e,r},t.parseDom=function(t){if(a.isString(t)){var e=t,n=void 0;if((o=e.toString()).startsWith("<")&&o.endsWith(">")){var r=o.substring(1,o.length-1);try{n=window.document.createElement(r)}catch(t){}}if(!n){try{a.Dom.domParser||(a.Dom.domParser=new DOMParser);var i=a.Dom.domParser.parseFromString(e,"text/xml"),o=i.firstElementChild.tagName;i.querySelector("parsererror")&&(o="div")}catch(t){}n=a.Dom.createHTMLElement(o,e)}t=n}return t}}(Attv=Attv||{}),function(i){var e=0;function n(t,e){return typeof t===e}i.isUndefined=function(t){return void 0===t},i.isDefined=function(t){return!(void 0===t)},i.isString=function(t){return n(t,"string")},i.isObject=function(t){return n(t,"object")},i.isType=n,i.isEvaluatable=function(t){return(null==t?void 0:t.startsWith("("))&&(null==t?void 0:t.endsWith(")"))},i.eval=function(t){return window.eval(t)},i.navigate=function(t,e){e?window.open(t,e):window.location.href=t},i.createHTMLElement=function(t){return i.Dom.parseDom(t)},i.parseJsonOrElse=function(t){try{t=JSON.parse(t)}catch(t){}return t},i.generateElementId=function(t){return(t=t.camelCaseToDash())+"-"+ ++e},i.log=function(){for(var t,e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];if(i.configuration.isLoggingEnabled||"fatal"===e[0]){var r=e[0];if(0<=(null===(t=i.configuration.logLevels)||void 0===t?void 0:t.indexOf(r))&&(e=e.splice(1)),"warning"===r)console.warn.apply(console,e);else if("error"===r)console.error.apply(console,e);else{if("fatal"===r)throw console.error.apply(console,e),new(Error.bind.apply(Error,__spreadArrays([void 0],e)));"debug"===r?console.debug.apply(console,e):console.log.apply(console,e)}}},i.onDocumentReady=function(t){document.addEventListener("DOMContentLoaded",t,!1)}}(Attv=Attv||{}),function(u){u.attributes=[],u.loader={init:[],pre:[],post:[]},u.loadElements=function(e){u.isUndefined(e)&&(e=document.querySelector("html")),u.log("debug","Loading element",e),u.attributes.filter(function(t){return t.isAutoLoad}).forEach(function(s,t){e.querySelectorAll(""+s).forEach(function(e,t){try{if(s.isElementLoaded(e))return;var n=s.getValue(e);if(!n){var r=e.attr(s.name);return void u.log("warning",s+" does not support "+s+"='"+r+"'",e)}for(var i=!0,o=0;o<n.validators.length;o++)i=n.validators[o].validate(n,e);if(!i)return;var a=n.loadElement(e);a&&s.markElementLoaded(e,a)}catch(t){u.log("error","Unexpected error occurred when loading "+s,t,e)}})})},u.getAttribute=function(e){return u.attributes.filter(function(t){return t.uniqueId==e})[0]}}(Attv=Attv||{}),function(r){var i=[],o=[];r.registerAttribute=function(t,e,n){var r=new a(t,e,n);i.push(r)},r.registerAttributeValue=function(t,e){var n=new s(t,e);o.push(n)},r.unregisterAttribute=function(e){var t=i.filter(function(t){return t.attributeName!==e});i.splice(0,i.length),i.push.apply(i,t)};var a=(t.prototype.register=function(){var e=this.fn(this.attributeName);r.log("debug",""+e,e);var n=[];return this.valuesFn&&this.valuesFn(e,n),o.filter(function(t){return t.attributeUniqueId===e.uniqueId}).forEach(function(t){t.register(e,n)}),e.registerAttributeValues(n),0<n.length&&r.log("debug",""+n.map(function(t){return t.toString(!0)}),n),e},t);function t(t,e,n){this.attributeName=t,this.fn=e,this.valuesFn=n}var s=function(t,e){this.attributeUniqueId=t,this.register=e};r.loader.init.push(function(){r.configuration||(r.configuration=new r.DefaultConfiguration)}),r.loader.pre.push(function(){r.log("Attv v."+r.version)}),r.loader.post.push(function(){for(var t=0;t<i.length;t++){var e=i[t].register();r.attributes.push(e)}}),r.loader.post.push(r.loadElements),r.loader.post.push(function(){i=[],o=[]})}(Attv=Attv||{}),Attv.onDocumentReady(function(){for(var t=0;t<Attv.loader.init.length;t++)Attv.loader.init[t]();for(t=0;t<Attv.loader.pre.length;t++)Attv.loader.pre[t]();for(t=0;t<Attv.loader.post.length;t++)Attv.loader.post[t]();Attv.loader.init=[],Attv.loader.pre=[],Attv.loader.post=[]});