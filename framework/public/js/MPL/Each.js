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

	var Base = function(){
		var Each = function Each(obj){
			return Each.main && Each.main.apply(Each, arguments);
		};
		return Each;
	};

	var Selfie = function(){
		var self = function(){
			return self.main.apply(self, arguments);
		};
		return self;
	};

	var Invoker = function(){
		var fn = function(){
			return fn.invoke.apply(fn, arguments);
		};
		fn.Base = Invoker;
		return fn;
	};


	// SIMPLEST CASE

	var TestFactory = MPL.TestFactory = function(){
		var Test = Invoker();
		Test.create = function(){
			return this.factory();
		};
		Test.factory = TestFactory;
		Test.invoke = Test.create;
		Test.prop = 5;
		return Test;
	};

	var Test2 = MPL.Test2 = Invoker();
	Test2.create = function(base){
		base = base || this.Base();
		base.create = base.invoke = this.create; // this creates a reference, could easily encaspulate in a defineCreate function
		base.prop = { prop: 5 };
		return base;
	};
	Test2.create(Test2);

	var methodCreator = function(){
		return function(){
			// do something with this;
		};
	};

//	myObj.method = methodCreator();

// or

	var methodCreator2 = function(){
		var fn = function(){
			// do something with this;
		};
		fn.clone = methodCreator2;
		return fn;
	};

	// myObj.method2 = methodCreator2;
	// myObj.clone --> iterate and if the prop has a .clone, use that, so
	// 	  clone.method2 = myObj.method2.clone();
	
	var cloneable = function(factory){
		var fn = factory();
		fn.clone = factory;
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
				base[i] = prop.clone({ host: base }); // could even use prop.referenceAs as the key, to avoid having to map
			else if (isObject(prop))
				base[i] = clone(prop);
			else if (isArray(prop))
				base[i] = clone(prop, []);
			else
				base[i] = prop;
		}

		return base;
	};

	var Clone = MPL.Clone = function(){};
	Clone.installer = function(base){
		base.clone = function(){
			var c = clone(this, this.Base());
			c.init && c.init.apply(c, arguments);
			return c;
		};
	};

	var Module = MPL.Module = Invoker();

	Module.clone = function(){
		var c = clone(this, this.Base());
		c.init && c.init.apply(c, arguments);
		return c;
	};

	Module.invoke = Module.clone;


///// Simple Installer pattern
//
//	  This module can clone itself onto an existing module.  This would allow
//    mixins, as well as allow special initializers, such as converting a module
//    into a standalone or OO form.


	var NaturalInvoker = MPL.NaturalInvoker = function(){
		var fn = function(){
			return fn.invoke.apply(this, arguments);
		};
		fn.Base = NaturalInvoker;
		return fn;
	};

//// CtxInvoker
	var CtxInvoker = MPL.CtxInvoker = function(){
		var fn = function(){
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

	var Assign = MPL.Assign = Module();
	Assign.installer = function(base){
		base.assign = function(){
			var args = Array.prototype.slice.call(arguments, 0);
			args.unshift(this);
			assign.apply(this, args);
			return this;
		};
	};

	var CtxModule = MPL.CtxModule = CtxInvoker();
	Clone.installer(CtxModule);
	CtxModule.invoke = CtxModule.clone;

	var CtxAssigner = MPL.CtxAssigner = CtxModule();
	Assign.installer(CtxAssigner);
	CtxAssigner.init = SimpleEvent(function(){ 
		this.assign.apply(this, arguments); 
	});


//// ASSIGNER aka SET?
	var Assigner = MPL.Assigner = Module();
	Assigner.assign = function(){
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift(this);
		assign.apply(this, args);
		return this;
	};
	Assigner.init = function(){ this.assign.apply(this, arguments); };


//// LOG
	var Log = MPL.Log = Assigner();
	Log.assign({
		log: function(){
			this.on && console.log.apply(console, arguments);
		},
		groupC: function(){
			this.on && console.groupCollapsed.apply(console, arguments);
		},
		group: function(){
			this.on && console.group.apply(console, arguments);
		},
		groupEnd: function(){
			this.on && console.groupEnd.apply(console, arguments);
		},
		dir: function(){
			this.on && console.dir.apply(console, arguments);
		}
	});

	Log.instantiate = function(){
		var c = this.clone.apply(this, arguments);
		c.invoke = c.log;
		return c;
	};

	Log.invoke = Log.instantiate;
//////////////




	var Each = MPL.Each = Module();

	Each.init = SimpleEvent(function(args){
		assign(this, args);
	});

	Each.instantiate = function(){
		var c = this.clone.apply(this, arguments);
		c.invoke = c.default;
		return c;
	};

	Each.invoke = Each.instantiate;

	// Each.clone --> new Each factory
	// Each() --> create() --> clone + adjust, or, add initializers to adjust (but then those get copied?)
	// Each.installer({ host: host }) --> clones and assigns host: host

	Each.installer = function(args){
		var c = this.clone.apply(this, arguments);
		c.invoke = c.oo;
	};

	Each.log = false;

	Each.oo = function(){

	};



	Each.init(function(){
		var initialState = (typeof this.log === 'boolean' && this.log) ? true : false, 
			log = this.log = Log({ host: this, on: initialState });
	});
	

	Each.default = function(obj, fn){
		this.log.group('each');
		this.log.groupC('arguments');
			this.log(obj);
			this.log(fn);
		this.log.groupEnd();
		for (var i in obj){
			this.log.groupC(i);
			fn.apply(obj, [obj[i], i]);
			this.log.groupEnd();
		}
		this.log.groupEnd();
		return obj;
	};

	Each.keys = function(obj){
		var keys = [];
		for (var i in obj){
			keys.push(i);
		}
		return keys;
	};

	var Keys = Module();


	// var each = MPL.each = Each();

	// Each() --> return each standalone instance

	// obj.each = Each.installer(obj) --> installs OO each
	// or obj.anything = Each.installer({ host: obj }) --> assign here (obj will have a .clone)
		// all clone logic could be added as an init cb.	


/*  I feel like .each is a perfect case for a middleware/machine like pattern:
Instead of allowing only 1 return value, an object could be passed through the 
machine, and that object is returned?

Or what about callbacks?  I can figure that out later..

*/






})();