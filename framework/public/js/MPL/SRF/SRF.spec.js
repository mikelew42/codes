describe("SRF", function(){
	var SRF = MPL.SRF;

	it("should be a function", function(){
		expect(typeof SRF).toBe('function');
	});

	it("should return a function", function(){
		expect(typeof SRF()).toBe('function');
	});

	describe("srf", function(){
		var srf = SRF();

		it("is just a function", function(){
			expect(typeof srf).toBe('function');
		});

		it("can do something", function(){
			expect(srf()).toBe('main');
		});

		it("can have properties", function(){
			expect(srf.prop).toBe(5);
		});

		it("can act as an organizational container", function(){
			expect(srf.util1()).toBe('util1');
		});

		it("can access its own properties", function(){
			expect(srf.accessSelf()).toBe(5);
			expect(srf.accessThis()).toBe(5);
		});
		
	});
});

describe("SBEF", function(){
	var SBEF = MPL.SBEF;

	it("should call .main", function(){
		var check = false;
		var sbef = SBEF(function(){
			check = true;
		});
		sbef();
		expect(check).toBe(true);
	});

	it("should be self bound", function(){
		var sbef = SBEF(function(){
			expect(this).toBe(sbef);
		});
		sbef();
	});
	// and therefor can access its subs.

});