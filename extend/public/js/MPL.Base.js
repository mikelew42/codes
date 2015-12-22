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

	var define = MPL.define,
		redefine = MPL.redefine,
		extend = MPL.extend,
		assign = MPL.assign,
		each = MPL.each,
		clone = MPL.clone,
		keys = MPL.keys;

	var Base = MPL.Base = define.nonEnum({}, {
		nonEnum: define.nonEnum.oo,
		extend: extend.oo,
		clone: redefine.oo,
		create: extend.create.oo,
		define: define.oo,
		each: each.oo
	});

	// console.log(Base);

	var Base2 = MPL.Base2 = {
		extend: extend.oo,
		clone: extend.clone.oo,
		create: extend.create.oo,
		define: define.oo,
		nonEnumProp: function(prop){
			var definitions = {};
			definitions[prop] = {
				writable: true,
				configurable: true,
				enumerable: false,
				value: this[prop]
			};
			this.define(definitions);
			return this;
		},
		nonEnum: function(props){
			if (typeof props === 'string')
				return this.nonEnumProp(props);
			// console.group('nonEnum');
			// console.log('props', props);
			var definitions = {};
			// use this to define and override non-enum props
			for (var i in props)
				definitions[i] = {
					writable: true,
					configurable: true,
					enumerable: false,
					value: props[i]
				};

			this.define(definitions);
			// console.groupEnd();
			return this;
		}
	};

	$(function(){

		// are extend({}, Base) and Base.clone() the same?

		var baseTests = function(){
			baseObj = Base.clone();
			// baseObj.nonEnum({ extend: baseObj.extend });
			// baseObj.each();
			baseObj.each(function(v, i){
				// console.group(i);
				var hide = {};
				hide[i] = v;
				baseObj.nonEnum(hide);
				// console.log(baseObj.propertyIsEnumerable(i));
				// console.groupEnd();
			});
		};
		baseTests();
	});
})(MPL);
