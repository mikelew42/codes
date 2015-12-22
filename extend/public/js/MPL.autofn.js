;(function(){
	
	// create internal MPL,
	var MPL =

		// also create global MPL
		window.MPL = 

			// assign them both to

				// the current MPL if it exists, otherwise
				window.MPL || 

					// a new module
					{};

	var extend = MPL.extend || function(){};

	var counter = 1;
	var auto = MPL.autofn = function(fn, ext1, ext2){
		var args, method = function(){
			return method.fn.apply(this, arguments);
		};

		Object.defineProperties(method, {
			fn: {
				writable: true,
				configurable: true,
				enumerable: false,
				value: function(){
					console.log('auto fn()')
					console.dir(this);
					for (var i in this){
						console.log(i);
						if (this[i] === this)
							continue;
						typeof this[i] === 'function' && this[i].apply(this, arguments);
					}
				}
			},
			extend: {
				enumerable: false,
				value: function(v){
					// console.log('extending RMethod', this);
					// console.log(this.fn, arguments);
					// console.log('v', v);
					if (typeof v === 'function'){
						console.log('rewriting this.fn');
						this.fn = v;
					}
					else {
						console.log('special extend for autoFn');
						extend.extend2.oo.apply(this, arguments);
					}
					return this;
				}
			},
			clone: {
				enumerable: false,
				value: function(){
					console.log('cloning autoFn', arguments);
					var args = Array.prototype.slice.call(arguments, 0);
					/* 
						it might be wise to check if this.fn is the default, rather than reassigning it.
						although, reassigning it here might not make a huge difference

						if it was the default, you could unshift undefined to skip setting the fn.
					*/

					// i'm sensing a problem with autoFn.extend in which fn's are overwriting auto.fn, 
					// making it impossible to extend fn.subs onto an auto fn (as with this below), unless we convert
					// them into an object.  -- yep, it worked.
					args.unshift(this.fn, extend({}, this));
					var ret = auto.apply(auto, args);
					console.log('cloned autoFn', ret);
					return ret;
				}
			}
		});

		if (fn){
			// console.log('fn', fn);
			Object.defineProperty(method, 'fn', {
				writable: true,
				configurable: true,
				enumerable: false,
				value: fn
			});
			//method.fn = fn;
		}

		// console.log('method.fn', method.fn);
		
		if (arguments.length > 1){
			// console.log('arguments', arguments);
			args = Array.prototype.slice.call(arguments, 1);
			// console.log('args', args);
			method.extend.apply(method, args);
		}

		// console.dir(method);
		method.autoname = "auto" + counter;
		counter++;

		method._isAutoFn = true;
		return method;
	};

})(MPL);