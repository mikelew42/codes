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

	var SimpleEvent = MPL.SimpleEvent = function(fn){
		var ret = function(cb){
			if (typeof cb === 'function')
				ret.cbs.push(cb);
			else 
				ret.exec.apply(this, arguments);
			return this;
		};

		/*
		or, ret = function(){
			ret.fn.apply(this, arguments);
		}; and put the above logic all into the .fn.

		.fn would need a setter to detect override and copy the cbs over 

		we want to allow the unnamed cbs to be hardcoded with a new fn?
			we still need to figure out naming of cbs
		*/

		if (fn)
			ret.fn = fn;

		ret.cbs = [];
		ret.exec = function(){
			if (ret.fn)
				ret.fn.apply(this, arguments);
			for (var i = 0; i < ret.cbs.length; i++){
				ret.cbs[i].apply(this, arguments);
			}
		};

		// define getters for before and after to convert simple event into a b/a event.
		// in this way, an event can have before and after events.  and, each before/after event itself has before/after events.
		// however, cbs should really be named, but we can get to that later.

		return ret;
	};

	var anchored = true;
	var Event = MPL.Event = function(fn){
		var ret = function(cb){
			if (typeof cb === 'function'){
				ret.fn(cb);
			}
			else{
				if (anchored)
					ret.exec.apply(ret, arguments);
				else
					ret.exec.apply(this, arguments);
			}
			return this;
		};

		// these steps are rather arbitrary, and should be defined in another fn
		ret.before = SimpleEvent();
		ret.fn = SimpleEvent(fn ? fn : undefined);
		ret.after = SimpleEvent();

		ret.exec = function(){
			var ctx = anchored ? ret : this;
			ret.before.apply(ctx, arguments);
			ret.fn.apply(ctx, arguments);
			ret.after.apply(ctx, arguments);
		};
		return ret;
	};

	$(function(){
		var one = function(){
			SimpleEvent1 = SimpleEvent();
			SimpleEvent1(function(){ console.log('first'); });
			SimpleEvent1(function(){ console.log('second'); });
			SimpleEvent1();
		};
		// one();

		var two = function(){
			Event1 = Event();
			Event1(function(){ console.log('first'); });
			Event1(function(){ console.log('second'); });
			Event1();
		};
		// two();

		var three = function(){
			Event1 = Event();
			Event1(function(){ console.log('first'); });
			Event1(function(){ console.log('second'); });
			Event1.before(function(){ console.log('before'); });
			Event1.after(function(){ console.log('after'); });
			Event1();
		};
		// three();

		var simpleEventFn = function(){
			SimpleEventFn = SimpleEvent(function(){
				console.log('SimpleEventFn.fn();');
			});
			SimpleEventFn(function(){console.log('first');});
			SimpleEventFn(function(){console.log('second');});
			SimpleEventFn();
		};

		// simpleEventFn();

		var namedEvents = function(){
			NamedEvents = Event(function(){ console.log('named'); this.namedSub(); });
			NamedEvents(function(){ console.log('first'); });
			NamedEvents(function(){ console.log('second'); });
			NamedEvents.before(function(){ console.log('before'); });
			NamedEvents.after(function(){ console.log('after'); });
			NamedEvents.namedSub = function(){ console.log('named.namedSub')};
			var oldCbs = NamedEvents.fn.cbs;
			NamedEvents.fn = SimpleEvent(function(){ console.log('new fn'); this.after(); }); // would have to copy over cbs...
			NamedEvents.fn.cbs = oldCbs;
			NamedEvents();
		};

		// namedEvents();
	});
})(MPL);