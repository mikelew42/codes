describe("core.define", function(){
	var define = core && core.define;

	it("depends on core.assign", function(){
		expect(core.assign).toBeDefined();
	});

	it("should exist", function(){
		expect(define).toBeDefined();
	});
});