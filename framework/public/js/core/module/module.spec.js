describe("core.module", function(){
	var module = core && core.module;

	it("should exist", function(){
		expect(module).toBeDefined();
	});

	it("should return a natural invoker module function", function(){
		var obj = {};

		obj.mod = module(function(){
			expect(this).toBe(obj);
		});

		obj.mod();
	});

	it("should allow ctx property to be 'self'", function(){
		
	});
});