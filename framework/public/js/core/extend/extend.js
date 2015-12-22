;(function(){
	var core = window.core = window.core || {};

	var define = core.define;

	var isArray = core.isArray = function(value){
		return toString.call(value) === '[object Array]';
	};

	var isObject = core.isObject = function(value){
		return typeof value === "object" && !isArray(value);
	};

	var Chain = function(){
		var chain = function(){
			return chain.exec.apply(this, arguments);
		};

		chain.cbs = [];

		chain.add = function(fn){
			this.cbs.push(fn);
		};

		chain.exec = function(){
			var cbs = this.cbs, cb, ret = false;
			for (var i = 0; i < cbs.length; i++){
				cb = cbs[i];
				if (cbs.apply(this, arguments));
			}
		};
	};



	var Install = core.Install = {
		installer: function(obj){
			Object.defineProperty(obj, 'install', {
				enumerable: false,
				value: function(arg){
					if (arg && arg.installer)
						arg.installer(obj); // just use hard-coded prop names, for now
					else if (isObject(arg))
						obj.install.obj(arg)
				}
			});

			// obj.install.extend = 

			obj.install.obj = function(props){
				// define as nonEnum
				// Object.defineProperties
				for (var i in props){
					if (obj[i] && obj[i].install)
						obj[i].install(props[i]);
					else {
						obj[i] = props[i];
						define.nonEnum(obj, i);
					}
				}
				define.nonEnum(obj, props);
			};

			/* Smart installer:  if first parent, perform installation, 
			otherwise treat as a reference.

			This can be different for factories*/
			Object.defineProperty(obj, "installer", {
				enumerable: false,
				value: function(parent){
					if (!obj.parent){
						// treat as installation
						obj.parent = parent;
						obj.installation(parent);
					}
				}
			});

			obj.installation = function(parent){
				// parent.subs = function(){};
			};
		}
	};

	var Extend = core.Extend = {
		installer: function(obj){
			if (!obj.install)
				Install.installer(obj);

			Object.defineProperty(obj, 'extend', {
				enumerable: false,
				value: function(){
					return obj.extend.invoke.apply(obj, arguments);
				}
			});
			obj.extend.main = function(){
				var arg;
				for (var i = 0; i < arguments.length; i++){
					arg = arguments[i];
					
					if (arg.installer){
						obj.install(arg);
					} else if (typeof arg === 'function'){
						this.extend.fn(arg);
					} else if (isObject(arg)){
						this.extend.obj(arg);
					} else if (isArray(arg)){
						this.extend.arr(arg);
					} else {
						this.extend.value(arg);
					}
				}
				return this;
			};
			obj.extend.invoke = obj.extend.main;  // .extend.invoke can be safely changed to another,
				// as long as whatever its set to doesn't get overridden

			obj.extend.fn = function(fn){
				// use by default?  this way an ExtendableModule IS a UsableModule
				obj.use(fn);
			};

			obj.extend.obj = function(arg){
				// base === obj, ext === arg
				var prop;
				for (var i in arg){
					prop = arg[i];
					if (obj[i] && obj[i].extend)
						obj[i].extend(arg[i]);
					else {
						// set or use a generic extend?
						obj[i] = arg[i];
					}
				}
			};

			// set obj.extend.invoke = obj.extend.applier if we want to always call the obj when extended
			obj.extend.applier = function(args){
				// in this case, obj is a functional module that we want to invoke
				// but what is "this"??  hopefully its a bound fn, so it shouldn't matter

				// does it matter what args are?
				obj.apply(obj, args);
			};

			// set obj.extend.invoke = obj.extend.useful if we want to 
			obj.extend.useful = function(fn){
				// in this case, obj is obj-like, and we want to use it as ctx for the fn, if its actually a fn
				if (typeof fn === 'function'){
					fn.apply(obj, []);
				} else {
					throw Exception;
				}
			};

			// ideally, this shouldn't happen unless we try to extend a module with a value
			obj.extend.value = function(arg){
				// obj.set(arg);
			};

			obj.set = function(){
				// this is unique to value-objects that represent a particular value
			};



			obj.use = function(fn){
				fn.apply(obj, []);
			};

			return obj;
		}

	};

})();