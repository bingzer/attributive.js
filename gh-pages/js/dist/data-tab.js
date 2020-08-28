var Attv,__extends=this&&this.__extends||function(){var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])})(t,e)};return function(t,e){function a(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(a.prototype=e.prototype,new a)}}(),__spreadArrays=this&&this.__spreadArrays||function(){for(var t=0,e=0,a=arguments.length;e<a;e++)t+=arguments[e].length;for(var n=Array(t),r=0,e=0;e<a;e++)for(var i=arguments[e],o=0,u=i.length;o<u;o++,r++)n[r]=i[o];return n};!function(a){var n,t=(n=a.Attribute,__extends(r,n),r.UniqueId="DataTab",r);function r(t){var e=n.call(this,r.UniqueId,t,!0)||this;return e.name=t,e.isStrict=!0,e.dependency.uses.push(a.DataTabContent.UniqueId,a.DataTabNav.UniqueId),e}a.DataTab=t}(Attv=Attv||{}),function(u){!function(t){var i,e=(i=u.Attribute.Value,__extends(a,i),a.prototype.loadElement=function(t){var e;return this.attribute.isElementLoaded(t)||(e=this.resolver.resolve(u.DataTabNav.UniqueId),t.querySelectorAll(e.toString()).forEach(function(t){e.getValue(t).loadElement(t)}),this.applySettings(t),this.attribute.markElementLoaded(t,!0)),!0},a.prototype.applySettings=function(t){var e;this.resolver.resolve(u.DataOptions.UniqueId).exists(t)&&this.settings,null!==(e=this.settings)&&void 0!==e&&e.commit()},a);function a(t,e,a,n){void 0===n&&(n=[]);var r=i.call(this,t,e,a,n)||this;return r.resolver.uses.push(u.DataRoute.UniqueId,u.DataOptions.UniqueId),r}t.DefaultValue=e;var n,r=(n=u.DataPartial.DefaultValue,__extends(o,n),o.prototype.loadElement=function(t){return!1},o.prototype.render=function(t,e,a){this.attribute.isElementLoaded(t)||n.prototype.render.call(this,t,e,a)},o.prototype.doRender=function(t,e,a){n.prototype.doRender.call(this,t,e,a),this.attribute.markElementLoaded(t,!0)},o);function o(t){return n.call(this,"tab",t)||this}t.DataTabDialogAttributeValue=r}(u.DataTab||(u.DataTab={}))}(Attv=Attv||{}),function(d){var a,t,r,e,n=(a=d.Attribute,__extends(i,a),i.UniqueId="DataTabNav",i);function i(t){var e=a.call(this,i.UniqueId,t)||this;return e.name=t,e.dependency.uses.push(d.DataEnabled.UniqueId,d.DataActive.UniqueId),e.dependency.internals.push(d.DataRoute.UniqueId),e}function o(t,e,a){void 0===a&&(a=[]);var n=r.call(this,void 0,t,e,a)||this;return n.resolver.uses.push(d.DataEnabled.UniqueId,d.DataActive.UniqueId,d.DataTabContent.UniqueId),n}d.DataTabNav=n,t=d.DataTabNav||(d.DataTabNav={}),r=d.Attribute.Value,__extends(o,r),o.prototype.loadElement=function(t){var a=this;if(!this.attribute.isElementLoaded(t)){var n=t.parentElement,r=t,i=__spreadArrays(n.querySelectorAll(this.toString())),o=this.resolver.resolve(d.DataActive.UniqueId),e=this.resolver.resolve(d.DataEnabled.UniqueId),u=this.resolver.resolve(d.DataRoute.UniqueId);if(u.getLocationRoute())for(var s=0;s<i.length;s++){var l=u.appendHash(u.getRoute(n),this.getRaw(i[s]));if(u.matches(l)){i.forEach(function(t){return o.setActive(t,!1)}),o.setActive(i[s],!0);break}}e.isEnabled(t)&&(t.onclick=function(t){var e;i.forEach(function(t){return o.setActive(t,!1)}),o.setActive(r,!0),a.displayContent(n,r,i),u.exists(n)&&(e=u.appendHash(u.getRoute(n),a.getRaw(r)),u.setRoute(e))}),o.isActive(t)&&this.displayContent(n,r,i),this.attribute.markElementLoaded(t,!0)}return!0},o.prototype.displayContent=function(t,e,a){var n=this.resolver.resolve(d.DataTabContent.UniqueId),r=this.getRaw(e),i=t.parentElement.querySelector("["+n.name+'="'+r+'"]');return i&&(i.parentElement.querySelectorAll(n.toString()).forEach(function(t){return t.hide()}),n.getValue(i).loadElement(i)),!1},e=o,t.DefaultAttributeValue=e}(Attv=Attv||{}),function(r){var a,t,i,e,n=(a=r.Attribute,__extends(o,a),o.UniqueId="DataTabContent",o);function o(t){var e=a.call(this,o.UniqueId,t)||this;return e.name=t,e}function u(t,e,a){void 0===a&&(a=[]);var n=i.call(this,void 0,t,e,a)||this;return n.resolver.uses.push(r.DataContent.UniqueId,r.DataPartial.UniqueId,r.DataActive.UniqueId),n}r.DataTabContent=n,t=r.DataTabContent||(r.DataTabContent={}),i=r.Attribute.Value,__extends(u,i),u.prototype.loadElement=function(t){if(!this.attribute.isElementLoaded(t)){t.show();var e=this.resolver.resolve(r.DataContent.UniqueId);if(e.exists(t))return void t.html(e.getContent(t));var a=this.resolver.resolve(r.DataPartial.UniqueId);if(a.exists(t))return void a.renderPartial(t);r.loadElements(t),this.attribute.markElementLoaded(t,!0)}return!0},e=u,t.DefaultAttributeValue=e}(Attv=Attv||{}),function(t){var e,a,n;function r(){var t=null!==a&&a.apply(this,arguments)||this;return t.style='\n/* Style the tab */\n[data-tab] {\n    overflow: hidden;\n    border: 1px solid #ccc;\n    background-color: #f1f1f1;\n}\n\n/* Style the buttons inside the tab */\n[data-tab] [data-tab-nav] {\n    background-color: inherit;\n    float: left;\n    border: none;\n    outline: none;\n    cursor: pointer;\n    padding: 14px 16px;\n    transition: 0.3s;\n    font-size: 17px;\n    list-style: none;\n}\n\n[data-tab] [data-tab-nav][data-enabled="false"] {\n    cursor: default;\n    opacity: 0.5;\n}\n[data-tab] [data-tab-nav][data-enabled="false"]:hover {\n    background-color: inherit;\n}\n\n/* Change background color of buttons on hover */\n[data-tab] [data-tab-nav]:hover {\n    background-color: #ddd;\n}\n\n/* Create an active/current tablink class */\n[data-tab] [data-tab-nav][data-active=true] {\n    background-color: #ccc;\n}\n\n/* Style the tab content */\n[data-tab-content]{\n    display: none;\n    padding: 6px 12px;\n    border: 1px solid #ccc;\n    border-top: none;\n}\n',t}e=t.DataTab||(t.DataTab={}),a=t.Attribute.Settings,__extends(r,a),n=r,e.DefaultSettings=n}(Attv=Attv||{}),Attv.loader.pre.push(function(){Attv.registerAttribute("data-tab",function(t){return new Attv.DataTab(t)},function(t,e){e.push(new Attv.DataTab.DefaultValue(Attv.configuration.defaultTag,t,function(t,e){return new Attv.DataTab.DefaultSettings(t,e)}))}),Attv.registerAttribute("data-tab-nav",function(t){return new Attv.DataTabNav(t)},function(t,e){e.push(new Attv.DataTabNav.DefaultAttributeValue(t))}),Attv.registerAttribute("data-tab-content",function(t){return new Attv.DataTabContent(t)},function(t,e){e.push(new Attv.DataTabContent.DefaultAttributeValue(t))}),Attv.registerAttributeValue(Attv.DataPartial.UniqueId,function(t,e){e.push(new Attv.DataTab.DataTabDialogAttributeValue(t))})});