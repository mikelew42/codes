module.exports = function(grunt){

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var port = 9797,
		srcDir = 'src',
		buildDir = 'build';

	grunt.initConfig({

		port: port,
		srcDir: srcDir,
		buildDir: buildDir,

		clean: {
			// deletes the build dir
			all: '<%= buildDir %>',
			// deletes the .tmp dir
			tmp: '.tmp',
			file: 'build/new',
			options: {
				force: true
			}
		},
		copy: {
			// moves all files from src to build
			all: {
				cwd: '<%= srcDir %>',
				src: '**/*',
				dest: '<%= buildDir %>',
				expand: true
			},
			file: {

			}
		},
		connect: {
			server: {
				options: {
					base: '<%= buildDir %>',
					port: '<%= port %>',
					open: "http://localhost:<%= port %>",
					livereload: true
				}
			}
		},
		watch: {
			src: {
				files: ["<%= srcDir %>/**/*"],
				tasks: ['build'],
				options: {
					livereload: false,
					event: ['changed']
				}
			},
			deleted: {
				files: '<%= srcDir %>/**/*',
				tasks: 'clean:file',
				options: {
					event: ['deleted'],
					spawn: false
				}
			},
			added: {
				files: '<%= srcDir %>/**/*',
				tasks: 'copy:all',
				options: {
					event: ['added']
				}
			}
			/*,
			build: {
				files: ['<%= buildDir %>/**'],
				options: {
					livereload: true
				}
			}*/
		},
		useminPrepare: {
			html: '<%= buildDir %>/index.html',
			options: {
				dest: '<%= buildDir %>'
			}
		},
		usemin: {
			html: '<%= buildDir %>/index.html'
		},
		filerev: {
			all: {
				src: ['<%= buildDir %>/**/*', '!index.html']
			}
		}
	});

	grunt.registerTask('test', function(){
		console.log('test task, args:');
		console.log(arguments);
		console.log('test task, this:');
		console.log(this);
	});

	// this could be used for build, buildCSS, buildJS, etc
	grunt.registerTask('build', [
		'clean:all', 
		'copy:all',
		'useminPrepare',
		'concat',
		'uglify',
		// 'cssmin',
		// 'filerev',
		'usemin',
		'clean:tmp'
	]);

	grunt.registerTask('default', [
		'build',
		'connect',
		'watch'
	]);

	grunt.event.on('watch', function(action, file, target){
		if (target === 'deleted'){
			grunt.config(['clean', 'file'], replaceSrcDirWithBuildDir(file) );
		}
	});

	var unixifyPath = function(filepath) {
	    if (process.platform === 'win32') {
	      return filepath.replace(/\\/g, '/');
	    } else {
	      return filepath;
	    }
	  };

	var path = require('path');

	var replaceSrcDirWithBuildDir = function(filepath){
		filepath = unixifyPath(filepath);
		var pathArr = filepath.split('/');
		pathArr.shift(); // removes srcPath from beginning of path
		return buildDir + '/' + pathArr.join('/');
	};
};