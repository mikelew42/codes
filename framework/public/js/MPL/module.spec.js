describe("Module", function(){
	var Module = MPL.Module(),
		mod = Module();

	mod.invoke = function(){
		expect(this).toBe(mod);
	};
	
	it("should clone itself", function(){
		expect(mod).not.toBe(Module);
		// expect(MPL.clone(mod, {})).toEqual(MPL.clone(Module, {})); // nope
	});

	it("should be invoked with self context", function(){
		mod();
	});
});

describe("Nodule", function(){
	 var Nodule = MPL.Nodule(),
		nod = Nodule(),
		host = {};

	host.nod = nod;

	nod.invoke = function(){
		expect(this).toBe(host);
	};

	it("should be invoked with natural context", function(){
		host.nod();
	});
});