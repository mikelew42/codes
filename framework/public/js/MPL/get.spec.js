describe("get/set", function(){
	var obj = {
			level1: "lvl1value",
			sub: {
				level2: "lvl2value",
				subsub: {
					level3: "lvl3value"
				}
			}
	};

	describe("get", function(){
		var get = MPL.get;
			
		it("should return the value", function(){
			expect(get(obj, "level1")).toBe("lvl1value");
			expect(get(obj, "sub.level2")).toBe("lvl2value");
			expect(get(obj, "sub.subsub.level3")).toBe("lvl3value");
		});
	});

	describe("getter", function(){
		var getter = MPL.getter;

		it("should return a function that returns the value", function(){
			expect(getter(obj, "level1")()).toBe("lvl1value");
			expect(getter(obj, "sub.level2")()).toBe("lvl2value");
			expect(getter(obj, "sub.subsub.level3")()).toBe("lvl3value");
			// setTimeout(function(){}, 5000); wouldn't work..
		});
	});

	describe("set", function(){
		var set = MPL.set;

		it("should set the value", function(){
			var obj = { sub: { subsub: {} } };
			set(obj, 'lvl1', 'lvl1value');
			set(obj, 'sub.lvl2', 'lvl2value');
			set(obj, 'sub.subsub.lvl3', 'lvl3value');
			expect(obj.lvl1).toBe('lvl1value');
			expect(obj.sub.lvl2).toBe('lvl2value');
			expect(obj.sub.subsub.lvl3).toBe('lvl3value');
		});
	});

	describe("setter", function(){
		var setter = MPL.setter,
			obj = { sub: { subsub: {} } };

		it("should return a function that sets the value", function(){

			setter(obj, 'lvl1', 'lvl1value')();
			expect(obj.lvl1).toBe('lvl1value');

			setter(obj, 'sub.lvl2', 'lvl2value')();
			expect(obj.sub.lvl2).toBe('lvl2value');

			setter(obj, 'sub.subsub.lvl3', 'lvl3value')();
			expect(obj.sub.subsub.lvl3).toBe('lvl3value');

		});

		it("should allow you to override the value", function(){
			setter(obj, "sub.subsub.lvl3")("newlvl3value");
			expect(obj.sub.subsub.lvl3).toBe("newlvl3value");
		});

		describe("some variations", function(){
			var sttr;

			it("fn created with 'setter' should return itself", function(){
				sttr = setter(obj, "sub.subsub.lvl3", "lvl3default")();
				expect(typeof sttr).toBe("function");
			});

			it("should accept a default value", function(){
				sttr();
				expect(obj.sub.subsub.lvl3).toBe("lvl3default");
			});

			it("should allow default and override using the same setter", function(){
				sttr("lvl3override");
				expect(obj.sub.subsub.lvl3).toBe("lvl3override");
				sttr();
				expect(obj.sub.subsub.lvl3).toBe("lvl3default");
			});
		});

	});
});