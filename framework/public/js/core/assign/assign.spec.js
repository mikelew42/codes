describe("core.Assign", function(){
	var Assign = core && core.Assign;

	it("should exist", function(){
		expect(Assign).toBeDefined();
	});

	describe("Assign()", function(){
		var assign = Assign();

		it("should return an instance of assign", function(){
			expect(typeof assign).toBe('function');
		});

		it("should assign props", function(){
			var test = assign({ base: 1}, { ext: 2, OR: 2}, { OR: 3, three: 33 });
			expect(test).toEqual({ base: 1, ext: 2, OR: 3, three: 33 });
		});
	});

	describe("Assign.installer", function(){
		var fn = Assign.installer(function(){});
		it("should install a nonEnum .assign function", function(){
			expect(Object.getOwnPropertyDescriptor(fn, 'assign').enumerable).toBe(false);
			expect(typeof fn.assign).toBe('function');
		});

		it("should allow assassination of properties", function(){
			fn.assign({ one: 1, two: 2 }, { two: "two", too: 222 }, { three: 3  });
			expect(fn.one).toBe(1);
			expect(fn.two).toBe("two");
			expect(fn.too).toBe(222);
			expect(fn.three).toBe(3);
		});
	});
});