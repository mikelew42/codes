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
	/*
	obj.do({
		method: arg,
		multiArgs: {apply: [arg1, arg2, ...]},
		// these run in 'parallel', if they have async behavior
		series: { call: arg, then: fn }, // this would run in sync, unless the fn has an async finish
		async: { call: arg, then: fn } // here, then won't execute until the async response is resolved
	});
	*/


	var Do = MPL.Do = function(){
		var _do = function(){};
		// do is reserved, find another name


	};
})();