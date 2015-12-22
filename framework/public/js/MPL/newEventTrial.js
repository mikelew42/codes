/*

Potential Solution:  Use the SimpleEvent style where everything is temporarily
bound, and "this" remains the host object.  If extension is needed, just rebind...

*/



// new Event stuff
 //// EVENT
 	// when do we switch from .invoke => .clone to .invoke => .combo?
 	// A) when we clone == init
	var Event = MPL.Event = Module();
	// Event.Base = NaturalInvoker;
	Event.combo = function(cb){
		if (typeof cb === 'function'){
			this.cbs.push(cb);
			return this.host;
		} else {
			return this.trigger.apply(this.host, arguments);
		}
	};

	Event.trigger= function(){
		if (this.fn){
			this.fn.apply(this, arguments);
		}

		for (var i = 0; i < this.cbs.length; i++){
			this.cbs[i].apply(this, arguments);
		}
		return this;
	};

	Event.init = function(fn){
		this.cbs = [];
		if (fn) this.fn = fn;
		this.invoke = this.combo;
	};

	// a problem with an "OO" installer:
		// you'll either need to install it as  hardcoded name
		// or the name doesn't matter - but you still pass in the obj.

		// mod.myEvent = Event.OO({ host: mod });
	Event.installer = function(obj){
		// obj.
	};

	// use initializers to add self-referencing subs?
	/*
	What's wrong with installing the OO .host reference?  
	Do all the fns need to be rewritten?

	*/

	Event.OO = function(){
		var c = this.clone.apply(this, arguments);
		c.Base = NaturalInvoker;
		c.init = function(fn){
			this.cbs = [];
			if (fn) this.fn = fn;
			this.invoke = this.combo;

		};
	};