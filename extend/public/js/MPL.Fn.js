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

	var extend = MPL.extend || function(){},
		define = MPL.define;
		redefine = MPL.redefine;

	/* A factory for functions with .fn.  BFn means its bound to the returned function object */
	var BFn = MPL.BFn = function(func){
		var ret = function(){
			return ret.fn.apply(ret, arguments);
		};

		if (func)
			ret.fn = func;

		return ret;
	};
	/* UFn for unbound:  called with natural context */
	var UFn = MPL.UFn = function(){
		var ret = function(){
			return ret.fn.apply(this, arguments);
		};
	};

	// or how about a more versatile approach:
	// this way, we can have the sub fn functionality declared at any property, so modules like log.fn() can still work for something else.
	var FactoryFactory = function(subFnPropName, selfBound){
		var factory = function(fn){
			var ret = function(){
				return ret[subFnPropName].apply(selfBound ? ret : this, arguments);
			};

			if (fn)
				ret[subFnPropName] = fn;

			define.nonEnum(ret, {
				factory: factory,
				clone: function(){
					// does this need to be self-bound? it would only matter if the fn.clone fn were passed as a cb or something,
					// which might be worth considering, so you could say:  obj.something(another.clone);
					return this.factory(this[subFnPropName]);
				}
			});

			return ret;
		};

		define.nonEnum(factory, {
			clone: function(){
				console.log('cloning', subFnPropName, selfBound);
				return FactoryFactory(subFnPropName, selfBound);
			}
		});
		return factory;
	};

/*  Here, the fn is the factory, which should be able to return anything.  this function should
	redefine itself onto the returned factory fn */

	var Installer = function(anything){
		return redefine.safe(anything || {}, Installer);
	};
	// used as Installer(anything), Installer(module), Installer(fn), etc.
	define.nonEnum(Installer, { extend: extend.oo, define: define.oo });

	var BoundMain = FactoryFactory('main', true);
	var SelfCloningFactoryFactory = function(fn){
		return define.nonEnum(BoundMain(function(){
			return this.clone();
		}), {
			clone: function(){
				return SelfCloningFactoryFactory(fn);
			}
		});
	};

	// fwf (function wrapped function)
	// or fnf (fn factory)
	var Fun = function(fnf){
		var fn = fnf();
		// the only other thing that makes sense here, is to perform
		// extensions or something..?
	};


	// this doesn't work... how do you pass a reference to the return value, into the fn?  chicken or egg
	// var selfie = function(ff){
	// 	var args = Array.prototype.slice.call(arguments, 1);
	// 	return extend(ff(), args);
	// };

	// var selfLike = (function(){
	// 	var self = function(){
	// 		// use selfie here
	// 	};
	// 	extend(self, {subs: here});
	// 	return self;
	// })();

	// So, there's no way to generalize this into a simpler pattern?  I really don't see how... 

	$(function(){
		var FFtests = function(){
			var FF = FactoryFactory;

			console.group('Self-bound');
			F1 = FF('main', true);
			f1 = F1(function(){ console.log('f1'); console.dir(this); this.test(); });
			f1.test = function(){ console.log('f1.test'); };
			f1();

			console.log('should be identical to');
			
			var obj = {};
			obj.f1 = f1;
			obj.f1(); // maintains context
			console.groupEnd();

			console.group('Natural-bound');
			F2 = FF('main');
			f2 = F2(function(){ console.log('f2'); console.dir(this); });
			// f2.test = function(){ console.log('f2.test'); }; // naturally, this shouldn't work
			f2();

			obj.f2 = f2;
			obj.f2(); // maintains context
			obj.f3 = F2(function(){ console.log('f3'); console.dir(this); this.test(); });
			obj.test = function(){ console.log('obj.test()'); };
			obj.f3();

			F4 = obj.f3.factory.clone();
			// console.log('f3.factory', obj.f3.factory);
			// console.log('f3.factory.clone()', obj.f3.factory.clone());
			obj.f4 = F4(function(){ console.log('f4'); this.test(); });
			obj.f4();
			console.groupEnd();

		};
		// FFtests();

/*		var SCFFTests = function(){
			var SelfCloningFactoryFactory(function(){});
		};

		SCFFTests();*/

		var InstallerTests = function(){
			console.log(define(Installer));
			installObj = Installer();
			console.log(installObj);
		};

		// InstallerTests();
	});
})(MPL);