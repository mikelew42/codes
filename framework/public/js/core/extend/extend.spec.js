describe("core.Extend", function(){
	var Extend = core && core.Extend;

	it("should exist", function(){
		expect(Extend).toBeDefined();
	});

	describe("Extend.installer", function(){
		var fn;
		
		beforeEach(function(){
			fn = Extend.installer(function(){});
		});
		
		it("should install nonEnum .extend fn", function(){
			expect(Object.getOwnPropertyDescriptor(fn, 'extend').enumerable).toBe(false);
			expect(typeof fn.extend).toBe('function');
		});
		
		it('when extending with an installer, it should install', function(){
			var installer = Extend.installer(function(){}),
				installed = false;

			installer.installation = function(){ installed = true; };
			fn.extend(installer);

			expect(installed).toBe(true);
		});

		it("when extending with a function, it should use it", function(){
			fn.extend(function(){
				expect(this).toBe(fn);
			});
		});

		describe("extending with an object", function(){

			it("should assign those props", function(){
				fn.extend({ prop1: 1, prop2: "two" }, { prop3: 33 });
				expect(fn.prop1).toBe(1);
				expect(fn.prop2).toBe("two");
				expect(fn.prop3).toBe(33);

			});

			it("when extending with an object, it should look for an extend on that property", function(){
				var extendedWith;
				fn.extendableProp = { extend: function(arg){
					extendedWith = arg;
				} };

				fn.extend({extendableProp: { prop1: 1} });
				expect(extendedWith).toEqual({prop1: 1});
			});
		});

		describe("installing props", function(){
			it("should install props as nonEnum", function(){	
				fn.install({
					nonEnumProp: 1
				});

				expect(fn.nonEnumProp).toBe(1);
				expect(Object.getOwnPropertyDescriptor(fn, 'nonEnumProp').enumerable).toBe(false);
			});
		});
	});
});