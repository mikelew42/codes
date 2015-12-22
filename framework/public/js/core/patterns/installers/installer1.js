var installer1 = function(base){
	base.method = function(){};
};

installer1(obj);

/////////////////////////////////////

var installer2 = function(base){
	return function(){
		// use base here
	};
};

obj.method = installer2(obj);

/////////////////////////////////////

var installer3 = function(args){
	var host = args.host,
		arg1 = args.arg1,
		arg2 = args.arg2; //...

	var fn = function(){
		// use fn to reference self/subs
		fn.subs(); // subs: this === fn
		fn.subs.apply(host, args);
		// or, don't even use "this", just bind everything with local vars.


		// use host to access the host module
		host.doStuff();

		// pass any other references, like parent, app, etc
		fn.parent = parent;
	};

	return fn;
}

obj.method = installer({ base: obj, arg1: otherObj });

///////////////////////////////////////

var installer4 = function(args){
	var host = args.host,
		ctx = args.ctx,
		otherVars = args.otherArgs;

	var fn = function(){
		return fn.invoke.apply(ctx, arguments);
	};

};

///////////////////////////////////////////

var MyFactory = Factory(function(){
	// "this" is the new instance?
	// this fn is an initializer then...
});

///////////////////////////////////////////

var MyModule = Factory(function(){
	this.View = core.View(function(){
		// initializer
	});

	// or

	this.View = core.View();
	this.View.install({
		init: {
			namedSub: module(function(){}, { ctx: this.View.init })
		}
	}); // or
	this.View.init.install({
		namedSub: module(function(){}, {ctx: this.View.init })
	}); // extend just sets the sub (and initializes it...)
	// install would add it to the cbs

	// or
	this.View.init.add(fn || mod || {
		namedSub: fn || mod
	});

	// or, this.View() --> View.extend
	this.View({
		initialize: fn || mod, // --> if anonymous, we wouldn't set it without adding to the cb array, so default to add anonymous fn/mod
		initialize: { main: fn }, // wrong, fn only pls, no sub modules on the .main 
		initialize: { add: fn || mod || { namedSub: fn || mod }},
		// or
		initialize: { // if adding a namedSub, but not using "add", we might want to just put it there to call later (or, we might be extending an existing sub, which is already getting called)
			namedSub: fn || mod || { namedSub: fn || mod }
		}
	});

	// or
	this.View.use('initialize', function(){
		// this === View.initialize
		this.invoke = newFn;
		this.add({ namedSub: fn });
		this.namedSub = fn || mod;
	});  // maybe this is part of the .do or .exec module?
	// this.View.initialize.exec(fn(){ // immediately executes with this === initialize });
	// and, this.view.initialize.eval(function(){}); could eval with a bunch of bound properties already in place :D

	this.view = this.View({ init: data });

	this.data = function(){
		// 1) loop through all props (enum and non)
			// if prop.data
				// data[propName] = prop.data()
			// else
				// toJSON(prop)??

		// ex:  data.view 
	}
});