var Attv,__extends=this&&this.__extends||function(){var r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)};return function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}}();!function(i){var n,t,a,e,r=(n=i.Attribute,__extends(u,n),u.prototype.getUrl=function(t){var e,n=this.getValue(t),r=n.getRaw(t),a=n.resolver.resolve(h.UniqueId).getMethod(t);return"get"===a&&(e=n.resolver.resolve(L.UniqueId).getData(t),r=i.Ajax.buildUrl({url:r,method:a,data:e})),n.resolver.resolve(g.UniqueId).useCache(t)||(r.contains("?")?r+="&_="+Date.now():r+="?_="+Date.now()),r},u.UniqueId="DataUrl",u);function u(t){var e=n.call(this,u.UniqueId,t)||this;return e.dependency.requires.push(h.UniqueId,L.UniqueId,g.UniqueId),e}function o(t){return a.call(this,void 0,t)||this}i.DataUrl=r,t=i.DataUrl||(i.DataUrl={}),a=i.Attribute.Value,__extends(o,a),o.prototype.getRaw=function(t){var e,n,r=a.prototype.getRaw.call(this,t);return!r&&null!==(e=null==t?void 0:t.tagName)&&void 0!==e&&e.equalsIgnoreCase("form")&&(r=t.attvAttr("action")),!r&&null!==(n=null==t?void 0:t.tagName)&&void 0!==n&&n.equalsIgnoreCase("a")&&(r=t.attvAttr("href")),r},e=o,t.DefaultValue=e;var l,s,d,c,h=(l=i.Attribute,__extends(v,l),v.prototype.getMethod=function(t){return this.getValue(t).getRaw(t)},v.UniqueId="DataMethod",v.DefaultMethod="get",v);function v(t){return l.call(this,v.UniqueId,t)||this}function f(t){return d.call(this,void 0,t)||this}i.DataMethod=h,s=h=i.DataMethod||(i.DataMethod={}),d=i.Attribute.Value,__extends(f,d),f.prototype.getRaw=function(t){var e,n=d.prototype.getRaw.call(this,t);return!n&&null!==(e=null==t?void 0:t.tagName)&&void 0!==e&&e.equalsIgnoreCase("form")&&(n=t.attvAttr("method")),n=n||s.DefaultMethod},c=f,s.DefaultValue=c;var p,g=(p=i.Attribute,__extends(A,p),A.prototype.useCache=function(t){var e=this.getValue(t).getRaw(t);return!(!i.isUndefined(e)&&null!==e)||"true"===e},A.UniqueId="DataCache",A);function A(t){return p.call(this,A.UniqueId,t)||this}i.DataCache=g;var D,b=(D=i.Attribute,__extends(w,D),w.prototype.callback=function(t){var e=this.getValue(t).getRaw(t);return i.eval(e)},w.UniqueId="DataCallback",w);function w(t){return D.call(this,w.UniqueId,t)||this}i.DataCallback=b;var y,_=(y=i.Attribute,__extends(I,y),I.prototype.getContent=function(t){return this.getValue(t).getRaw(t)},I.UniqueId="DataContent",I);function I(t){return y.call(this,I.UniqueId,t)||this}i.DataContent=_;var q,U=(q=i.Attribute,__extends(m,q),m.prototype.getTargetElement=function(t){var e=this.getValue(t).getRaw(t);return document.querySelector(e)},m.UniqueId="DataTarget",m);function m(t){return q.call(this,m.UniqueId,t)||this}i.DataTarget=U;var R,C=(R=i.Attribute,__extends(V,R),V.prototype.timeout=function(t,e){var n=parseInt(this.getValue(t).getRaw(t));n?window.setTimeout(e,n):e()},V.UniqueId="DataTimeout",V);function V(t){return R.call(this,V.UniqueId,t)||this}i.DataTimeout=C;var x,S=(x=i.Attribute,__extends(T,x),T.prototype.interval=function(t,e){var n,r=parseInt(this.getValue(t).getRaw(t));r?(n=new T.IntervalTimer(r,e),T.step(n,r)):e()},T.step=function(t,e){null==t.start&&(t.start=e),e-t.start>t.timer&&(t.fn(),t.start=e,T.requestAnimationFrame(t)),T.requestAnimationFrame(t)},T.requestAnimationFrame=function(e){var n=this;window.requestAnimationFrame(function(t){n.step(e,t)})},T.UniqueId="DataInterval",T);function T(t){return x.call(this,T.UniqueId,t)||this}function H(t,e,n){this.timer=t,this.fn=e,this.start=n}i.DataInterval=S,(i.DataInterval||(i.DataInterval={})).IntervalTimer=H;var E,L=(E=i.Attribute,__extends(k,E),k.prototype.getData=function(t){var e=this.getValue(t).getRaw(t);return i.parseJsonOrElse(e)},k.UniqueId="DataData",k);function k(t){return E.call(this,k.UniqueId,t)||this}i.DataData=L;var M,O=(M=i.Attribute,__extends(B,M),B.prototype.getTitle=function(t){return this.getValue(t).getRaw(t)},B.UniqueId="DataTitle",B);function B(t){return M.call(this,B.UniqueId,t)||this}i.DataTitle=O;var j,J=(j=i.Attribute,__extends(N,j),N.prototype.bind=function(t,e){t.attvHtml((null==e?void 0:e.toString())||"")},N.UniqueId="DataBind",N);function N(t){return j.call(this,N.UniqueId,t)||this}i.DataBind=J;var F,P=(F=i.Attribute,__extends(W,F),W.prototype.isEnabled=function(t){var e=this.getValue(t).getRaw(t);return!(null!=e&&e.equalsIgnoreCase("false"))},W.UniqueId="DataEnabled",W);function W(t){return F.call(this,W.UniqueId,t)||this}i.DataEnabled=P;var $,z=($=i.Attribute,__extends(G,$),G.prototype.isActive=function(t){return"true"===this.getValue(t).getRaw(t)},G.prototype.setActive=function(t,e){t.attvAttr(this,e)},G.UniqueId="DataActive",G);function G(t){return $.call(this,G.UniqueId,t)||this}i.DataActive=z;var K,Q=(K=i.Attribute,__extends(X,K),X.prototype.getRoute=function(t){return this.getValue(t).getRaw(t)},X.prototype.getLocationRoute=function(){return this.cleanHash(window.location.hash)},X.prototype.appendHash=function(){for(var t,e=this,n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];var a=null===(t=null==n?void 0:n.map(function(t){return e.cleanHash(t)}))||void 0===t?void 0:t.join("/");return this.cleanHash(a)},X.prototype.setRoute=function(t){i.isUndefined(t)||(window.location.hash=this.cleanHash(t))},X.prototype.getHash=function(t){return null!=t&&t.startsWith("#")||(t="#"+t),t},X.prototype.matches=function(t){t=this.cleanHash(t);var e=this.getLocationRoute();return!!e.startsWith(t)&&(e===t||"/"===e.substr(e.indexOf(t)+t.length,1))},X.prototype.cleanHash=function(t){var e;return null===(e=null==t?void 0:t.replace("#",""))||void 0===e?void 0:e.replace(/\/\//,"/")},X.UniqueId="DataRoute",X);function X(t){return K.call(this,X.UniqueId,t)||this}i.DataRoute=Q}(Attv=Attv||{}),Attv.loader.pre.push(function(){Attv.registerAttribute("data-url",function(t){return new Attv.DataUrl(t)},function(t,e){e.push(new Attv.DataUrl.DefaultValue(t))}),Attv.registerAttribute("data-method",function(t){return new Attv.DataMethod(t)},function(t,e){e.push(new Attv.DataMethod.DefaultValue(t))}),Attv.registerAttribute("data-callback",function(t){return new Attv.DataCallback(t)}),Attv.registerAttribute("data-target",function(t){return new Attv.DataTarget(t)}),Attv.registerAttribute("data-content",function(t){return new Attv.DataContent(t)}),Attv.registerAttribute("data-timeout",function(t){return new Attv.DataTimeout(t)}),Attv.registerAttribute("data-interval",function(t){return new Attv.DataInterval(t)}),Attv.registerAttribute("data-data",function(t){return new Attv.DataData(t)}),Attv.registerAttribute("data-settings",function(t){return new Attv.DataSettings(t)}),Attv.registerAttribute("data-cache",function(t){return new Attv.DataCache(t)}),Attv.registerAttribute("data-title",function(t){return new Attv.DataTitle(t)}),Attv.registerAttribute("data-bind",function(t){return new Attv.DataBind(t)}),Attv.registerAttribute("data-active",function(t){return new Attv.DataActive(t)}),Attv.registerAttribute("data-enabled",function(t){return new Attv.DataEnabled(t)}),Attv.registerAttribute("data-route",function(t){return new Attv.DataRoute(t)})}),function(n){var r,t,a,i,e,u,o=(r=n.Attribute,__extends(l,r),l.UniqueId="DataLoading",l);function l(t){var e=r.call(this,l.UniqueId,t,!0)||this;return e.isStrict=!0,e}function s(t,e){return a.call(this,t,e)||this}n.DataLoading=o,t=n.DataLoading||(n.DataLoading={}),a=n.Attribute.Value,__extends(s,a),s.prototype.loadElement=function(e){return this.loadSettings(e,function(t){t.outerColor=t.outerColor||n.DataLoading.SpinnerSettings.DefaultOuterColor,t.innerColor=t.innerColor||n.DataLoading.SpinnerSettings.DefaultInnerColor,t.width=t.width||n.DataLoading.SpinnerSettings.DefaultWidth,t.height=t.height||n.DataLoading.SpinnerSettings.DefaultHeight,t.style=i.getStyle(t),e.style.borderColor=t.outerColor,e.style.borderTopColor=t.innerColor,e.style.height=t.width,e.style.width=t.height})},u=s,t.DefaultAttributeValue=u,(e=i=t.SpinnerSettings||(t.SpinnerSettings={})).DefaultOuterColor="#c0c0c0",e.DefaultInnerColor="#000000",e.DefaultWidth="25px",e.DefaultHeight="25px",e.getStyle=function(t){return"\n[data-loading='spinner'],\n[data-loading='default'] {\n    display: inline-block;\n    width: "+t.width+";\n    height: "+t.height+";\n    border: 3px solid "+t.outerColor+";\n    border-radius: 50%;\n    border-top-color: "+t.innerColor+";\n    animation: spin 1s ease-in-out infinite;\n    -webkit-animation: spin 1s ease-in-out infinite;\n}\n\n@keyframes spin {\n    to { -webkit-transform: rotate(360deg); }\n}\n@-webkit-keyframes spin {\n    to { -webkit-transform: rotate(360deg); }\n}\n"}}(Attv=Attv||{}),Attv.loader.pre.push(function(){Attv.registerAttribute("data-loading",function(t){return new Attv.DataLoading(t)},function(t,e){e.push(new Attv.DataLoading.DefaultAttributeValue(Attv.configuration.defaultTag,t))})}),function(o){var e,t=(e=o.Attribute,__extends(n,e),n.prototype.render=function(t,e,n,r){return(r=r||this.getValue(n)).render(t,e)},n.UniqueId="DataRenderer",n);function n(t){return e.call(this,n.UniqueId,t)||this}o.DataRenderer=t,function(t){var n,e=(n=o.Attribute.Value,__extends(r,n),r.prototype.loadElement=function(t){return!0},r.prototype.render=function(t,e,n){return t},r);function r(t,e){return n.call(this,t,e)||this}t.DefaultValue=e;var a,i=(__extends(u,a=e),u.prototype.loadElement=function(t){return!0},u.prototype.render=function(t,e){e=o.parseJsonOrElse(e);var n=o.createHTMLElement(t),r=o.createHTMLElement("");return this.bind(r,n,e),r.attvHtml()},u.prototype.bind=function(t,e,n){for(var r=e.querySelectorAll(this.dataBind.toString()),a=0;a<r.length;a++){var i=r[a],u=i.attvAttr(this.dataBind),o=this.getPropertyValue(u,n);if(Array.isArray(o)){var l=o,s=i.parentElement;i.remove();for(var d=0;d<l.length;d++){var c=i.cloneNode(!0);this.bind(s,c,l[d])}}else this.dataBind.bind(i,o),t.append(e)}},u.prototype.getPropertyValue=function(t,e){var n=e;if(!o.isUndefined(e)){if("$"===t||"$root"===t)n=e;else{if("$json"===t)return n=JSON.stringify(n);for(var r=t.split("."),a=0;a<r.length;a++)try{n=n[r[a]]}catch(t){}}return o.parseJsonOrElse(n)}},u);function u(t,e){void 0===t&&(t="json2html");var n=a.call(this,t,e)||this;return n.resolver.requires.push(o.DataBind.UniqueId),n.dataBind=n.resolver.resolve(o.DataBind.UniqueId),n}t.Json2HtmlValue=i}(o.DataRenderer||(o.DataRenderer={}))}(Attv=Attv||{}),Attv.loader.pre.push(function(){Attv.registerAttribute("data-renderer",function(t){return new Attv.DataRenderer(t)},function(t,e){e.push(new Attv.DataRenderer.DefaultValue(Attv.configuration.defaultTag,t)),e.push(new Attv.DataRenderer.Json2HtmlValue("json2Html",t))})});