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

	var define = MPL.define;

	/*
	This function will only take 1 extender at the moment, because we can't count on looping through multiple arguments:
	If ext1 configures as unconfigurable, then ext2 can't override it.  Maybe that's ok, but for now, I'll keep it simple.
	*/
/*	var redefine = MPL.redefine = function(base, ext){
		var props = Object.getOwnPropertyNames(ext), descriptor;

		for (var i = 0; i < props.length; i++)
			Object.defineProperty(base, props[i], Object.getOwnPropertyDescriptor(ext, props[i]));
		
		return base;
	};*/

	var redefine = MPL.redefine = function(base, ext){
		return define(base, define(ext));
	};

	redefine.oo = function(base){
		return redefine(base || {}, this);
	};

	redefine.keys = function(args){
		var keys = args.keys,
			base = args.base,
			ext = args.ext,
			defs;

		for (var i = 0; i < keys.length; i++){
			defs = {};
			defs[keys[i]] = define(ext, keys[i]);
			define(base, defs);
		}

		return base;
	};

	redefine.configurable = function(base, ext){
		var definitions = define(ext),
			definition;
		for (var i in definitions){
			definition = definitions[i];
			if (!definition.configurable)
				delete definitions[i];
		}
		return define(base, definitions);
	};

	redefine.onto = function(base){
		return redefine(base || {}, this);
	};

	redefine.install = function(){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (arg.clone && arg.clone.onto) // could be arg.get('clone.onto') and could return a noop logger function that throws a warning if the fn didn't exist
				arg.clone.onto(this);
		}
	};

	$(function(){

		var redefineTests = function(){
			redefineObj = define({}, {
				prop: {
					enumerable: true,
					writable: true,
					value: 123,
					configurable: true
				},
				nonEnum: {
					enumerable: false,
					writable: true,
					value: 'nonEnum',
					configurable: true
				}
			});

			redefinedObj = redefine({}, redefineObj);
			redefinedObj = redefine2({}, redefineObj);

			console.log(redefinedObj);
		};

		// redefineTests();

	});
})(MPL);
