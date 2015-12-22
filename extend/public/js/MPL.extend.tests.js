;(function(){
	
	// we can safely assume the root module (MPL) exists
	var MPL = window.MPL;

	var extend = MPL.extend;

	extend.tests = {
		one: [
			{
				a: "apple",
				oaverride: "orange",
				obj: {
					keep: "me",
					overrideMe: 'failed'
				}
			}, 
			{
				b: "banana",
				oaverride: "overridden",
				obj: {
					overrideMe: 'success',
					addMe: 123
				},
				doesNotExist: {
					yay: true
				}
			}
		],
		two: [
			{
				a: "apple",
				oaverride: "orange",
				obj: {
					keep: "me",
					overrideMe: 'failed'
				}
			}, 
			{
				b: "banana",
				oaverride: "overridden",
				obj: {
					overrideMe: 'success',
					addMe: 123
				},
				doesNotExist: {
					yay: true
				}
			}
		],
		fn: [
			{
				a: function(){
					console.log('a', this);
				}
			},
			{
				a: {
					sub: function(){
						console.log('a.sub', this);
					}
				}
			}
		]
	};

	var extendFn = function(){
		var objA = {
			a: function(){
				console.log('a', this); // "this" is the objA
				this.a.sub();
			}
		},
		objB = {
			a: {
				sub: function(){
					console.log('a.sub', this); // "this" is the a fn 
				}
			}
		};

		Object.defineProperty(objA.a, 'prop', {
			value: 55,
			enumerable: false
		});

		window.fnObj = extend(objA, objB);

		fnObj.a();

		extend(objA, { a:{ sub: function(){ console.log("a.sub replaced"); } } });

		fnObj.a();
		// console.log(fnObj === objA); // true
	};

	// extendFn();


	/* clone tests*/

	var cloneTests = function(){
		var objA = {
			a: "apple",
			sub: {
				one: 1,
				two: 2,
				subsub: {
					six: 6,
					seven: 7
				}
			}
		};
		var cloneA = objA.clone();
		objA.sub.three = 3;
		objA.sub.subsub.elf = "twelf";
		console.log(objA, cloneA);
	};

	// cloneTests();

	var cloneFn = function(){
		var fnA = function(){
			console.log('fnA', this);
		};

		fnA.sub = function(){
			console.log('fnA.sub', this);
		};
	};

	// cloneFn();

	var deepCompare = function(a, b, both){
		var ret = true;

		if (typeof both === 'undefined')
			both = true;

		for (var i in a){
			if (typeof a[i] === 'object'){
				if (typeof b[i] === 'object'){
					if (!deepCompare(a[i], b[i]))
						return false;
					// console.log('deepCompare true');
				} else {
					return false;
				}
			} else {
				if (a[i] != b[i])
					return false;
				// console.log('same: ', i, a[i] );
			}
		}

		if (both && !deepCompare(b, a, false))
			return false;

		return true;
	};

	// window.one = extend.apply(extend, extend.tests.one);
	// window.two = extend.extend.apply(extend.extend, extend.tests.two);


	// console.log(deepCompare(one, two));

	deepCompare.tests = {
		one: {
			args: [
				{
					a: "apple"
				},
				{
					a: "apple",
					b: "banana"
				}
			],
			expect: false
		},
		two: {
			args: [
				{
					a: "apple"
				},
				{
					a: "apple",
					b: "banana"
				},
				false
			],
			expect: true
		}
	};

	var testOne = function(){	
		if (deepCompare.tests.one.expect ===
			deepCompare.apply(deepCompare, deepCompare.tests.one.args))
				console.log('deepCompare.tests.one: Pass');
	};
	
	var testTwo = function(){
		if (deepCompare.tests.two.expect ===
			deepCompare.apply(deepCompare, deepCompare.tests.two.args))
			console.log('deepCompare.tests.two: Pass');
	};

	// testOne();
	// testTwo();


	/* testing such a simple function seems ridiculous.
	extend.argumentLoop.tests = {
		setup: function(){
			var self = this;
			this.savedSingleExtend = extend.singleExtend;
			extend.singleExtend = function(){

			};
		}
	};*/

	
})();