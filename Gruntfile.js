module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },

      prod: {
        src: [
          'bower_components/underscore/underscore.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-cookies/angular-cookies.js',
          'bower_components/angular-ui-router/release/angular-ui-router.js',
          'bower_components/angular-loading-bar/loading-bar.js',  
          'frontend/js/vendor/**/*.js',

          // Add the front end app
          'frontend/js/app/**/*.module.js',
          'frontend/js/app/**/*.ctrl.js',
          'frontend/js/app/**/*.service.js',
          'frontend/js/app/**/*.factory.js',

          '.tmp/js/app/view.js'
        ],
        dest: '.tmp/js/main.concat.js'
      },

      dev: {
        options: {
          sourceMap: true,
          sourceMapStyle: 'inline'
        },
        
        src: [
          'bower_components/underscore/underscore.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-cookies/angular-cookies.js',
          'bower_components/angular-ui-router/release/angular-ui-router.js',
          'bower_components/angular-loading-bar/loading-bar.js',          
          'frontend/js/vendor/**/*.js',

          // Add the front end app
          'frontend/js/app/**/*.module.js',
          'frontend/js/app/**/*.ctrl.js',
          'frontend/js/app/**/*.service.js',
          'frontend/js/app/**/*.factory.js',

          '.tmp/js/app/view.js'
        ],
        dest: '.tmp/js/main.js'
      }
    },

    uglify: {
      options: {
        mangle: {
          except: ['jQuery', 'angular']
        }
      },

      prod: {
        files: {
          '.tmp/js/main.js': '.tmp/js/main.concat.js'
        }
      }
    },

    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      assets: {
        src: [
          '.tmp/css/style.css',
          '.tmp/js/main.js'
        ]
      }
    },

    sass: {
      options: {
        includePaths: [
          'bower_components/susy/sass',
          'bower_components/compass-breakpoint/stylesheets',  
          'bower_components/compass-mixins/lib'          
        ]
      },
      
      prod: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed',
          sourceComments: false,
          sourceMapEmbed: false,
          omitSourceMapUrl: false
        },
        
        files: {
          '.tmp/css/style.css': 'frontend/scss/style.scss'
        }
      },
      
      dev: {
        options: {
          sourceMap: true,
          outputStyle: 'nested',
          sourceComments: true
        },
        
        files: {
          '.tmp/css/style.css': 'frontend/scss/style.scss'
        }        
      }
    },

    // For compressing images
    imagemin: {
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'frontend/img/',            // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,ico}'],   // Actual patterns to match
          dest: '.tmp/img/'       // Destination path prefix
        }]
      }
    },

    ngtemplates: {
      prod: {
        cwd: 'frontend/js/app',
        src: '**/*.html',
        dest: '.tmp/js/app/view.js',

        // Set the module to the module name that you want your templates injected into
        options: {
          module: 'feedManager',
          htmlmin: {
            collapseBooleanAttributes:      true,
            collapseWhitespace:             true,
            removeAttributeQuotes:          true,
            removeComments:                 true, // Only if you don't use comment directives!
            removeEmptyAttributes:          true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true
          }
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dev: {
        src: '.tmp/css/style.css',
        dest: '.tmp/css/style.css'
      },
      prod: {
        src: '.tmp/css/style.css',
        dest: '.tmp/css/style.css',
        options: {
          map: false
        }
      }
    },

    jshint: {
      options: {
          reporter: require('jshint-stylish')
      },
      
      frontend: {
        options: {
          validthis: true
        },
        
        files: {
          src: ['frontend/js/**/*.js']
        }
      },
      
      backend: {
        options: {
          esnext: true
        },
        
        files: {
          src: ['backend/**/*.js']
        }
      }
    },
    
    browserSync: {
        dev: {
            bsFiles: {
                src : './tmp/**/*'
            },
            options: {
                proxy: 'localhost:8080',
                watchTask: true,
                online: false,
                tunnel: true,
                ui: {
                  port: 8000
                }
            }
        }
    },    

    copy: {
      frontend_assets: {
        files: [
          {expand: true, cwd: 'frontend/', src: ['font/**'], dest: '.tmp/'},
        ],
      },
    },

    watch: {
      options: {
        livereload: true,
      },

      scripts: {
        files: ['frontend/js/**/*.js'],
        tasks: ['ngtemplates', 'concat:dev'],
        options: {
          spawn: true,
        },
      },

      styles: {
        files: ['frontend/scss/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer:dev'],
        options: {
          spawn: true,
        },
      },

      js_views: {
        files: ['frontend/js/app/**/*.html'],
        tasks: ['ngtemplates', 'concat:dev'],
        options: {
          spawn: true,
        },
      },

      fonts: {
        files: ['frontend/font/**'],
        tasks: ['copy:frontend_assets'],
        options: {
          spawn: true,
        }
      },

      images: {
        files: ['frontend/images/**/*.{png,jpg,gif,ico,jpeg}'],
        tasks: ['imagemin'],
        options: {
          spawn: true,
        }
      },
    }
  });

  grunt.registerTask('default', [
    'clear',
    'copy:frontend_assets',
    'sass:dev',
    'autoprefixer:dev',
    'ngtemplates',
    'concat:dev',
    'imagemin',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('prepare_assets', [
    'jshint:backend',
    'jshint:frontend',
    'copy:frontend_assets',
    'sass:prod',
    'autoprefixer:prod',
    'ngtemplates',
    'concat:prod',
    'uglify:prod',
    'imagemin'
  ]);

  grunt.registerTask('clear', 'Deletes all old copies of the assets.', function () {
    // Get a list of all handlebar files
    var view = grunt.file.expand('backend/views/**/*.html');

    // Remove the the temp directory
    if (grunt.file.exists('.tmp')) {
      grunt.file.delete('.tmp');
    }

    // For each handlebar template
    view.forEach(function (file) {
      var contents = grunt.file.read(file, {encoding: 'utf8'});
      var hashRegex = new RegExp('(src|href)=\"\/(.*)(\.[0-9a-f]{8})(\.js|\.css)\"');
      var found;

      // Test if a hash is found on the end of a css or js file
      while (found = hashRegex.exec(contents)) {
        console.log("Removing " + found[2] + found[3] + found[4] + " from " + file);
        // Remove the hash
        contents = contents.replace(found[3] + found[4], found[4]);
      }

      grunt.file.write(file, contents);
    });
  });

  grunt.registerTask('asset_revision', 'Version the assets.', function () {
    grunt.task.requires('filerev');

    // Get a list of all handlebar files
    var view = grunt.file.expand('backend/views/**/*.html');
    var fileRev = {};

    // Remove the '.tmp' folder name from the front of all file locations
    for (var fileName in grunt.filerev.summary) {
      var newFilename = fileName.replace('\.tmp', '');
      fileRev[newFilename] = grunt.filerev.summary[fileName].replace('\.tmp', '');
    }

    // For each handlebar template
    view.forEach(function (file) {
      var contents = grunt.file.read(file, {encoding: 'utf8'});
      var hashRegex = new RegExp('(src|href)=\"\/(.*)(\.[0-9a-f]{8})(\.js|\.css)\"');
      var found;

      // For each file whos content was hashed
      for (var fileName in fileRev) {
        var fileRegex = new RegExp('(src|href)=\"' + fileName + '"');

        // Search for the file name in the template
        while (found = fileRegex.exec(contents)) {
          console.log("Replacing " + fileName + " in " + file);
          contents = contents.replace(fileName, fileRev[fileName])
        }

        // Write the new contents back into the file
        grunt.file.write(file, contents.replace(fileName, fileRev[fileName]));
      }
    });
  });

  grunt.registerTask('build', 'Build the project incuding the assets.', function () {
    grunt.task.run('clear');
    grunt.task.run('prepare_assets');
    grunt.task.run('filerev');
    grunt.task.run('asset_revision');
  });
};
