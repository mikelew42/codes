module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.initConfig({
		connect: {
			server: {
				options: {
					port: 9797,
					open: true, // opens browser
					livereload: true,
					keepalive: true
				}
			}
		},

		watch: {
			compile: {
				files: ['compile/**'],
				tasks: ['compile']
			},
			livereload: {
				options: { 
					livereload: true 
				}
			}
		}
	});

	grunt.registerTask('compile', function(){
		console.log('file changes');
	});

	grunt.registerTask('default', [
		'watch:compile',
		'connect:server',
		'watch:livereload'
	]);
};