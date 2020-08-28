var Attv,__extends=this&&this.__extends||function(){var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])})(t,e)};return function(t,e){function a(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(a.prototype=e.prototype,new a)}}();!function(t){var a,e=(a=t.Attribute,__extends(n,a),n.UniqueId="DataTable",n);function n(t){var e=a.call(this,n.UniqueId,t,!0)||this;return e.name=t,e.isStrict=!0,e}t.DataTable=e}(Attv=Attv||{}),function(l){var t,i,e;function a(t,e,a,n){void 0===n&&(n=[new l.Validators.RequiredElementValidator(["table"])]);var r=i.call(this,t,e,a,n)||this;return r.resolver.uses.push(l.DataTemplate.UniqueId,l.DataPartial.UniqueId),r}t=l.DataTable||(l.DataTable={}),i=l.Attribute.Value,__extends(a,i),a.prototype.loadElement=function(t){var e,a;return this.attribute.isElementLoaded(t)||(e=this.resolver.resolve(l.DataTemplate.UniqueId),a=this.resolver.resolve(l.DataPartial.UniqueId),e.getValue(t).loadElement(t),a.getValue(t).loadElement(t),this.attribute.markElementLoaded(t,!0)),!0},e=a,t.DefaultValue=e}(Attv=Attv||{}),function(r){var t,l,e;function a(t,e,a){void 0===a&&(a=[new r.Validators.RequiredAttributeValidator([r.DataUrl.UniqueId])]);var n=l.call(this,"table",t,e,a)||this;return n.resolver.uses.push(r.DataTemplateSource.UniqueId,r.DataTimeout.UniqueId,r.DataMethod.UniqueId,r.DataCallback.UniqueId,r.DataTarget.UniqueId,r.DataInterval.UniqueId),n}t=r.DataTable||(r.DataTable={}),l=r.DataPartial.DefaultValue,__extends(a,l),a.prototype.getTargetElement=function(t){var e=(this.resolver.resolve(r.DataTarget.UniqueId).getTargetElement(t)||t).querySelector("tbody");return e||r.log("fatal","Unable to find tbody on the element",e),e},a.prototype.loadElement=function(t){return this.attribute.isElementLoaded(t)||(this.render(t),this.attribute.markElementLoaded(t,!0)),!0},e=a,t.DataPartialTableValue=e}(Attv=Attv||{}),function(n){var t,r,e;function a(t,e,a){return void 0===a&&(a=[new n.Validators.RequiredElementValidator(["table"])]),r.call(this,"table",t,e,a)||this}t=n.DataTable||(n.DataTable={}),r=n.DataTemplate.DefaultValue,__extends(a,r),a.prototype.loadElement=function(t){var e,a;return this.attribute.isElementLoaded(t)||(a=(e=t.querySelector("tbody")).html(),this.resolver.addAttribute(n.DataTemplateHtml.UniqueId,t,a),e.html(""),this.attribute.markElementLoaded(t,!0)),!0},e=a,t.DataTemplateTableValue=e}(Attv=Attv||{}),function(r){var t,e,a;function n(t){return e.call(this,"json2Table",t)||this}t=r.DataTable||(r.DataTable={}),e=r.DataRenderer.Json2HtmlValue,__extends(n,e),n.prototype.render=function(t,e){e=r.parseJsonOrElse(e);var a=r.createHTMLElement("tbody");a.innerHTML=t;var n=r.createHTMLElement("tbody");return this.bind(n,a,e),n.html()},a=n,t.DataRendererJson2TableValue=a}(Attv=Attv||{}),function(t){var e,a,n;function r(){var t=null!==a&&a.apply(this,arguments)||this;return t.style="\n/* Style the table */\n[data-table]\n",t}e=t.DataTable||(t.DataTable={}),a=t.Attribute.Settings,__extends(r,a),n=r,e.DefaultSettings=n}(Attv=Attv||{}),Attv.loader.pre.push(function(){Attv.registerAttribute("data-table",function(t){return new Attv.DataTable(t)},function(t,e){e.push(new Attv.DataTable.DefaultValue(Attv.configuration.defaultTag,t,function(t,e){return new Attv.DataTable.DefaultSettings(t,e)}))}),Attv.registerAttributeValue(Attv.DataTemplate.UniqueId,function(t,e){e.push(new Attv.DataTable.DataTemplateTableValue(t))}),Attv.registerAttributeValue(Attv.DataPartial.UniqueId,function(t,e){e.push(new Attv.DataTable.DataPartialTableValue(t))}),Attv.registerAttributeValue(Attv.DataRenderer.UniqueId,function(t,e){e.push(new Attv.DataTable.DataRendererJson2TableValue(t))})});