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
			build: {
				src: ['<%= buildDir %>']
			},
			// deletes the .tmp dir
			tmp: '.tmp',
			options: {
				force: true
			}
		},
		copy: {
			// moves all files from src to build
			build: {
				cwd: '<%= srcDir %>',
				src: ['**/*', '!**/*.less'],
				dest: '<%= buildDir %>',
				expand: true
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
			options: {
				livereload: false
			},
			build: {
				files: ['<%= srcDir %>/**/*.*'],
				tasks: 'build'
			},
			reload: {
				files: ['<%= buildDir %>/**/*.*'],
				options: {
					livereload: true
				}
			}
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
				src: ['<%= buildDir %>/**/*.*', '!<%= buildDir %>/index.html']
			}
		},
		less: {
			build: {
				files: {
					'<%= buildDir %>/css/main.css': '<%= srcDir %>/css/main.less'
				}
			}
		}
	});

	grunt.registerTask('build', [
		'clean:build', 
		'copy:build',
		'less',
		'useminPrepare',
		'concat',
		'uglify',
		'cssmin',
		'filerev',
		'usemin',
		'clean:tmp'
	]);

	grunt.registerTask('default', [
		'build',
		'connect',
		'watch'
	]);
};