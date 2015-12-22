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

	var assign = MPL.assign;
	/*
	define(obj, { prop: { enumerable, writable, value, configurable }, ... })
	define(obj, 'prop') // returns descriptor
	define(obj) // get all descriptors as a definitions object
	*/
	var define = MPL.define = function(obj, definitions){
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



	$(function(){
		var defineTests = function(){
			var obj = { prop: 1 };

			console.log(define(obj));
			console.log(define(obj, 'prop'));

			obj.define = define.oo;

			obj.define({ nonEnum: { enumerable: false, value: 55 }});

			console.log('obj.nonEnum', obj.nonEnum, 'isEnum?', obj.propertyIsEnumerable('nonEnum'));
		};

		// defineTests();

		var nonEnumAllTests = function(){
			var obj = {
				one: 1,
				two: 'two'
			};

			define.nonEnum.all(obj);

			for (var i in obj) console.log(i);
		};

		// nonEnumAllTests();

		var nonEnumObjTests = function(){
			console.log('nothing should follow:');

			nonEnumObj1 = define.nonEnum({}, { prop1: 1, prop2: 'two' });

			for (var i in nonEnumObj1)
				console.log(i, nonEnumObj1[i]);

			// console.log(nonEnumObj1);
		};

		var nonEnumPropTests = function(){
			console.log('nothing should follow:');

			nonEnumObj2 = define.nonEnum({ prop: 5 }, 'prop');

			for (var i in nonEnumObj2)
				console.log(i, nonEnumObj2[i]);

			// console.log(nonEnumObj2);			
		};

		var nonEnumArrayTests = function(){
			console.log('only prop third is left enumerable:');

			nonEnumObj3 = define.nonEnum({ prop: 5, another: 1, third: 'three' }, ['prop', 'another']);

			for (var i in nonEnumObj3)
				console.log(i, nonEnumObj3[i]);

			// console.log(nonEnumObj3);

		};

		var nonEnumOOTests = function(){
			console.log('nothing should follow:');

			nonEnumObj4 = define.nonEnum({}, {nonEnum: define.nonEnum.oo});

			nonEnumObj4.prop = 12328484;
			nonEnumObj4.nonEnum('prop');
			nonEnumObj4.thisShouldShowUp = 5;
			nonEnumObj4.thisShouldNotShowUp = 1923;
			nonEnumObj4.nonEnum(['one', 'two', 'another', 'thisShouldNotShowUp']);
			nonEnumObj4.nonEnum({define: define.oo});

			console.log(nonEnumObj4.define());

			for (var i in nonEnumObj4)
				console.log(i, nonEnumObj4[i]);

			console.log(nonEnumObj4);
		};

		var nonEnumTests = function(){
			// nonEnumObjTests();
			// nonEnumPropTests();
			// nonEnumArrayTests();
			nonEnumOOTests();
		};

		// nonEnumTests();
	});
})(MPL);
