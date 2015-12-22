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

	var log = false;

	var noLogExtend = function(){
		var lastLog = log, ret;
		log = false;
		ret = extend.apply(this, arguments);
		log = lastLog;
		return ret;
	};

	var snapshot = function(obj){
		return noLogExtend({}, obj);
	};

	var extend = MPL.extend = function(base){
		var logAr;
		if (log){
			logAr = Array.prototype.slice.call(arguments, 1);
			logAr.unshift('extend', snapshot(base));
			console.groupCollapsed.apply(console, logAr);
		}

		extend.argumentLoop.apply(this, arguments);
		log && console.log('new base: ', base);
		log && console.groupEnd();
		return base;
	};

	extend.argumentLoop = function(base, ext1, ext2){
		log && console.log('base snapshot', snapshot(base));
		for (var i = 1; i < arguments.length; i++){
			if (arguments[i] === base){
				log && console.log('avoiding recursion');
				continue;
			}
			log && console.group('ext'+i, arguments[i]);
			extend.singleExtend(base, arguments[i]);
			log && console.groupEnd();
		}
	};

	extend.singleExtend = function(base, ext){
		for (var i in ext){
			if (ext[i] === base){
				log && console.log('avoiding recursion');
				continue;
			}
			log && console.groupCollapsed('[ base.'+i+':', base[i], '] <-- [', 'ext.'+i, ext[i], ']');
			base[i] = extend.handler(base[i], ext[i]);
			log && console.groupEnd();
		}
	};

	extend.handlers = {};

	extend.handlers.simpleAssign = function(base, ext){
		return ext;
	};

	var isValue = function(check){
		return typeof check === 'string' || typeof check === 'boolean' || typeof check === 'number';
	};

	extend.handlers.deepExtend = function(base, ext){
		if (base && base.extend && !isValue(ext)){
			return base.extend(ext);
		} else if (typeof ext === 'object'){
			if (typeof base === 'object' || typeof base === 'function'){
				log && console.log('extend(base, ext)');
				return extend(base, ext);
			} else {
				log && console.log('extend({}, ext)');
				return extend({}, ext);
			}
		} else {
			log && console.log('simply set to', ext);
			return ext;
		}
	};

	extend.handler = extend.handlers.deepExtend;

	extend.extend = function(base, ext1, ext2){
		var arg, prop;
		for (arg = 1; arg < arguments.length; arg++){
			for (prop in arguments[arg]){
				if (typeof arguments[arg][prop] === 'object'){
					if (typeof base[prop] === 'object' || typeof base[prop] === 'function')
						extend.extend(base[prop], arguments[arg][prop]);
					else
						base[prop] = extend.extend({}, arguments[arg][prop]);
				} else {
					base[prop] = arguments[arg][prop];
				}
			}
		}
		return base;
	};	

	extend.extend2 = function(base, ext1, ext2){
		var arg, prop;
		console.groupCollapsed('extend', base, Array.prototype.slice.call(arguments, 1));
		for (arg = 1; arg < arguments.length; arg++){
			// console.groupCollapsed('arg', arg, arguments[arg]);
			console.log('arg', arg, arguments[arg]);

			if (arguments[arg].fn)
				base.fn = arguments[arg].fn.clone();

			for (prop in arguments[arg]){
				console.group('prop', prop);
				console.log(base[prop], '<--', arguments[arg][prop]);

				if (prop === 'id')
					continue;

				// if (typeof base[prop] === "object" || typeof base[prop] === "function" && typeof base[prop].extend === "function"){
				if (base[prop] && base[prop]._isAutoFn){
					console.log('found oo extend for autoFn, prop:', prop);
					base[prop].extend(arguments[arg][prop]);
					console.groupEnd();
					continue;
				}

				if (typeof arguments[arg][prop] === 'object'){
					console.log('obj obj');
					if (typeof base[prop] === 'object' || typeof base[prop] === 'function')
						extend.extend2(base[prop], arguments[arg][prop]);
					else
						base[prop] = extend.extend2({}, arguments[arg][prop]);
				} else if (typeof arguments[arg][prop] === 'function') {
					console.log('set base.' + prop + ' = fn.clone()');
					base[prop] = arguments[arg][prop].clone();
				} else {
					console.log('set base.' + prop + ' = ' + arguments[arg][prop]);
					base[prop] = arguments[arg][prop];
				}
				console.groupEnd();
			}

			// console.groupEnd();
		}
		console.groupEnd();
		return base;
	};

	extend.extend2.oo = function(ext1, ext2){
		// console.log('extend.oo');
		// console.log('this:', this.name, ":", this);
		// console.dir(this);
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift(this);
		extend.extend2.apply(this, args);
		// console.groupEnd();
		return this;
	};

	extend.oo = function(ext1, ext2){
		for (var i = 0; i < arguments.length; i++)
			extend.singleExtend(this, arguments[i]);
		return this;
	};

	extend.clone = function(base, ext1, ext2){
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift({});
		return extend.apply(this, args);
	};

	extend.clone.oo = function(ext1, ext2){
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift({}, this);  // {}, this, ext1, ext2...
		return extend.apply(this, args);
	};

	extend.create = function(){};
	extend.create.oo = function(args){

		var ret = extend({}, this);
		if (ret.initialize){
			this.log && console.groupCollapsed(this.type + ".initialize(", arguments, ")");
			ret.initialize.apply(ret, arguments);
			this.log && console.groupEnd();
		}
		return ret;
	};

	var defineObjProt = function(){
		Object.defineProperties(Object.prototype, {
			extend: {
				writable: true,
				enumerable: false,
				value: extend.extend2.oo
			},
			clone: {
				enumerable: false,
				value: extend.clone.oo
			},
			create: {
				enumerable: false,
				value: extend.create.oo
			}
		});
	};

	// defineObjProt();


	/*Object.defineProperty(Function.prototype, 'clone', {
		enumerable: false,
		value: function() {
		    var clone = this;
		    if(this.__isClone) {
		      clone = this.__clonedFrom;
		    }

		    var temp = function() { return clone.apply(this, arguments); };

		    extend(temp, this);

		    Object.defineProperties(temp, {
		    	__isClone: {
			    	enumerable: false,
			    	value: true		    		
		    	},
		    	__clonedFrom: {
		    		enumerable: false,
		    		value: clone
		    	}
		    });
		    
		    return temp;
		}
	});*/

})();