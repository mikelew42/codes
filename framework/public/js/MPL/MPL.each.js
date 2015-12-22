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

	var each = MPL.each = function(obj, fn){
		each.log && console.group('each');
		each.log && console.groupCollapsed('arguments');
		each.log && console.log(obj);
		each.log && console.log(fn);
		each.log && console.groupEnd();
		for (var i in obj){
			each.log && console.groupCollapsed(i);
			fn.apply(obj, [obj[i], i]);
			each.log && console.groupEnd();
		}
		each.log && console.groupEnd();
		return obj;
	};

	each.log = log;
	each.previousLog = [];
	each.setLog = function(bool){
		each.previousLog.push(each.log);
		each.log = bool;
	};
	each.resetLog = function(){
		// what happens if we reset one too many times?  bad things will happen...
		each.log = each.previousLog[each.previousLog.length-1];
		each.previousLog.pop();
	};

	each.oo = function(fn){
		return each(this, fn);
	};

	var each2 = function(fn){
		var log = !fn;
		log && console.group('each:');
		fn = fn || function(v, i){ console.log(i); };
		for (var i in this)
			fn.apply(this, [this[i], i]);
		log && console.groupEnd();
		return this;
	};

	$(function(){
		var eachTests = function(){
			eachObj = { one: 1, two: 'two' };
			each(eachObj, function(v, i){
				console.log('value', v);
				console.log('index', i);
			});

			Object.defineProperty(eachObj, 'each', { enumerable: false, value: each.oo });

			eachObj.each(function(v, i){
				console.log('oo each', v, i);
			});
		};

		// eachTests();
		/*
		console.log('log on');
		eachTests();
		
		each.setLog(false);
		console.log('log off');
		eachTests();
		
		console.log('log on');
		each.setLog(true);
		eachTests();

		console.log('reset (should be off)');
		each.resetLog();
		eachTests();
		
		console.log('reset (should be on)');
		each.resetLog();
		eachTests();*/
	});
})();
