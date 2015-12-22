;(function(){

	var myScene = {
		cube: {
			x: 0, y: 0, z: 0, length: 10
		},
		zoom: 30,
		cam: {
			point: {
				x: 50,
				y: 0,
				z: 0
			},
			dist: 0.8
		}
	};

	var V = {
	  add: function(a, b){
	    return {
	      x: a.x + b.x,
	      y: a.y + b.y,
	      z: a.z + b.z
	    }
	  },
	  subtract: function(a, b){
	    return {
	      x: a.x - b.x,
	      y: a.y - b.y,
	      z: a.z - b.z
	    }
	  },
	  scale: function(s, a){
	    return {
	      x: s * a.x,
	      y: s * a.y,
	      z: s * a.z
	    }
	  },
	  dot: function(a, b){
	    return a.x*b.x + a.y*b.y + a.z*b.z;
	  },
	  cross: function(a, b){
	    return {
	      x: a.y*b.z - a.z*b.y,
	      y: a.z*b.x - a.x*b.z,
	      z: a.x*b.y - a.y*b.x
	    }
	  },
	  mag: function(a){
	    return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2));
	  },
	  dirCheck: function(a, b){
	    // assume they're parallel, and either pointing in the same dir or opposite dir
	    var axes = ['x', 'y', 'z'], axis;
	    for (var i = 0; i < axes.length; i++){
	      if (a[axes[i]] > 0){
	        if (b[axes[i]] > 0) return true;
	        else if (b[axes[i]] < 0) return false; // if they're equal, move on to another axis
	      } else if (a[axes[i]] < 0){
	        if (b[axes[i]] < 0) return true;
	        else if (b[axes[i]] > 0) return false;
	      }
	    }
	  }
	};

	var makeCube = function(cube){
	  var half = cube.length / 1,
	      px = cube.x + half,
	      py = cube.y + half,
	      pz = cube.z + half,
	      nx = cube.x - half,
	      ny = cube.y - half,
	      nz = cube.z - half
	  return [
	    // ppp
	    {
	      x: px,
	      y: py,
	      z: pz
	    },
	    // ppn
	    {
	      x: px,
	      y: py,
	      z: nz
	    },
	    // pnp
	    {
	      x: px,
	      y: ny,
	      z: pz
	    },
	    // npp
	    {
	      x: nx,
	      y: py,
	      z: pz
	    },
	    // pnn
	    {
	      x: px,
	      y: ny,
	      z: nz
	    },
	    // npn
	    {
	      x: nx,
	      y: py,
	      z: nz
	    },
	    // nnp
	    {
	      x: nx,
	      y: ny,
	      z: pz
	    },
	    // nnn
	    {
	      x: nx,
	      y: ny,
	      z: nz
	    }
	  ];
	};

	var makeCamera = function(point, screenDistance){
	  if (!screenDistance)
	    screenDistance = 0.8;
	  
	  var screen = {
	      distance: screenDistance,
	      origin: {
	        x: point.x * screenDistance,
	        y: point.y * screenDistance,
	        z: point.z * screenDistance
	      },
	      xAxisDir: {
	        x: -1 * point.z,
	        y: 0,
	        z: point.x
	      },
	      yAxisDir: {
	        x: -1*point.x*point.y,
	        y: Math.pow(point.x, 2) + Math.pow(point.z, 2),
	        z: -1*point.z*point.y
	      }
	    };
	  return {
	    point: point,
	    dist: screenDistance,
	    screen: screen
	  };
	};

	var cam = makeCamera(myScene.cam.point, myScene.cam.dist);
	var cube = makeCube(myScene.cube);
	myScene.cam = cam;
	var testPoints = [
	  {
	    x: 0, y: 1, z: 1
	  },
	  {
	    x: 0, y: 1, z: -1
	  },
	  {
	    x: 0, y: -1, z: 1
	  },
	  {
	    x: 0, y: -1, z: -1
	  }
	];
	var render = function(cam, cube, zoom){
		console.log(cam);
		console.log(cube);
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.moveTo(centerX,0);
		context.lineTo(centerX,canvas.height);
		context.strokeStyle = "black";
		context.lineWidth = 1;
		context.stroke();
		context.closePath();
		context.beginPath();
		context.moveTo(0, centerY);
		context.lineTo(canvas.width, centerY);
		context.stroke();
		
		var rays = [], IPs = [], coords = [], SOIP, yDirCrossSOIP, xDirCrossSOIP, xSign, ySign, xDirMag = V.mag(cam.screen.xAxisDir), yDirMag = V.mag(cam.screen.yAxisDir), a, b, c, d, e;
		
		for (var point in cube){
			console.group('point: ', cube[point].x, cube[point].y, cube[point].z);
			rays[point] = V.subtract(cam.point, cube[point]);
			console.log('ray', rays[point]);
			console.log(V.dot(rays[point], cam.point));
			IPs[point] = V.add(V.scale((V.dot(V.subtract(cam.screen.origin, cube[point]), cam.point)/V.dot(rays[point], cam.point)), rays[point]), cube[point]);
			console.log(cam.screen.origin, IPs[point])
			SOIP = V.subtract(cam.screen.origin, IPs[point]);
			console.log(SOIP);
			xDirCrossSOIP = V.cross(cam.screen.xAxisDir, SOIP);
			xDirCrossSOIP.mag = V.mag(xDirCrossSOIP);
			yDirCrossSOIP = V.cross(cam.screen.yAxisDir, SOIP);
			yDirCrossSOIP.mag = V.mag(yDirCrossSOIP);
			// find x sign
			if (V.dirCheck(yDirCrossSOIP, cam.point)){
			  // same dir, leave x coordinate positive
			  xSign = 1 * zoom;
			} else {
			  // opposite dir
			  xSign = -1 * zoom;
			}

			// find y sign
			if (V.dirCheck(xDirCrossSOIP, cam.point)){
			  ySign = 1 * zoom;
			} else {
			  ySign = -1 * zoom;
			}
			console.log('xSign', xSign);
			console.log('ySign', ySign);

			console.log(yDirCrossSOIP.mag)
			console.log(xDirCrossSOIP.mag)

			coords[point] = {
			  x: xSign * yDirCrossSOIP.mag / yDirMag,
			  y: ySign * xDirCrossSOIP.mag / xDirMag
			}

			console.log(coords[point]);

			context.beginPath();
			context.arc(centerX + coords[point].x, centerY - coords[point].y, 2, 0, 2 * Math.PI, false);
			context.fillStyle = 'green';
			context.fill();
			context.closePath();
			console.groupEnd();
		}
	};


	var gui, canvas, context, centerX, centerY;


	$(document).ready(function(){
		canvas = document.getElementById('myCanvas');
		context = canvas.getContext('2d');
		centerX = canvas.width / 2;
		centerY = canvas.height / 2;

		render(cam, cube, myScene.zoom);
	});
	  
	window.onload = function(){
		  var gui = new dat.GUI();
		  var camFolder = gui.addFolder('cam');
		  
		  camFolder.add(cam.point, 'x', -500, 500).onChange(function(value){
		  	console.log('cam.point.x', value);
		    cam.point.x = value;
		    render(cam, cube, myScene.zoom);
		  });
		  
		  camFolder.add(cam.point, 'y', -5, 5).onChange(function(value){
		    cam.point.y = value;
		    render(cam, cube, myScene.zoom);
		  });

		  camFolder.add(cam.point, 'z', -5, 5).onChange(function(value){
		  	cam.point.z = value;
		  	render(cam, cube, myScene.zoom);
		  });

		  camFolder.add(myScene, 'zoom', 1, 1000).onChange(function(value){
		  	myScene.zoom = value;
		  	render(cam, cube, myScene.zoom);
		  });
		  camFolder.open();

		  var cubeFolder = gui.addFolder('cube');
		  cubeFolder.add(myScene.cube, 'x', -500, 500).onChange(function(value){
		  	myScene.cube.x = value;
		  	cube = makeCube(myScene.cube);
		  	render(cam, cube, myScene.zoom);
		  });

		  cubeFolder.add(myScene.cube, 'y', -500, 500).onChange(function(value){
		  	myScene.cube.y = value;
		  	cube = makeCube(myScene.cube);
		  	render(cam, cube, myScene.zoom);
		  });

		  cubeFolder.open();
	};
})();