// old Each



	// EachFF isn't needed, Each.factory can be it (unless its needs to be referenced/bound somewhere)
	var Each = MPL.Each = Invoker();

	var define = {
		// this fn doesn't need to use an installer... 
		create: function(each){
			each.create = function(){
				// clone self, and set main = iterate or even "run" or "invoke" as a generic for instances
					// you could name it Each.iterate and then assign Each.invoke = Each.iterate, if you wanted a better name,	
						// or just define Each.invoke as your actual function
				var instance = this.clone();
				instance.invoke = instance.iterate; // if this step can be abstracted, then this create is a reusable fn
					// this could easily be assigned on init, because its impossible to invoke before init...
				instance.init && instance.init.apply(instance, arguments);
				return instance;
			};
		},
		installer: function(each){
			each.installer = function(base){
				// install ooeach onto base
			};
		},
		clone: function(each){
			each.clone = function(){
				// return clone of self
				// if factory, return a factory
				// if instance, return an instance
				var clone = this.base();
				// either iterate and reassign/define
				// or 
			}
		},
		// submodule, or just add them directly
		iterate: {
			default: function(){
				// default for (var i in obj)
				// what properties does this NOT cover?  nonEnum (including prototype's nonEnum), 
			},
			safe: function(){
				// check if hasOwn (to avoid getting properties that libraries might add to native prototypes)
				// also exclude certain props like "prototype", "arguments", "length", for functions
			},
			own: function(){
				// only hasOwn, which ignores prototype props
				// should this include nonEnum?
			},
			all: function(){
				// all properties
			},
			unsafe: function(){
				// literally all properties
			}
			/*
			Maybe you can have a combo:  each.combo({ own: true, enum: true, safe: true, configurable: true, exclude: 'prop names to exclude' })(obj, fn)
			or obj.each.combo({}, fn) or obj.each.combo({})(fn)

			You could set each.main || .invoke (change .main pattern to use .invoke?  this is a little more meaningful, especially if using both invoke and main, invoke seems to be a little more specific/low level)
			each.invoke = each.combo({...}), although this would be a little misleading.  You'd probably want to leave each as a normal for var i in obj.

			What about creating new functions that bind not only the config, but also, for example, the iterator.  

			You could just wrap the function:

			obj.specialEach = function(){
				obj.each.combo({})(function(){
					// iterator
				});
			}

			Equivalently:

			obj.specialEach = obj.each.combo({}, function(){});

			The nice thing about option 2, is that you can pass this along as a CB:

			another.evnt(obj.each.combo({}, function(){...}))

			Which means, when another fires evnt, the evnt args will be passed to the iterator fn

			*/
		},
		// switch:
		factory: {
			// put factory-only props here
		},
		standalone: {
			// put standalone-only props here
			// standalone will likely include 
		},
		oo: {
			// put oo-only props here
			clone: function(each){

			}
		}
	};

	Each.clone = function(){
		// return clone of Each (factory version)
		var Each = Invoker();

		define
	};

	/* yet, each needs to be able to work standalone, not just OO 
	standalone version can use .invoke, and so its always bound to self, so that this is the module. */
	Each.iterate = function(obj, fn){
		var keys = [];
		/*
			// expect(obj).toBe.typeOf('object'); --> throws error if otherwise
				// after performing these type checks, we can then more safely check "if (obj)"
					// actually, if its an object, its true, so you wouldn't need to
					// if obj is an object (and not undefined), then you could next check if fn is defined
						// if fn is a function, you can then pass a cb?
						// expect(fn).type('function')
						// expect(fn).type('function').then(cb);
			
			To make this more compatible with logging, we need to know the names of the arguments.  Using the args 
			pattern resolves this challenge.

			argify(args).expect({ name: 'type', switch: ['one', 'two', 'three'], custom: {} })

			if this expect can encapsulate conditional logic, and do the routing for the function, we can gain valuable insight.*/
		each.log && console.group('each');
		each.log && console.groupCollapsed('arguments');
		each.log && console.log(obj);
		each.log && console.log(fn);
		each.log && console.groupEnd();
		if (obj && fn){
			for (var i in obj){
				each.log && console.groupCollapsed('%c' + i, 'font-weight: normal');
				fn.apply(obj, [obj[i], i]);
				each.log && console.groupEnd();
			}
		} else if (obj) {
			for (var i in obj){
				keys.push(i);
			}
			each.log && console.log('keys', keys);
			each.log && console.groupEnd();
			return keys; 
		}
		each.log && console.groupEnd();
		return obj;
	};

	Each._invoke = Each._iterate;

	Each.main = Each.create;

	// Each then has installer functions that can install itself onto itself
	// Each.installer(Each);
	// but there has to be one for ooeach and one for Each factory, which are very similar
	// Instead of having a long function tie up all these functions, the idea here is to keep them
	// extensible/accessible

	Each.installSub = function(obj){
		obj.sub = function(){};
	};

	// all of these installers don't need to come with the new each instance, so it 
	// might make sense to add them to 

	var Fn = function(){
		var fn = function(){

		};
		fn.clone = Fn;
		return fn;
	};


	// dynamic installer
	/* let's say we want to be able to install a module anywhere, and call it anything.  in order to 
	install dependent modules that need a reference, we'll need to connect everything.  I could see
	as system that allows you to point reference (paths) to the necessary dependencies, */

	var EachFF = function(){


		// Define MAIN and INSTALLER here...?
		// it might make sense to abstract this later, to be able to consistently use a 
		// redefine.
		// the tradeoff is: where do we want to define these, known we can redefine them anywhere.
		// i suppose it makes sense to define them where they're meant to be.  UNLESS we want
		// to use the EachFF to create new each modules...?

		// Each is an installer/factory combo (or just Factory + Factory.installer, doesn't matter)
		// We could possibly clone the Each factory, 

		/*
		Break a module's methods down into groups that can be optionally reused externally:

		var newEach = Each.base() --> returns a new base
		Each.installPartOfMyself(newEach);
		Each.installAnotherPart(newEach); // pick and choose which pieces to take

		while this isn't extensible (you might not be able to override the installers), it lets you 
		pick and choose which pieces you want, allowing anyone to create a custom clone.
		*/
		Each.factory = EachFF;

		var defineEachFF = function(){
			EachFF.main = function(){/* switch for create/install */};
		};

		Each.define = function(){};

		Each.define.factory = function(fn){

			fn.OO = function(){
				// create a custom version of the Each module that is OO
				// this means converting all sub utility functions also
				// this means we need to bind to the host obj, which means
				// we really need to install this bitch
			};

			// installer is particularly for OO...
			// installer should really just call Each.OO.installer()??
			// do we need an OO module?
			fn.installer = function(obj){
				var each = Each.create();
				// each.log  = true;
				/* the problem here, is that the returned module isn't the each module, so each doesn't have access
				to any configuration set onto obj.each ... */

				// it should be easy to clone the functionality onto another object, especially if it uses the .main pattern
				// making it OO is a little different, if you want the non OO and OO to both be the same function object


				var ooeach = function(fn){
					return each(this, fn);
				};
				ooeach.all = function(){

				};
				Object.defineProperty(obj, 'each', {
					enumerable: false,
					writable: true,
					configurable: true,
					value: ooeach
				});
				return each;
			};

			fn.keys = function(obj){
				var keys = [];
				for (var i in obj){
					keys.push(i);
				}
				return keys;
			};

			fn.init = function(){

			};

			fn.create2 = function(){

			};

			fn.create = function(){
				// needs to clone Each subs
				// maybe even get the same Each base?
				// or, use .main, so we can switch from the create/installer to the actual module
				var each = function(obj, fn){
					var keys = [];
					/*
						// expect(obj).toBe.typeOf('object'); --> throws error if otherwise
							// after performing these type checks, we can then more safely check "if (obj)"
								// actually, if its an object, its true, so you wouldn't need to
								// if obj is an object (and not undefined), then you could next check if fn is defined
									// if fn is a function, you can then pass a cb?
									// expect(fn).type('function')
									// expect(fn).type('function').then(cb);
						
						To make this more compatible with logging, we need to know the names of the arguments.  Using the args 
						pattern resolves this challenge.

						argify(args).expect({ name: 'type', switch: ['one', 'two', 'three'], custom: {} })

						if this expect can encapsulate conditional logic, and do the routing for the function, we can gain valuable insight.*/
					each.log && console.group('each');
					each.log && console.groupCollapsed('arguments');
					each.log && console.log(obj);
					each.log && console.log(fn);
					each.log && console.groupEnd();
					if (obj && fn){
						for (var i in obj){
							each.log && console.groupCollapsed('%c' + i, 'font-weight: normal');
							fn.apply(obj, [obj[i], i]);
							each.log && console.groupEnd();
						}
					} else if (obj) {
						for (var i in obj){
							keys.push(i);
						}
						each.log && console.log('keys', keys);
						each.log && console.groupEnd();
						return keys; 
					}
					each.log && console.groupEnd();
					return obj;
				};
				return each;
			};
		};

		Each.define.shared = function(fn){
			
		};

		Each.define.oo = function(){

		};

		Each.define(Each);

	};

	Each.Attach = function(obj){
		// an each module that is bound to a particular object
		// this might work nicely for the oo pattern, if its going to get all bound up anyway,
		// might as well let the each get passed around and auto-bound to the obj. 
	};

	Each.OOdynamic = function(fn){
		// instead of calling the iterator function with the context of the obj, call it with
		// the context of each property (if an object/function);
	};

	Each.create2 = function(){
		var each = function(){
			return each && each.main.apply(this, arguments);
		};
	};

	// var each = MPL.each = Each();