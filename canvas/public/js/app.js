;(function($){

	var makeChainableMethod = function(ctx, methodName, cC){
		return function(){
			ctx[methodName].apply(ctx,arguments);
			return cC;
		}
	};

	var chainableCtx = function(ctx){
		var cC = {},
			cMethods = ['beginPath', 'moveTo', 'lineTo', 'arc', 'stroke'];

		for (var i = 0; i < cMethods.length; i++){
			cC[cMethods[i]] = makeChainableMethod(ctx, cMethods[i], cC);
		}

		return cC;
	};

	$(function(){
		var $canvas = $('#canvas1'),
			canvas = $canvas[0],
			ctx = canvas.getContext('2d'),
			cc = chainableCtx(ctx);		
		// ctx.beginPath();
		// ctx.moveTo(10,10);
		// ctx.lineTo(200,200);
		// ctx.stroke();

		cc
			.beginPath()
			.moveTo(10,10)
			.lineTo(200,200)
			.lineTo(100,200)
			// .arc()
			.stroke();

	});
})(jQuery);