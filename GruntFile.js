module.exports = function(grunt){

	var settings = require("./settings");
  	var port = settings.webserver.port || 3000;
  	var liveReloadPort = settings.liveReload.port || 35729;

	grunt.loadNpmTasks('grunt-karma');

  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		karma: {
		  unit: {
		    configFile: 'karma.conf.js',
		    runnerPort: 9999,
		    singleRun: false,
		    browsers: ['Chrome']
		  }
		},
		watch: {
            options: {
            // Start a live reload server on the default port 35729
              livereload: true,
            },
            css: {
              files: ['client/stylesheets/*', 'server/routes/**/*']
            },
            app: {
              files: ['client/javascripts/**']
            },
            views: {
                files:['server/views/*', 'client/app/**/*']
            }
          },
        nodemon: {
                dev: {
                	options: {
                		ignoredFiles: ['client/**/*'],
                	}
                }
        },
	    open: {
	      all: {
	        path: 'http://localhost:3000'
	      }
	    },
	    concurrent: {
	          target: {
	            tasks: ['nodemon', 'watch', 'open'],
	            options: {
	              logConcurrentOutput: true
	            }
	          }
	        }
		});


  grunt.registerTask('server', ['concurrent']);
};