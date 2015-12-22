mod({}) // -->
	mod.extend({
		someSubMod: module() || MySubMod()
	}) // -->


var MyModule = Module('MyModule', function(mod){
	// creation fn?  or just initializer?  mod is the newly cloned instance
	mod({// --> mod.extend
		use: { // callables, such as utilities
			subMod1: function(){ this === subMod1 }
		},
		install: {
			newMod: module() || MySubMod()
		},
		call: {
			// this can't just call the .call method, as you might expect, because it doesn't do what we want
			// in order to extend using the call property, like this, we extend to intercept this, and call its own
			// extend.call, for example, which will loop through the props and call them
			anyFn: arg,
			anotherFn: arrArg, // can't apply multiple args, as expected
		},
		apply: {
			anyFn: [must, pass, arr],
			passAnArr: [[would, have, to, wrap]]
		},
		invoke: { // or exec?
			// these don't need to be preconfigured as "callable"
			someFn: arg || [arg1, arg2] || [[arrArg]]
		},
		// preconfigured props:
		callableFn: arg, // callable === invokeable (can't use fn.call property)
		// but, if we set .invoke to .extend, and allow mod({ call/apply: { prop: args } }), this is close
		callableFn2: [arg1, arg2],
		callableFn3: [arrArg] || [[1, 2, 3]],
		installable: module('name', fn, {ext:v}),
		installable2: 
	}) 
}, {});