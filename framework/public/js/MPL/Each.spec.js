xdescribe("Each", function(){
	var each, obj, fn;

	it("var each = MPL.Each()", function(){
		each = MPL.Each();
		expect(typeof each).toBe('function');
	});

	var mockObj = function(){
		var prot,
			obj;

		prot = {
			protoProp: "defined on the prototype object"
		};
		
		Object.defineProperty(prot, 'nonEnumProtoProp', { enumerable: false, value: "defined as nonenumerable on the prototype object" });
		
		obj = Object.create(prot);
		obj.ownProp = "defined on the actual object";
		
		Object.defineProperty(obj, 'nonEnumOwnProp', { enumerable: false, value: "defined as nonenumerable on the actual object"});

		return obj;
	};

	var mockFn = function(){
		var fn = function(){
			console.log("I'm just a test function!");
		};
		fn.fnProp = "defined on the fn obj";
		return fn;
	};

	var forInOrder = function(obj){
		var order = [];
		for (var i in obj)
			order.push(i);
		return order;
	};

	var eachOrder = function(obj){
		var order = [];
		each(obj, function(v, i){
			order.push(i);
		});
		return order;
	};

	var ooEachOrder = function(obj){
		var order = [];
		obj.each(function(v, i){
			order.push(i);
		});
		return order;
	};

	obj = mockObj();
	fn = mockFn();

	MPL.Each.installer(obj);
	MPL.Each.installer(fn);

	describe("standalone", function(){

		describe("each(obj, function(v, i){...} );", function(){

			it('Is equivalent to "for (var i in obj)"', function(){
				expect(eachOrder( obj )).toEqual( forInOrder(obj) );
			});	

			it('Is equivalent to "for (var i in fn)"', function(){
				expect(eachOrder( fn )).toEqual(forInOrder( fn ));
			});
		});

		describe("each(obj);", function(){
			xit('should return an array of object\'s keys, in the "for (var i in obj)" order', function(){
				expect(each(obj)).toEqual(forInOrder(obj));
			});
		});

	});

	describe("oo", function(){

		describe("obj.each(function(v, i){...} );", function(){

			it('Is equivalent to "for (var i in obj)"', function(){
				expect(ooEachOrder(obj)).toEqual(forInOrder(obj));
			});

			it('Is equivalent to "for (var i in fn)"', function(){
				expect(ooEachOrder(fn)).toEqual(forInOrder(fn));
			});
		});

		describe("obj.each()", function(){
			xit("should return an array of obj's keys, in the 'for (var i in obj)' order", function(){
				expect(obj.each()).toEqual(forInOrder(obj));
			});
		});
	});

});
describe("EachTemp", function(){
	var Each = MPL.Each,
		group = function(label, fn){
			console.group(label);
			fn();
			console.groupEnd();
		};
	it("should be able to iterate", function(){

		var each = Each({ log:false });
		each({ a: 1, b: "two"}, function(v, i){});
		expect(true).toBe(true);
	});

	it(".keys should return an array of keys", function(){
		var each = Each();
		expect(each.keys({a: 1, b: "two"})).toEqual(['a', 'b'])
	});

});

describe("CtxTest", function(){
	var Module = MPL.CtxAssigner(),
		Test = Module({ prop: 5, _name: "Test" });
		Test.init(function(){
			console.log(this._name + '.init(', arguments, ');');
			this.sub = Module({ host: this });
			var host = this;
			this.sub.invoke = function(){
				expect(this).toBe(host.sub);
				expect(this.host).toBe(host);
			};
			this.sub.subsub = Module({ctx: this});
		});

	it("calling Module() should trigger init, and assign all incoming props", function(){
		expect(Test.prop).toBe(5);
	});
	it('test.sub should have self context', function(){
		var test = Test({ _name: "test" });
		test.sub.invoke = function(){
			expect(this).toBe(test.sub);
		};
		test.sub();
	});

	it('test.sub.sub', function(){
		var test = Test({ _name: "test" });
		test.sub.subsub.invoke = function(){
			expect(this).toBe(test);
			this.sub();
		};
		test.sub.subsub();
	});
});


describe("Test", function(){

	var TestFactory = MPL.TestFactory;

	it("should have .invoke, .create, and .factory properties", function(){
		var Test = TestFactory();
		expect(Test.invoke).toBeDefined();
		expect(Test.create).toBeDefined();
		expect(Test.factory).toBeDefined();
	});

	it("should clone itself upon invocation", function(){
		var Test = TestFactory(),
			Clone = Test();

		expect(Test).not.toBe(Clone);
		expect(Clone.invoke).toBeDefined();
		expect(Test.invoke).not.toBe(Clone.invoke);
		expect(Clone.prop).toBe(5);
	});
});


describe("Test2", function(){
	var Test2 = MPL.Test2;

	it("should have .invoke, .create, and .Base properties", function(){
		var test2 = Test2();

		expect(test2.invoke).toBeDefined();
		expect(test2.create).toBeDefined();
		expect(test2.Base).toBeDefined();
	});

	it("should clone itself upon invocation", function(){
		var test2 = Test2(),
			clone = test2();

		expect(test2).not.toBe(clone);
		// expect(test2.create).toBe(clone.create);
		expect(test2.prop).not.toBe(clone.prop);
		expect(test2.prop.prop).toBe(clone.prop.prop);
	});
});


describe("Module", function(){
	var Module = MPL.Module();

	//beforeEach(function(){
		// Mod = Module();
	// });

	it("should clone itself upon invocation", function(){
		var Mod = Module(),
			ModClone;

		Mod.prop = 5;
		ModClone = Mod();

		expect(ModClone.prop).toBe(5);
	});

	it("use .invoke to change invocation behavior", function(){
		var Mod = Module(),
			check = false;

		Mod.invoke = function(){
			check = true;
		};

		Mod();

		expect(check).toBe(true);
	});
});

// describe("Event", function(){
// 	var Event = MPL.Event.clone();
// console.dir(Event);
// 	it("should have NaturalInvoker as .Base", function(){
// 		expect(Event.Base).toBe(MPL.NaturalInvoker);
// 	});

// 	it("should be able to create new events", function(){
// 		var event = Event();
// 	});
// });

describe("isArray", function(){
	var isArray = MPL.isArray;
	it("should pass only for arrays", function(){
		expect(isArray([])).toBe(true);
		expect(isArray([1, 2, 3])).toBe(true);
		expect(isArray(['four', 5])).toBe(true);
		expect(isArray( Array(1, 2, 3) )).toBe(true);
		expect(isArray({})).toBe(false);
		expect(isArray(function(){})).toBe(false);
	});
});

describe("isObject", function(){
	var isObject = MPL.isObject;
	it("should pass only for objects", function(){
		expect(isObject({})).toBe(true);
		expect(isObject(true)).toBe(false);
		expect(isObject([])).toBe(false);
		expect(isObject(function(){})).toBe(false);
	});
});

describe("SimpleEvent", function(){
	var SimpleEvent = MPL.SimpleEvent;

	it("should act like a normal function", function(){
		var check = false, evnt = SimpleEvent(function(){
			check = true;
		});
		evnt();
		expect(check).toBe(true);
	});

	it("should be object oriented", function(){
		var Mod = MPL.Module(), check = 0;
		Mod.init = SimpleEvent(function(){
			// console.log('This is mod.init()');
			check++;
		});
		Mod.init(function(){
			// console.log('another initilaizer');
			check++;
		});
		var mod = Mod();
		expect(check).toBe(2);
	});
});