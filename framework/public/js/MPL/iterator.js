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

	var Iterator = MPL.Iterator = function(){
		var itr = function(){
			return itr.main && itr.main.apply(itr, arguments);
		};

		itr.props = [] || function(base, ext){ return []; };
		itr.handler = function(args){
			var base = args.base,
				ext = args.ext,
				prop = args.prop;

			base[prop] = ext[prop];
		};

		var getProps = function(args){
			if (typeof args.props === 'object')
				return args.props;
			else if (typeof args.props === 'function')
				return args.props(args);
		}

		itr.main = function(args){
			var props = getProps(args);
			for (var i = 0; i < props.length; i++){
				this.handler({ prop: props[i], base: args.base, ext: args.ext });
			}
			return args.base;
		};

		return itr;
	};

	$(function(){

	});

})();