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

	var keys = MPL.keys,
		define = MPL.define,
		redefine = MPL.redefine,
		assign = MPL.assign,
		extend = MPL.extend;

	var clone = MPL.clone = function(ext, base){
		// ext here is the obj being cloned, base is where we're cloning to... confusing
		var valueKeys = keys.values(ext);

		base = base || {};

		redefine.keys({ keys: valueKeys, base: base, ext: ext });
		clone.refs({ ext: ext, base: base });
		return base;
	};

	clone.refs = function(args){
		var ext = args.ext,
			base = args.base,
			refKeys = keys.refs(ext),
			key, prop;

		for (var i = 0; i < refKeys.length; i++){
			key = refKeys[i];
			prop = ext[key];

			if (!prop)
				debugger;
			/*
			if (prop._isModule){
				if (ext.isSubModule(prop)){
					base[key] = prop.clone(); // or prop.clone.context(ext) --> checks whether to clone or assign
				} else {
					base[key] = prop; // redefine this to maintain nonEnum
				}
			} below isn't the best solution, but a simple one for now:
				for references that aren't meant to be cloned, delete or don't add the clone fn
				for sub modulesthat are meant to be cloned, add the clone fn... */

			if (prop.clone){
				base[key] = prop.clone();
			} else if (typeof prop === "function"){
				base[key] = prop; // redefine this to maintain nonEnum
			} else if (jQuery && prop instanceof jQuery){
				continue;
			} else if (typeof prop === "object"){
				base[key] = clone(prop); // redefine this to maintain nonEnum
			} else if (false){ // also handle arrays

			} else { // for all else, just assign it (or redefine it?)
				base[key] = prop;
			}
		}
	}

	clone.onto = function(){

	};

	clone.oo = function(){
		return clone.onto.apply(this, arguments);
	};

	var NaturalBase = function(){
		var fn = function(){
			return fn.main && fn.main.apply(this, arguments); // notice this, not fn
		};
		fn.base = NaturalBase;
		return fn;
	};

	var ClonableNaturalBase = function(){
		var cnb = InstallClone(NaturalBase());
		cnb.base = ClonableNaturalBase;
		return cnb;
	};

	var ModuleBase = function(){
		var fn = function(){
			return fn.main && fn.main.apply(fn, arguments); // notice fn, not this
		};
		fn.base = ModuleBase;
		return fn;
	};

	var ClonableModuleBase = function(){
		var cmb = InstallClone(ModuleBase());
		cmb.base = ClonableModuleBase;
		return cmb;
	};

	/* a factory for oo clone modules */
	var Clone2 = function(){
		var mod = NaturalBase();
		define.nonEnum(mod, {
			main: function(base){
				var cloned;
				base = base || ModuleBase();
				cloned = clone(this, base);
				// cloned.initialize && clone.initialize(); // this should probably be part of a create process which uses this fn
				return cloned;
			}
		});
		return mod;
	};	

	/* a factory for oo clone modules */
	var Clone3 = function(){
		// technically, we don't need the .main pattern, we just need to return a fn with the proper subs...
		var ret = function(){
			return clone(this, {});
		};

		ret.onto = function(base){
			return clone(this, base);
		};

		// ret.clone = function(){
		// 	return clone(this, Clone3());
		// };

		return ret;
	};

	var InstallClone = function(target){
		target.clone = function(){
			return clone(this, this.base && this.base() || {});
		};

		target.clone.onto = function(base){
			return clone(target, base);
		};

		return target;
	};

	var Module = function(){
		var mod = ClonableModuleBase();
		define.nonEnum(mod, {
			main: function(){
				console.group('module executed');
					console.dir(this);
				console.groupEnd();
				return this.clone();
			}
		});
		return mod;
	};

	var argify = function(args){
		return Array.prototype.slice.call(args, 0);;
	};

	var FF = function(){
		var ff = ClonableModuleBase();
		define.nonEnum(ff, {
			extend: function(){
				var args= argify(arguments),
					arg;
				for (var i = 0; i < args.length; i++){
					arg = args[i];
					if (typeof arg === 'function')
						this.main = arg;
					else
						extend(this, arg);
				}
				return this;
			}
		});
		ff.extend.apply(ff, arguments);
		return ff;
	};

	$(function(){
		var cloneTests = function(){
			var obj1 = { a: 1, b: "two", $el: $('<div>'), obj: { subs: { one: 1, two: "two" }} };
			obj2 = clone(obj1);
			obj2.new = 'not on one';
			console.log(obj1);
			console.log(obj2);
		};
		// cloneTests();

		var clone3Tests = function(){
			var obj = { a: 1, b: "two" };
			obj.clone = Clone3();
			console.log(obj);
			console.log(obj.clone.onto);
		};
		// clone3Tests();

		var InstallCloneTests = function(){
			var obj = {
				a: 1, 
				b:"two",
				nat: assign(NaturalBase(), { type: "NaturalBase" }),
				mod: assign(ModuleBase(), { type: "ModuleBase" }),
				clonableNat: ClonableNaturalBase(),
				clonableMod: ClonableModuleBase()

			};
			InstallClone(obj);
			var cln = obj.clone();

			obj.nat.home = "obj";
			obj.mod.home = "obj";
			obj.clonableNat.home = "obj";
			obj.clonableMod.home = "obj";

			cln.nat.home = "cln";
			cln.mod.home = "cln";
			cln.clonableNat.home = "cln";
			cln.clonableMod.home = "cln";

			cln.a = 9000;
			cln.b = "whateva";
			cln.prop = 5;
			console.log(obj);
			console.log(cln);
		};
		// InstallCloneTests();

		var moduleTests = function(){
			var mod = Module(),
				mod2 = mod.clone();

			mod();
			mod2.main = function(){ return 5; };
			console.log(mod2());
		};
		// moduleTests();

		var FFTests = function(){
			var ff = FF(function(){
				console.log('ff executed', this);
				this.sub();
			}, {
				sub: function(){
					console.log('ff.sub');
				}
			});
			ff();
		};
		FFTests();
	});
})(MPL);
