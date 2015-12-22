;(function(){
	
	// create internal MPL,
	var MPL =

		// also create global MPL
		window.MPL = 

			// assign them both to

				// the current MPL if it exists, otherwise
				window.MPL || 

					// a new module
					{};

	var NaturalInvoker = function(){
		var fn = function(){
			return fn.invoke.apply(this, arguments);
		};
		fn.Base = NaturalInvoker;
		return fn;
	};

	var CtxInvoker = function(){
		var fn = function(){
			// return fn.invoke.apply(fn.ctx === "this" ? this : fn.ctx, arguments);//this doesn't appear to work, because .ctx isn't cloned
			return fn.invoke.apply(fn.ctx, arguments);

		};
		Object.defineProperty(fn, 'ctx', {
			configurable: true,
			writable: true,
			enumerable: false, // make sure we don't try to clone this 
			value: fn // default to self
		});
		fn.Base = CtxInvoker;
		return fn;
	};

	var isArray = MPL.isArray = function(value){
		return toString.call(value) === '[object Array]';
	};

	var isObject = MPL.isObject = function(value){
		return typeof value === "object" && !isArray(value);
	};

	var assign = MPL.assign = function(base, ext1, ext2, etc){
		for (var i = 1; i < arguments.length; i++){
			assign.single(base, arguments[i]);
		}
		return base;
	};

	assign.single = function(base, ext){
		for (var i in ext){
			base[i] = ext[i];	
		}
	};

	var SimpleEvent = MPL.SimpleEvent = function(fn){
		var ret = function(cb){
			if (typeof cb === 'function')
				ret.cbs.push(cb);
			else 
				ret.exec.apply(this, arguments);
			return this;
		};

		if (fn)
			ret.fn = fn;

		ret.cbs = [];
		ret.exec = function(){
			if (ret.fn)
				ret.fn.apply(this, arguments);
			for (var i = 0; i < ret.cbs.length; i++){
				ret.cbs[i].apply(this, arguments);
			}
		};
		ret.clone = function(){
			var c = SimpleEvent(ret.fn);
			for (var i = 0; i < ret.cbs.length; i++){
				c.cbs.push(ret.cbs[i]);
			}
			return c;
		};
		return ret;
	};

	var clone = MPL.clone = function(obj, base){
		var	prop;
		base = base || {};

		for (var i in obj){
			prop = obj[i];
			if (prop && prop.clone)
				base[i] = prop.clone();
			else if (isObject(prop))
				base[i] = clone(prop);
			else if (isArray(prop))
				base[i] = clone(prop, []);
			else
				base[i] = prop;
		}

		return base;
	};

	var Clone = function(){};
	Clone.installer = function(base){
		base.clone = function(){
			var c = clone(this, this.Base());
			c.init && c.init.apply(c, arguments);
			return c;
		};
	};
	/* I see no reason to leave the above function non-binding...
	Because this fn is a new fn instance, and is directly assigned
	to the object, there shouldn't be any need for relativity

	This should, however, leave the property name up to the user:
	
	mod.whatever = Clone.installer(mod);
	// we need to bind to mod, but the fn can be named w/e it wants.

WRONG
	There is very good reason to use a relative function:  
		IT DOESN'T REQUIRE REINSTALLATION!!!

	To clone the bindingInstaller, you'd need to pass the new "base",
	effectively reinstalling it.

	 */
	Clone.bindingInstaller = function(base){
		base.clone = function(){
			var c = clone(base, base.Base());
			c.init && c.init.apply(c, arguments);
			return c;
		};
		bind.clone.clone = Clone.bindingInstaller;
	}

	var Assign = function(){};
	Assign.installer = function(base){
		base.assign = function(){
			var args = Array.prototype.slice.call(arguments, 0);
			args.unshift(this);
			assign.apply(this, args);
			return this;
		};
	};

	var Module = MPL.Module = CtxInvoker();
	Clone.installer(Module);
	Module.invoke = Module.clone;
	Assign.installer(Module);
	Module.init = SimpleEvent(function(){
		this.assign.apply(this, arguments);
	});


/// Making a natural module that uses local bindings:

	var Nodule = MPL.Nodule =  function(){
		var nod = NaturalInvoker();
		Clone.bindingInstaller(nod);
		nod.invoke = nod.clone;
		Assign.installer(nod);
		nod.init = SimpleEvent(function(){
			console.log(this);
			// because c.init is called directly on the module, it is 
			// guaranteed to be self-context.
			this.assign.apply(this, arguments);
		});

		nod.sub = function(){

		};

		return nod;
	};

})();