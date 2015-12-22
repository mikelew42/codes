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

	var Event;

	var NaturalInvoker = function(){
		var fn = function(){
			return fn.invoke.apply(this, arguments);
		};
		fn.Base = NaturalInvoker;
		return fn;
	};

	var CtxInvoker = function(){
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

	Event = MPL.Event = CtxInvoker();

	Event.combo = function(){

	};
})();