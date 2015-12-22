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

	var extend = MPL.extend,
		auto = MPL.autofn;

	// return false;

	console.groupCollapsed('preparing Item');
	var Item = {
		name: 'item1',
		debug: true,
		initialize: function(){
			this.debug && console.group('Item.initialize()');
			this.preRender();
			this.render();
			this.debug && console.groupEnd();
			return this;
		},
		preRender: auto(function(){
			this.debug && console.log('Item.preRender()', this);
			this.preRender.sub1();
			this.preRender.sub2();
			this.preRender.sub3();
		}, {
			name: 'preRender1',
			debug: true,
			sub1: function(){
				this.debug && console.log('Item.preRender.sub1()');
			},
			sub2: function(){
				this.debug && console.log('Item.preRender.sub2()');
			},
			sub3: function(){
				this.debug && console.log('Item.preRender.sub3()');
			}
		}),

		render: function(){
			console.log('Item.render()');
		}
	};

	console.groupEnd();

	Item.initialize();

	var simpleSubbing = function(){
		Item.preRender.sub1 = function(){
			console.log('new sub1');
		};
		Item.initialize();
	};
	// these permanently change Item, and should be run independently
	// simpleSubbing();

	var extendItem = function(){
		// console.log(Item.preRender.sub1);
		console.group('extendItem();')
		Item.extend({
			name: 'item1.1',
			preRender: {
				sub1: function(){
					console.log('new sub1');
				}
			}
		});
	
		Item.initialize();
		
		console.groupEnd();
	};

	// extendItem();

	var cloneAndExtend = function(){
		Item.clone({
			name: 'itemClone',
			preRender: {
				sub1: function(){
					console.log('cloned sub 1');
				}
			}
		}).initialize();

		// make sure this remains
		Item.initialize();
	};

	// cloneAndExtend();

	// console.dir(Item.clone().preRender);

	var reorder = function(){
			Item.clone().extend({
				preRender: function(){
					console.log(this);
					console.log('fudge the order');
					this.preRender.sub3();
					this.preRender.sub1();
					this.preRender.sub2();
				},
			}).initialize();

			Item.initialize();
	};

	// reorder();

	var nested = function(){
		var item2 =Item.clone({
			name: "item2",
			preRender: {
				sub2:  function(){ console.log('yo'); }
			}
		})
		// .extend({
		// 	preRender: {
		// 		sub2: {
		// 			evented: function(){
		// 				console.log('new event!');
		// 			}
		// 		}
		// 	}
		// })
		// console.log(item2.preRender.sub2.fn);
		item2.preRender.sub2();
		item2.preRender.sub2.newFn = function(){
			console.log('wtf');
		};
		// console.dir(item2.preRender.sub2);
		// item2.preRender.sub2.newFn();

		// item2.preRender.sub2();

		// item2.initialize();

		// item2.preRender.sub2();
	};

	// nested();





	var test = function(){
		console.log(extend({
			a: function(){}
		}, { a: function(){} }))
	};

	// test();




	var one = function(){

		var tmp = function(){

					console.log('extendedFn');
					this.extendedFn.a();
		};

		tmp.id = s4();
		console.dir(tmp);

		var obj1 = {
			rootFn: function(){
				console.log('rootFn');
			},
			extendedFn: extend(
				tmp, {
					a: function(){
						console.log('extendedFn.a');
					}
				}
			)
		};

		console.dir(obj1);
		obj1.extendedFn.id = s4();
		
		obj1.extendedFn();

		console.dir(obj1);
		
	};

	// one();


	function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	               .toString(16)
	               .substring(1);
	  }
})(MPL);