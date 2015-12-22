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

	var get = MPL.get = function(base, path){
		/* loop through */
		var paths = path.split('.');
		for (var i = 0; i < paths.length - 1; i++){
			base = base[paths[i]];
		}
		return base[paths[i]];
	};

	var getter = MPL.getter = function(base, path){
		return function(){
			return get(base, path);
		}
	};

	var set = MPL.set = function(base, path, value){
		var paths = path.split('.');
		for (var i = 0; i < paths.length - 1; i++){
			base = base[paths[i]];
		}
		base[paths[i]] = value;
	};

	var setter = MPL.setter = function(base, path, defaultValue){
		var sttr = function(value){
			// you couldn't set the value to undefined using this method,
			// unless you use an object with { value: undefined }, and check ("value" in obj)...
			set(base, path, typeof value !== "undefined" ? value : defaultValue);
			return sttr;
		};
		return sttr;
	}

	// TODO:  obj.get('path.to.anything');
	// TODO:  getter(obj, 'path.to.anything') --> function that returns get(obj, path);
	// TODO:  obj.getter('path.to.anything') ...
	// TODO:  set(obj, path, value);
	// TODO:  obj.set(path, value);
	// TODO:  setter(obj, path (,value)) --> function that calls set(obj, path, )
	// TODO:  obj.setter(path (, value)) --> function that calls set(path, )

	// TODO:  bind obj.set and obj.setter functions so they can be passed as variables:
		// var sttr = obj.setter;  sttr("path.to.something", value); --> always sets on the obj.

})();