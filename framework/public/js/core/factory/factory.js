;(function(){
	var core = window.core = window.core || {};
	
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

	var CtxInvoker = function(context){
		var fn = function(){
			var ctx;
			if (fn.ctx === 'this')
				ctx = this;
			else if (fn.ctx === 'self')
				ctx = fn;
			else 
				ctx = fn.ctx;
			return fn.invoke.apply(ctx, arguments);//this doesn't appear to work, because .ctx isn't cloned
			// return fn.invoke.apply(fn.ctx, arguments);

		};
		Object.defineProperty(fn, 'ctx', {
			configurable: true,
			writable: true,
			enumerable: false, // make sure we don't try to clone this 
			value: context || "this" // default to a natural ctx
		});
		// fn.invoke = function(){ // dynamic lookup
			// return fn.main && fn.main.apply(this, arguments);
		// }; // this is probably best added later... 
		fn.factory = CtxInvoker;
		return fn;
	};

	var create = {
		// FF()/core.Factory() --> FF.create --> create.factory
			// this is the FF
		factory: function(){
			console.log('create.factory');
			var F = this.clone.apply(this, arguments);
			F.invoke = F.create = create.instance;
			return F;
		},
		// FF returns F, which upon invocation calls create.instance:
			// this is the Factory
		instance: function(){
			console.log('create.instance');
			var inst = this.clone.apply(this, arguments);
			inst.create = inst.clone = create.clone;
			inst.invoke = function(){
				return inst.main && inst.main.apply(this, arguments);
			}; // dynamic lookup
			inst.factory = this;
			inst.init.apply(inst, arguments);
			return inst;
		},
		clone: function(){
			return this.factory(this.data());
		}
	};

	var FactoryFactory = core.FF = function(){
		console.log('FactoryFactory');
		var ff = CtxInvoker("self");

		ff.init = function(data){
			// assign data
		};

		ff.invoke = function(){
			return ff.create.apply(ff, arguments);
		};

		ff.data = function(){

		};

		ff.clone = function(){
			return this.factory(this.data());
		};

		ff.create = create.factory;

		ff.factory = FactoryFactory;

		return ff;
	};

	core.Factory = FactoryFactory();

	/*
	var Factory = function(factory){
		var wrap = function(){
			var instance = factory.apply(this, arguments);
			instance.factory = wrap;
			return instance;
		};
		return wrap;
	};

	
	Raw form:

	var MyFactory = function(){
		var instance = SomeBase() || fn(){} || {};
		// create the instance
		instance.factory = MyFactory;  // you could even encapsulate arguments here...
	};

	var myInstance = MyFactory(),
		myClone = myInstance.factory();

	The pattern above, of wrapping the factory in order to add the .factory property,
	would work, but it adds the extra wrapper, and frankly doesn't help much.
	*/
})();