;(function(){
	var core = window.core = window.core || {};
	

	var Assign = core.Assign = function(){
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

	var assign = core.assign = Assign();

	Assign.installer = function(obj){
		obj = obj || {};
		Object.defineProperty(obj, 'assign', {
			enumerable: false,
			value: function(ext1, ext2){
				var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(this);  // this, ext1, ext2...
				return assign.apply(this, args);
			}
		});
		return obj;
	};

})();