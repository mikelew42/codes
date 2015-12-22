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

	var assign = MPL.assign,
		define = MPL.define,
		redefine = MPL.redefine,
		event = MPL.Event,
		Base = MPL.Base,
		Log;

	event.simple = MPL.SimpleEvent;

	var Log = MPL.Log = function(){
		var log = function(){
			return log.main.apply(log, arguments); // sets the correct context
		};

		redefine.configurable(log, Log);
		// define.nonEnum(log, logFns());

		log.initialize.apply(log, arguments);

		return log;
	};

	var FnBase = function(){
		var fn = function(){
			return fn.main && fn.main.apply(fn, arguments);
		};
		// fn.initialize && fn.initialize.apply(fn, arguments);
		return fn;
	};

	var FnInitFail = function(){
		var fn = FnBase();
		// this doesn't make any sense, the fn can't have an initialize fn at this point
		fn.initialize && fn.initialize.apply(fn, arguments);
		return fn;
	};	

	var FnInit1 = function(){
		var fn = FnBase();
		define.nonEnum(fn, {});
		fn.initialize.apply(fn, arguments);
		return fn;
	};

	var Initialize = function(){
		var mod = FnBase();
		mod.
		mod.initialize.apply(fn, arguments);
	};

	var FnModule = function(base){
		var mod = base || FnBase();
		define.nonEnum(mod, {
			base: FnBase,
			factory: FnModule,
			clone: function(){
				return redefine.configurable(this.base(), this);
			}
		});
	};

	var Createable = function(mod){
		var mod = mod || FnBase();
		return define.nonEnum(mod, {
			created: false
		});
	};

	define.nonEnum(Log, {
		initialize: function(){
			this.logs = [];
			this.current = this;
		},
		main: function(){
			var arg;

			if (this.current != this)
				return this.current.log.apply(this.current, arguments);

			for (var i = 0; i < arguments.length; i++){
				arg = arguments[i];
				if (typeof arg === 'function' && arg.factory === Log){
					this.add(Log);
				} else if (typeof arg === 'object'){
					this.add(NamesValuesLog(arg));
				} else if (typeof arg === 'string'){
					this.add(MessageLog(arg));
				} else {
					this.add(UnknownLog(arg));
				}
			}
		},
		add: function(log){
			this.logs.push(log);
		},
		console: function(){
			console.log('log.log()', this.logs);
		},
		factory: Log
	});

	$(function(){
		var fn = function(){};

		testRedefine = function(){
			var objs = [];
			for (var i = 0; i < 10000; i++){
				objs.push({
					fn: function(){
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
					},
					n: function(){
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
						console.log('yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda yadda');
					},
				});
			}
		};

		testAssign = function(){
			var objs = [];
			for(var i = 0; i<10000; i++){
				objs.push({fn: fn});
			}
		};

		// console.dir(Log);

		var LogTests = function(){
			var log = Log();
			log(Log());
			log.console();
		};
		// LogTests();
	});
})(MPL);
