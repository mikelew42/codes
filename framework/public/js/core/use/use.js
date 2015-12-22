;(function(){
	var core = window.core = window.core || {};
	
	/*
	mod.use(fn) --> fn.apply(mod, []);
	mod.use([fn, arg1, arg2]) --> fn.apply(mod, [arg1, arg2])
	mod.use({
		objLikeProp: fn --> fn.apply(mod.objLikeProp, [])
		objLikeProp2: [fn, arg1, arg2]
	})

	Usable module:
	mod(fn(){
		this === mod;  
	});

	This might be handy for sending strings as functions, and evaluating them... not sure what else

	A auto-add-init Factory could be similar:

	MyFactory(fn(){}) --> add as initializer

	This is like a creation function, except you can add lots of them

	MyFactory({pojo}) --> extend
	
	*/
})();