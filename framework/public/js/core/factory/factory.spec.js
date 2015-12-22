describe("core.FF", function(){
	// we should probably expose FactoryFactory or FF in order to have a 
	// clone of core.Factory, so we can use it to create Factories.
	var Factory = core && core.FF();

	it("should exist", function(){
		expect(Factory).toBeDefined();
	});

	it("should clone itself to create modules", function(){
		var MyFactory = Factory();
		MyFactory.main = function(){console.log('MyFactory.main()');};
		expect(typeof MyFactory).toBe('function');
		expect(MyFactory.invoke).toBeDefined();
		expect(MyFactory.invoke).not.toBe(Factory.invoke);

		var inst = MyFactory(),
			called = false;

		inst.main = function(){
			called= true;
		};
		inst();
		expect(called).toBe(true);


		var MyAnonymousFactory = function(){
			var mod = MyFactory();
			mod.this = that;
			mod.factory = MyAnonymousFactory;
			return mod;
		};

		// vs

		// var SelfCloningFactory = MyFactory.clone( /* or here */ );
		// SelfCloningFactory.create(fn(){
		// 	// add the factory creation logic here
		// });
	});
});