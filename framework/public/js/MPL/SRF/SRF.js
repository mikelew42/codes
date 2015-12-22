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

	var SRF = MPL.SRF = function(){
		var self = function(){
			return 'main';
		};
		
		self.prop = 5;

		self.util1 = function(){
			return "util1";
		}

		self.accessSelf = function(){
			return self.prop;
		};
		self.accessThis = function(){
			return this.prop;
		};
		self.returnThis = function(that){
			return that;
		};
		return self;
	};

	MPL.SRF.SRFthis = function(){

	};

	var fn = function(){};
	fn.prop = 5;
	fn.sub = function(){};

	// how does fn access fn.sub?
	var fn = function(){
		fn.sub(); // works.
	};
	fn.sub = function(){}

	// there are limitations
	var install = function(fn){
		fn.sub = function(){};
		return fn;
	};

	var fn = install(function(){
		fn.sub(); // i think this works.
	});

	// NBEF(fn{}, {subs}) || NBEF(fn).extend({subs}) || NBEF({ main: fn, subs })
	var NBEF = function(fn){
		var nbef = function(){
			return nbef.main && nbef.main.apply(this, arguments);
		};
		if (fn) nbef.main = fn;
		// install .extend and any other helpers
		// initialize can be added later
		return nbef;
	};

	var SBEF = MPL.SBEF = function(fn){
		var sbef = function(){
			return sbef.main && sbef.main.apply(sbef, arguments);
		};
		if (fn) sbef.main = fn;
		// install shit
		return sbef;
	};

	// makes sure all calls happen with the correct context of the root object (not this, and not self),
	// which is usefull to get from obj.sub.subsub back to obj.
	var OBEF = MPL.OBEF = function(obj){
		var obef = function(){
			return obef.main && obef.main.apply(obef.obj, arguments);
		}
		if (obj) obef.obj = obj;
		return obef;
	};

})();