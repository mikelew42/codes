;(function(){
	var core = window.core = window.core || {};
	
	var Each = core.Each = function(){};

	Each.installer = function(obj){
		Object.defineProperty(obj, 'each', {
			enumerable: false,
			value: function(fn){
				for (var i in obj){
					fn.apply(fn.ctx || obj, [obj[i], i]);
				}
				return obj;
			}
		});
		return obj;
	};
})();


/*
Interesting upgrade:  if additional arg is passed to each, that could mean that you want
to return a function that can be executed in the future:

obj.each(function(v, i){}) --> executes immediately

obj.each(function(v, i, args){})
or
obj.each(function(){}, args); --> returns a function, which, upon invocation, will perform the iteration

The benefit here is passing this as a callback:

another.evnt(obj.each(function(){
	// perform this obj.each iteration upon another.evnt
}, 1));

I suppose this isn't necessary because you can always do this:

another.evnt(function(){
	obj.each(fn);
});

which is almost exactly the same thing.
*/