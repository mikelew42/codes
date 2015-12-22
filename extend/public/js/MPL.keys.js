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

	/* Returns an array of all keys for the specified object */
	var keys = MPL.keys = function(obj){
		var ret = [],
			all = Object.getOwnPropertyNames(obj);

		for (var i = 0; i < all.length; i++){
			if (['caller', 'prototype', 'arguments'].indexOf(all[i]) === -1)
				ret.push(all[i]);
		}

		return ret;
	};

	keys.oo = function(){
		return keys(this);
	};

	/* Returns an array of all keys for fn, obj, and arrays */
	keys.refs = function(obj){
		var defs = define(obj),
			def,
			refs = [];

		for (var i in defs){
			def = defs[i];
			if (i === 'caller')
			debugger;
			if (typeof def.value === 'object' || typeof def.value === 'function')
				refs.push(i);
		}

		return refs;
	};

	keys.refs.oo = function(){
		return keys.refs(this);
	};

	keys.values = function(obj){
		var all = keys(obj),
			refs = keys.refs(obj),
			values = [];

		for (var i = 0; i < all.length; i++){
			if (refs.indexOf(all[i]) === -1)
				values.push(all[i]);
		}

		return values;
	};

	$(function(){
		var keysTest = function(){
			var obj = { a: 1, b: "two", ar: [], obj: {} },
				nonEnumObj = define.nonEnum({a: 1, b: "two", ar: [], obj: {}}, {
					nonEnumProp: "propNameShouldAppear",
					nonEnumFn: function(){}
				});
			console.log('keys for', obj, keys(obj));
			console.log('keys for', nonEnumObj, keys(nonEnumObj));
			console.log('ref keys for', nonEnumObj, keys.refs(nonEnumObj));
			console.log('value keys for', nonEnumObj, keys.values(nonEnumObj));
		};
		// keysTest();
	});
})(MPL);
