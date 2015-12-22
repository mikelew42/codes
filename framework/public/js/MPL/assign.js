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

	assign.oo = function(ext1, ext2){
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift(this);  // this, ext1, ext2...
		return extend.apply(this, args);
	};

	var Assign = MPL.Assign = function(){
		return function(base, ext1, ext2){
			var ext;
			for (var i = 1; i < arguments.length; i++){
				ext = arguments[i];
				for (var j in ext){
					base[j] = ext[j];
				}
			}
			return base;
		};
	};

	var assign = MPL.assign = Assign();

})(MPL);
