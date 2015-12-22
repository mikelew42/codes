;(function(){
	var core = window.core = window.core || {};

	var isArray = core.isArray = function(value){
		return toString.call(value) === '[object Array]';
	};

	var isObject = core.isObject = function(value){
		return typeof value === "object" && !isArray(value);
	};

	var each = core.each = function(obj, fn){
		for (var i in obj)
			fn.apply(obj, [obj[i], i]);
		return obj;
	};

	var clone = core.clone = function(obj, base){
		var	prop;
		base = base || {};
		// not sure if this is any better
		each(obj, function(prop, i){
			if (isObject(prop))
				base[i] = clone(prop);
			else if (isArray(prop))
				base[i] = clone(prop, []);
			else
				base[i] = prop;
		});
		/*
		for (var i in obj){
			prop = obj[i];
			if (isObject(prop))
				base[i] = clone(prop);
			else if (isArray(prop))
				base[i] = clone(prop, []);
			else
				base[i] = prop;
		}
		*/
		return base;
	};

	/* trying to reuse clone to make this clone2 seems a bit forced.  in a dev version
	where we want to have full control, that's fine.  in a production version, hardcoding is
	likely better.*/

	var clone2 = function(obj, base){
		var	prop;
		base = base || {};

		for (var i in obj){
			prop = obj[i];
			if (prop && prop.clone)
				base[i] = prop.clone({ parent: base });
			else if (isObject(prop))
				base[i] = clone(prop);
			else if (isArray(prop))
				base[i] = clone(prop, []);
			else
				base[i] = prop;
		}

		return base;
	};

	var Clone = function(){
		var clone = function(){

		};
		return clone;
	};
})();