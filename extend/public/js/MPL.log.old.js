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
		Base = MPL.Base,
		redefine = MPL.redefine;

	var Logger = MPL.Logger = function(){
		// Logger.current = Log();
		Logger.logs = []; // add all logs here
		Logger.add(Log); // used to add logs
		console.log('wtf');
	};

	

	redefine(Logger, Base);

	Logger.extend({
		initialize: function(){
			this.root = this.current = Log('Logger');
			this.root.expand = true;
		},
		add: function(log){
			this.current.add(log);
		},
		/* whoa, major oversight:  if you enter once, you save reference to last,
		but if you enter a second time, you can only exit once... We'll need an array of lasts. 

		UNLESS, each item has its own parent, and you can enter/exit on the .current item, to do it
		in an oo fashion.  However, some logs can live in 2 places, right?  Would you enter/exit in 2+ loggers


		Logger1
			.add --> simply push it to .current
			.enter --> set as .current
				.add --> pushes to new .current
				.exit --> set .last = current.last

		But what if Logger2 is doing the same thing?

		Most logs will be created via an open/close process.

		The current syntax I have doesn't do this by default (because ou need to .log.group() and .log.end() ).  So let's consider the .main:

		module() -->
			_main:
				log.fn('main', arugments);
					creates a new log and sets the module.log.current to it, so future logs to module.log will be added to module.log.current

				log.fn.end() || just log.end();


		*/
		enter: function(log){
			this.add(log);
			this.last = this.current;
			this.current = log;
		},
		exit: function(){
			this.current = this.last;
		},
		log: function(){
			this.root.log();
		}
	});

	var Log = function(data){
		// self bind this fn, and use this.clone() to create a new one...
			// or just use log.clone, not sure if there's a difference there.
		var log = function(_data){
			var _log = Log(_data);
			// console.log(data);
			Logger.add(_log); // add globally
			log.add(_log); // and locally
			return _log;
		};

		redefine(log, Base);

		log.extend({
			initialize: function(){
				this.logs = [];
			},
			add: function(log){
				this.logs.push(log);
			},
			/* display the current logs */
			log: function(){ // convert this to a .render that automatically attaches to parent
				if (this.logs.length || this.data){
					this.expand ? console.group(this._name) : console.groupCollapsed(this._name);
					this.data && console.log(this.data);
					this.logChildren();
					console.groupEnd();
				} else {
					console.log(this._name);
				}
			},
			logChildren: function(){
				for (var i = 0; i < this.logs.length; i++){
					this.logs[i].log();
				}
			},
			// this is bad... log.fn conflicts with my Func.fn pattern
			fn: function(name, args){
				console.groupCollapsed(fnName, args);
			},
			group: function(data){
				// this doesn't log this group onto this .log()
				Logger.enter(Log(data));
			},
			end: function(){
				Logger.exit();
			}
		});

		if (typeof data === "string")
			log._name = data;
		else if (data)
			log.data = data;

		log.initialize();

		return log;
	};

	Log.install = function(mod){
		mod.log = Log();
	};


	Logger.initialize(Log('app'));


	// LOG AUTOMATION
	var Logify = function(obj){
		for (var i in obj)
			if (typeof obj[i] === 'function')
				logify(obj, i);
	};
	/********!!!!!!!!!!!!!!!!!!!!!!!***********/
	/*  ALSO ADD LOG AUTOMATION FOR $PROPS TO BE NOTIFIED OF EVERY GET/SET !! */

	var logify = function(obj, fnName){
		var fn = obj[fnName];
		obj[fnName] = function(){
			this.log.fn(fnName, arguments);
			return this.log.ret(fn.apply(obj, arguments));
		};
	};



	// Log.active = Log.argumentLoop;

	$(function(){



		/*
		If this obj used a global log fn that took "this" as context, then we could decide whether to nest obj.methods together, or whether
		the next log is a different object, and needs a new group.
		*/
		var logifyTests = function(){
			var obj = {
				log: {
					fn: function(fnName, args){ console.groupCollapsed(fnName, args); },
					ret: function(ret){ console.log('return', ret); console.groupEnd(); },
					i: function(){
						console.log('i: ', obj.i);
					}
				},
				test: function(){
					console.log('obj.test');
					return 5;
				},
				sum: function(a, b){
					return a + b;
				},
				ooLoop: function(){
					for (this.i = 0; this.i < 10; this.i ++)
						this.log.i();
				}
			};
			Logify(obj);
			obj.test('one', 2);
			obj.test('three', 4);
			obj.sum(5, 19);
			obj.ooLoop();
		};

		// logifyTests();


		var logTest1 = function(){
			var module = {
				log: Log()
			};
			module.log('yo');
			module.log.group('start group');
			Logger.add(Log('some anonymous logs in between'));
			module.log.end();
		};
		// logTest1();


		// MPL.Logger.log();
	});
})(MPL);







	
/* either bind these fn to themselves, or use an installer, because you can't clone a fn that references itself.. */
	
	// Log.mod = reference to the module which is cloned for every new Log
	// I suppose this isn't even completely necessary, because the Logs are nested

	// if we loop through all args, and they're treated the same, there's no need to chain log calls
	// should the .log module return the created Log object, like a factory?

/*
	// so you can chain log('yo').log('yo') instead of just log('yo')('yo')
	log.log = function(){
		return log.apply(this, arguments);
	};

	log.argumentLoop = function(){
		for (var i = 0; i < arguments.length; i++)
			log.logSingle.call(log, arguments[i]);

		return log;
	};

	log.logSingle = function(arg){
		if (typeof arg === 'string')
			log.logMessage(arg);
		else if (typeof arg === 'object')
			log.logObject(arg);
	};

	log.logObject = function(){

	};
*/