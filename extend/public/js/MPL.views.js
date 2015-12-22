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


	var log = MPL.log = function(msg, obj){
		console.log('log()', arguments);
		return log.active.apply(this, arguments);
	};

	// so you can chain log('yo').log('yo') instead of just log('yo')('yo')
	log.log = function(){
		return log.apply(this, arguments);
	};

	log.argumentLoop = function(){
		for (var i = 0; i < arguments.length; i++)
			log.logSingle.call(log, arguments[i]);

		return log;
	};

	log.logSingle = function(arg){
		if (typeof arg === 'string')
			log.logMessage(arg);
		else if (typeof arg === 'object')
			log.logObject(arg);
	};

	log.logObject = function(){

	};

	// LOG AUTOMATION
	var Logify = function(obj){
		for (var i in obj)
			if (typeof obj[i] === 'function')
				logify(obj, i);
	};

	var logify = function(obj, fnName){
		var fn = obj[fnName];
		obj[fnName] = function(){
			this.log.fn(fnName, arguments);
			return this.log.ret(fn.apply(obj, arguments));
		};
	};


	var aliasFnToEl = function(fn){
		return function(){
			this.$el[fn].apply(this.$el, arguments);
			return this;
		};
	};
	var smartAliasFnToEl = function(fn){
		return function(){
			var $el;
			for (var i = 0; i < arguments.length; i++){
				this.$el[fn].call(this.$el, arguments[i].$el || arguments[i]);
			}
			return this;
		};
	};
	/* Smart fn are still necessary to append a view to a view... Also, it would be nice
	to be able to map these functions to specific $el (to append to a $container el, for example) */

	var aliasFnToView = function(view){
		['addClass', 'removeClass', 'css', 'attr', 'remove', 'empty', 'hasClass'].forEach(function(v){
				view[v] = aliasFnToEl(v);
		});		
		['appendTo', 'prependTo', 'append', 'prepend'].forEach(function(v){
				view[v] = smartAliasFnToEl(v);
		});
	};

	var Base = {
		extend: extend.oo,
		clone: extend.clone.oo,
		create: extend.create.oo
	};

	var View = Base.clone();

	aliasFnToView(View);


	var Item = View.clone({
		type: "Item",
		tag: "div",
		initialize: function(args){
			this.extend(args);
			this.render();
		},
		render: function(){
			this.$el = $('<'+ (this.tag || 'div') +'>').addClass('item');
			this.name && this.set(this.name);
		},
		set: function(label){
			this.$el.html(label);
		}
	});

	var Icon = View.clone({
		icon: 'plane',
		initialize: function(args){

			this.extend(args);
			this.render();
		},
		render: function(){
			this.$el = $('<i>').addClass('fa');
			this.icon && this.$el.addClass('fa-'+this.icon);
			// this.$parent && this.appendTo(this.$parent);
		},
		set: function(icon){
			if (icon !== this.icon){
				this.$el.removeClass('fa-'+this.icon).addClass('fa-'+ (this.icon = icon));
			}
		}
	});

	var classObjToStr = function(classObj){
		var classes = [];
		for (var i in classObj)
			if (classObj[i])
				classes.push(i);

		return classes.join(' ');
	};

	/*
	Usage:

	var item = IconItem.create({ icon: 'plane', title: ''});
	*/
	var IconItem = Item.clone({
		icon: 'cubes',
		classes: {"item": 1, "icon-item": 1, clearfix: 1},
		initialize: function(args){
			this.extend(args);
			this.render.main(this);
			return this;
		},
		render: {
			main: function(view){
				this.view = view;
				this.view.classes = classObjToStr(this.view.classes);
			
				this.el();
				this.preview();
				this.left();
				this.right();
				this.value();
				this.icon();
				this.title();
			},
			el: function(){
				this.view.$el = $('<'+ (this.view.tag || 'div') +'>').addClass(this.view.classes);
			},
			preview: function(){
				this.view.$preview = $('<div>').addClass('preview clearfix').prependTo(this.view.$el);
			},
			left: function(){
				this.view.$left = $('<div>').addClass('left col').prependTo(this.view.$preview);
			},
			right: function(){
				this.view.$right = $('<div>').addClass('right col').appendTo(this.view.$preview);
			},
			value: function(){
				this.view.$value = $('<pre>').addClass('value').appendTo(this.view.$right);
				// if (typeof this.view.value !== undefined)
				this.initValue();
			},
			initValue: function(){
				var value = this.view.value;
				this.view.value = !value;
				this.view.setValue(value);
			},
			icon: function(){
				this.view.icon = Icon.create({
					icon: this.view.icon
				});
				this.view.$icon = Icon.$el;
				this.view.icon.prependTo(this.view.$left);

			},
			title: function(){
				this.view.$title = $('<span>').addClass('title').appendTo(this.view.$left);
				this.view.$subtitle = $('<span>').addClass('subtitle').appendTo(this.view.$left);
				if (this.view.subtitle)
					this.view.$subtitle.html(this.view.subtitle);
				if (this.view.title)
					this.view.$title.html(this.view.title);
			}
		},
		setTitle: function(title){
			if (title !== this.title){
				this.$title.html(title);
				this.title = title;
			}
			return this;
		},
		setSubtitle: function(subtitle){
			if (subtitle !== this.subtitle){
				this.$subtitle.html(subtitle);
				this.subtitle = subtitle;
			}
			return this;
		},
		setValue: function(value){
			if (value !== this.value){
				this.$value.html(JSON.stringify(value));
				this.value = value;
			}
			return this;
		}
	});

	var ExpandableItem = IconItem.clone({
		// log: true,
		classes: {
			expandable: 1
		},
		initialize: function(args){
			this.extend(args);
			this.render.main(this);
			this.render.content();
			this.render.expandable();
			return this;
		},
		render: {
			content: function(){
				this.view.$content = $('<div>')
					.addClass('content')
					.appendTo(this.view.$el)
					.html('Hello world<br />Yo Yo <br /> Yoooo asdf asldfkja dsf ');

				this.view.collapsing = false;
				this.view.expanding = false;

				if (this.view.expanded || this.view.collapsed === false){
					this.view.collapsed = false;
					this.view.expanded = true;
					this.view.addClass('expanded');
					// this.view.$content.show(); // default

				} else {
					this.view.collapsed = true;
					this.view.expanded = false;
					this.view.addClass('collapsed');
					this.view.$content.hide();
				}
			},
			expandable: function(){
				var view = this.view;
				view.$preview.click(function(){
					view.toggle();
				});
			}
		},
		toggle: function(){
			var log = false; // this.log
			log && console.group('toggle()');
			if (this.expanded || this.expanding)
				this.collapse();
			else if (this.collapsed || this.collapsing)
				this.expand();
			log && console.groupEnd();
			return this;
		},
		expand: function(){
			var self = this;
			if (!this.expanded){
				this.collapsed = false;
				this.expanding = true;
				this.collapsing = false;
				this.removeClass('collapsed collapsing').addClass('expanding');
				this.$content.stop().slideDown(function(){
					self.addClass('expanded').removeClass('expanding');
					self.expanded = true;
					self.expanding = false;
				});
			}
			return this;
		},
		collapse: function(){
			var self = this;
			if (!this.collapsed){
				self.expanded = false;
				self.collapsing = true;
				self.expanding = false;
				self.addClass('collapsing').removeClass('expanded expanding');
				this.$content.stop().slideUp(function(){
					self.removeClass('collapsing').addClass('collapsed');
					self.collapsed = true;
					self.collapsing = false;
				});
			}
			return this;
		}
	});

	var Container = View.clone({
		type: "Container",
		initialize: function($el){
			this.$el = $el;
		},
		add: function(view){
			this.append(view.$el);
		}
	});

	var NumberItem = IconItem.clone({
		icon: "calculator",
		subtitle: "number"
	});

	var TrueItem = IconItem.clone({
		icon: "circle",
		subtitle: "trulean"
	});	

	var FalseItem = IconItem.clone({
		icon: "circle-thin",
		subtitle: "foolean"
	});

	var StringItem = IconItem.clone({
		icon: "quote-left",
		subtitle: "string"
	});

	var FunctionItem = IconItem.clone({
		icon: "bolt",
		subtitle: "function",
		setValue: function(value){
			typeof value !== "undefined" && this.$value.html(value.toString());
			return this;
		}
	});

	var ObjectItem = ExpandableItem.clone({
		icon: "cube",
		subtitle: "object"
	});	

	var ArrayItem = IconItem.clone({
		icon: "bars",
		subtitle: "array"
	});

	var FolderItem = IconItem.clone({
		icon: "folder",
		subtitle: "folder"
	});


	

	log.active = log.argumentLoop;

	$(function(){
		var item = Item.create({ name: 'Test' });
		var item2 = Item.create({ name: 'Test2'});
		var icon = Icon.create({ icon: 'beer'});
		var iconItem = IconItem.create({ title: "WTF", subtitle: "foolean", icon: 'folder', value: "123" });
		iconItem.setTitle('New Title').setSubtitle('trulean').icon.set('book');

		window.objItem = ExpandableItem.create({
			icon: "cubes",
			title: "objName",
			subtitle: "object",
			value: "13 properties",
			expanded: true
		});
		// objItem.$content.append(Icon.create({name: 'beer'}), 'two');


		Icon.create({ icon: 'beer' }).appendTo(objItem.$content);

		var container = Container.create($('.container'))
			.prepend(item.prepend(icon))
			.prepend(item2.prepend(Icon.create({icon: 'calculator'})))
			.prepend(iconItem)
			.prepend(objItem);


		var numberItem = NumberItem.create({ title: 'numberItem', value: 123 }).prependTo(container);
		var trueItem = TrueItem.create({ title: 'trueItem', value: true }).prependTo(container);
		var falseItem = FalseItem.create({ title: 'falseItem', value: false }).prependTo(container);
		var stringItem = StringItem.create({ title: 'stringItem', value: "this is my string this is my string this is my string this is my string this is my string this is my string this is my string this is my string this is my string this is my string this is my string this is my string this is my string this is my string this is my string" }).prependTo(container);
		var functionItem = FunctionItem.create({ title: 'functionItem', value: function(){ console.log('this is a functionnnn'); } }).prependTo(container) //.setValue(function(){ console.log('this is a funciton'); });
		// var functionItem = FunctionItem.create({ title: 'functionItem' }).prependTo(container).setValue(function(){ console.log('this is a funciton'); });
		var objectItem = ObjectItem.create({ title: 'objectItem' }).prependTo(container).setValue({one: 2, three: "four", five: false, fn: function(){ console.log('yo'); }});
		// var arrayItem = ArrayItem.clone({ title: 'arrayItem' });
		// arrayItem.value = [1, 2, { one: 2, three: 4 }];
		// arrayItem.initialize().prependTo(container);
		var arrayItem = ArrayItem.create({ title: "arrayItem" }).prependTo(container).setValue([1,2,{three: 'four', five: 6}]);
		var folderItem = FolderItem.create({ title: 'folderItem', value: "5 items" }).prependTo(container);



		/*
		If this obj used a global log fn that took "this" as context, then we could decide whether to nest obj.methods together, or whether
		the next log is a different object, and needs a new group.
		*/
		var logifyTests = function(){
			var obj = {
				log: {
					fn: function(fnName, args){ console.groupCollapsed(fnName, args); },
					ret: function(ret){ console.log('return', ret); console.groupEnd(); },
					i: function(){
						console.log('i: ', obj.i);
					}
				},
				test: function(){
					console.log('obj.test');
					return 5;
				},
				sum: function(a, b){
					return a + b;
				},
				ooLoop: function(){
					for (this.i = 0; this.i < 10; this.i ++)
						this.log.i();
				}
			};
			Logify(obj);
			obj.test('one', 2);
			obj.test('three', 4);
			obj.sum(5, 19);
			obj.ooLoop();
		};

		// logifyTests();
	});
})(MPL);