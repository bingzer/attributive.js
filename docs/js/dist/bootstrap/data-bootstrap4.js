var Attv,__extends=this&&this.__extends||function(){var s=function(t,o){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var r in o)Object.prototype.hasOwnProperty.call(o,r)&&(t[r]=o[r])})(t,o)};return function(t,o){function r(){this.constructor=t}s(t,o),t.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)}}();!function(t){var o,r,s;function n(t){var o=r.call(this,n.UniqueId,t,!0)||this;return o.name=t,o.isStrict=!0,o}o=t.Bootstrap4||(t.Bootstrap4={}),r=t.Attribute,__extends(n,r),n.UniqueId="DataBootstrap4",s=n,o.DataBootstrap=s}(Attv=Attv||{}),function(n){var o,e,t;function r(t,o,r){void 0===r&&(r=[new n.Validators.RequiredElement(["body"])]);var s=e.call(this,t,o,r)||this;return s.resolver.uses.push(n.DataRenderer.UniqueId),s.resolver.internals.push(n.DataTemplateHtml.UniqueId),s}o=n.Bootstrap4||(n.Bootstrap4={}),e=n.Attribute.Value,__extends(r,e),r.prototype.loadElement=function(t){return this.loadSettings(t,function(t){t.styleUrls=t.styleUrls||o.BootstrapSettings.StyleUrls,t.jsUrls=t.jsUrls||o.BootstrapSettings.JsUrls})},t=r,o.DefaultAttributeValue=t}(Attv=Attv||{}),function(t){var o,r;o=t.Bootstrap4||(t.Bootstrap4={}),(r=o.BootstrapSettings||(o.BootstrapSettings={})).StyleUrls=[{name:"bootstrap-css",url:"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",options:{integrity:"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T",crossorigin:"anonymous"}}],r.JsUrls=[{name:"jquery",url:"https://code.jquery.com/jquery-3.3.1.slim.min.js",options:{integrity:"sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo",crossorigin:"anonymous"}},{name:"popper",url:"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js",options:{integrity:"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1",crossorigin:"anonymous"}},{name:"bootstrap",url:"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js",options:{integrity:"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM",crossorigin:"anonymous"}}]}(Attv=Attv||{}),Attv.loader.pre.push(function(){Attv.registerAttribute("data-bootstrap",function(t){return new Attv.Bootstrap4.DataBootstrap(t)},function(t,o){o.push(new Attv.Bootstrap4.DefaultAttributeValue("bootstrap4",t))})});