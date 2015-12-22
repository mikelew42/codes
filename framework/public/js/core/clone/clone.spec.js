mockObj = function(){
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

describe("clone", function(){
	var clone = core.clone;
	it("shoud exist", function(){
		expect(clone).toBeDefined();
	});
	it("should clone the object", function(){
		var obj = { a: 1, b: "two", c: { sub: 1 }, d: [1, 2, 3] };
		var c = clone(obj);
		expect(c).not.toBe(obj);
		expect(c).toEqual(obj);
		expect(c.c).not.toBe(obj.c);
		expect(c.c).toEqual(obj.c);
		expect(c.d).not.toBe(obj.d);
		expect(c.d).toEqual(obj.d);
	});
});