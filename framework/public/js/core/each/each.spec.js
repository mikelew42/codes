describe("core.Each", function(){
	var Each = core && core.Each;

	it("should exist", function(){
		expect(Each).toBeDefined();
	});

	describe("Each.installer", function(){
		var fn;
		beforeEach(function(){
			fn = Each.installer(function(){});
		});

		it("should define nonEnum .each function", function(){
			expect(Object.getOwnPropertyDescriptor(fn, 'each').enumerable).toBe(false);
			expect(typeof fn.each).toBe('function');
		});

		it("should iterate over all enum properties", function(){
			var props = [];
			fn.each(function(v, i){
				props.push(i);
			});
			expect(props).toEqual([]);

			fn.one = 1;
			fn.two = "two";
			fn.each(function(v, i){
				props.push(i);
			});
			expect(props).toEqual(['one', 'two']);
		});
	});
});