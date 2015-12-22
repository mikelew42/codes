;(function(){

	/*
	CHECKLIST
		make sure Factories are configurable (self cloning)
		enhance clone logic to use .factory(.data())
	
	*/
	var core = window.core = window.core || {};
	
	var Factory = core.Factory = function(){
		// creates and returns a Factory
		var factory = Module.clone();
		// factory.factory = factory;
		Object.defineProperty(factory, 'factory', {})
	};

	Factory.clone = function(){
		var factory = this.factory();
		factory.reinstall(this); // performs installations for all sub modules
		// factory.extend(this.data()); // copies over enumerable props/data, omitting modules
		factory.factory = this || this.clone; // make sure this doesn't get instantiated, or make sure this.clone is bound!
		if (this.initialized)
			factory.init(this.data());
		else
			factory.extend(this.data());
	};

	Factory.instantiate = function(){
		var instance = Factory.clone();
	};
/*
	var Module = core.Module;
		// creates and returns an instance
		// Module() --> this.instantiate

	Module.instantiate = function(){
		var c = this.clone();
		c.invoke = c.main;

	};

	Module.install({ // defines it as nonEnum (to prevent it from being enumerated during clone and added to .data())
			// and adds it to be reinstalled when cloned
		instantiate: function(){}
		invoke: Invoke()
	});
*/

	// Module.clone === Factory?


	var CtxInvoker = function(){
		var fn = function(){
			return fn.invoke.apply(fn.ctx === "this" ? this : fn.ctx, arguments);//this doesn't appear to work, because .ctx isn't cloned
			// return fn.invoke.apply(fn.ctx, arguments);

		};
		Object.defineProperty(fn, 'ctx', {
			configurable: true,
			writable: true,
			enumerable: false, // make sure we don't try to clone this 
			value: "this" // default to a natural ctx
		});
		fn.Base = CtxInvoker;
		return fn;
	};

	var isArray = core.isArray = function(value){
		return toString.call(value) === '[object Array]';
	};

	var isObject = core.isObject = function(value){
		return typeof value === "object" && !isArray(value);
	};

	var assign = core.assign = function(base, ext1, ext2, etc){
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

	var module = core.module = function(fn, args){
		var mod = CtxInvoker();
		assign(mod, args);
		mod.invoke = fn;
		return mod;
	};
})();