;(function(){
	var core = window.core = window.core || {};
	var assign = core.assign;
	/*
	define(obj, { prop: { enumerable, writable, value, configurable }, ... })
	define(obj, 'prop') // returns descriptor
	define(obj) // get all descriptors as a definitions object
	*/
	var define = core.define = function(obj, definitions){
		if (definitions){
			if (typeof definitions === 'object'){
				return Object.defineProperties(obj, definitions);
			} else if (typeof definitions === 'string')
				// get definition for this property name
				return Object.getOwnPropertyDescriptor(obj, definitions) || assign({}, define.default);			
		} else {
			// get all definitions
			return define.all(obj);
		}
	};

	define.all = function(obj){
		var keys = Object.getOwnPropertyNames(obj),
			definitions = {};
		
		for (var i = 0; i < keys.length; i++){
			// default this to a safe define, to skip fn properties such as:
			if (['caller', 'arguments', 'prototype'].indexOf(keys[i]) > -1)
				continue;
			definitions[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
		}

		return definitions;
	};

	define.oo = function(props){
		return define(this, props);
	};

	define.default = {
		enumerable: true,
		writable: true,
		configurable: true,
		value: undefined
	};

	/* Different usage than define, this convenience function assumes:
		- enumerable: false,
		- writable: true,
		- configurable: true,
		- value: as defined in this obj 

	define.nonEnum(obj, { prop: value, prop2: 'anotherValue', prop3: fn(){}, ... })
	vs
	define.nonEnum(obj, 'prop')
	or define.nonEnum(obj, ['array', 'of', 'props']);
	or even define.nonEnum(obj) loops through all enums, and turns them off...

	It might make more sense to use a hide function that just takes the names of properties to make nonenum, 
	which are considered to be already defined (or just passes along the undefined value, if that's the case) */
	define.nonEnum = function(obj, props){
		if (props){
			if (typeof props === 'object'){
				if (props.length){
					// if props is an array
					for (var i = 0; i < props.length; i++){
						define.nonEnum(obj, props[i]);
					}
					return obj;
				} else {
					// if props is an object
					for (var i in props){
						var definition = {};
						definition[i] = {
							enumerable: false,
							writable: true,
							configurable: true,
							value: props[i]
						};
						define(obj, definition);
					}
					return obj;
				}
			} else if (typeof props === 'string'){
				console.group('nonEnum', props);
				var definition = {};
				// console.log('current definition', define(obj, props));
				definition[props] = assign(define(obj, props) || define.default, {enumerable: false});
				// console.log('new def', definition);
				define(obj, definition);
				console.groupEnd();
				return obj;
			}
		} else {
			return define.nonEnum.all(obj);
		}
	};

	define.nonEnum.oo = function(props){
		return define.nonEnum(this, props);
	};

	define.nonEnum.all = function(obj){
		var definitions = {};
		for (var i in obj)
			definitions[i] = assign(define(obj, i), {enumerable: false});
		define(obj, definitions);
		return obj;
	};

	define.nonEnum2 = function(props){
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
	};
})();