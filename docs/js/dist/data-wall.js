var Attv,__extends=this&&this.__extends||function(){var a=function(t,e){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)};return function(t,e){function n(){this.constructor=t}a(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}}();!function(i){var n,t=(n=i.Attribute,__extends(a,n),a.UniqueId="DataWall",a);function a(t){var e=n.call(this,a.UniqueId,t,!0)||this;return e.name=t,e.isStrict=!0,e.dependency.uses.push(i.DataContent.UniqueId),e.dependency.internals.push(i.DataCallback.UniqueId),e}i.DataWall=t,function(t){var a,e=(a=i.Attribute.Value,__extends(n,a),n.prototype.loadElement=function(e){var n=this;return e.attvAttr("onclick")&&(this.resolver.addAttribute(i.DataCallback.UniqueId,e,e.attvAttr("onclick")),e.removeAttribute("onclick"),e.onclick=null),e.onclick=function(t){return n.onclick(e,t)},!0},n.prototype.onclick=function(t,e){var n=this.resolver.resolve(i.DataContent.UniqueId).getContent(t);return alert(n),this.continue(t)},n.prototype.continue=function(t){var e,n,a=this.resolver.resolve(i.DataUrl.UniqueId).getValue(t).getRaw(t),r=this.resolver.resolve(i.DataCallback.UniqueId);return r.getValue(t).getRaw(t)?r.callback(t):null!==(e=null==t?void 0:t.tagName)&&void 0!==e&&e.equalsIgnoreCase("a")&&(n=t.attvAttr("target"),i.navigate(a||"",n)),!1},n);function n(t,e,n){return void 0===n&&(n=[new i.Validators.RequiredElement(["a","button"])]),a.call(this,t,e,n)||this}t.DefaultValue=e;var r,o=(__extends(l,r=e),l.prototype.onclick=function(t,e){var n=this.resolver.resolve(i.DataContent.UniqueId).getContent(t);return!!confirm(n)&&this.continue(t)},l);function l(t,e,n){return void 0===n&&(n=[]),r.call(this,t,e,n)||this}t.ConfirmValue=o}(i.DataWall||(i.DataWall={}))}(Attv=Attv||{}),Attv.loader.pre.push(function(){Attv.registerAttribute("data-wall",function(t){return new Attv.DataWall(t)},function(t,e){e.push(new Attv.DataWall.DefaultValue("alert",t)),e.push(new Attv.DataWall.ConfirmValue("confirm",t)),e.push(new Attv.DataWall.DefaultValue("native-alert",t)),e.push(new Attv.DataWall.ConfirmValue("native-confirm",t))})});