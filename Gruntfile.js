module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    scsslint: 'grunt-scss-lint'
  });

  grunt.util.linefeed = '\n';

  var PSVDir = grunt.option('psv');
  if (PSVDir === true) {
    PSVDir = '../Photo-Sphere-Viewer';
  }

  // some classes have to be executed before other
  var files_in_order = grunt.file.expand([
    'src/js/PhotoSphereTour.js',
    'src/js/**/*.js'
  ]);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*!\n' +
    ' * Photo Sphere Tour <%= pkg.version %>\n' +
    ' * Copyright (c) 2016-<%= grunt.template.today("yyyy") %> Damien "Mistic" Sorel\n' +
    ' * Licensed under MIT (http://opensource.org/licenses/MIT)\n' +
    ' */',

    concat: {
      /**
       * Concatenate src JS + SVG files to dist
       */
      js: {
        options: {
          stripBanners: false,
          separator: '\n\n',
          process: function(src, path) {
            if (path.match(/\.svg$/)) {
              var filename = path.split('/').pop();
              src = src.replace(/[\r\n]/g, '');
              return 'PhotoSphereTour.ICONS[\'' + filename + '\'] = \'' + src + '\';';
            }
            else {
              return src;
            }
          }
        },
        src: files_in_order.concat(['src/icons/*.svg']),
        dest: 'dist/photo-sphere-tour.js'
      },
      /**
       * Add banner to generated CSS files
       */
      css: {
        options: {
          banner: '<%= banner %>\n\n'
        },
        files: [{
          expand: true,
          src: 'dist/*.css',
          dest: ''
        }]
      }
    },

    /**
     * Add AMD wrapper and banner to dist JS file
     */
    wrap: {
      dist: {
        src: 'dist/photo-sphere-tour.js',
        dest: '',
        options: {
          separator: '',
          wrapper: function() {
            var wrapper = grunt.file.read('src/js/.wrapper.js').replace(/\r\n/g, '\n').split(/@@js\n/);
            wrapper[0] = grunt.template.process('<%= banner %>\n\n') + wrapper[0];
            wrapper[1] = '\n' + wrapper[1];
            return wrapper;
          }
        }
      }
    },

    /**
     * Minify dist JS file
     */
    uglify: {
      options: {
        banner: '<%= banner %>\n\n'
      },
      dist: {
        src: 'dist/photo-sphere-tour.js',
        dest: 'dist/photo-sphere-tour.min.js'
      }
    },

    /**
     * Generate dist CSS from src SCSS
     */
    sass: {
      options: {
        sourcemap: 'none',
        style: 'expanded'
      },
      lib: {
        src: 'src/scss/photo-sphere-tour.scss',
        dest: 'dist/photo-sphere-tour.css'
      }
    },

    /**
     * Minify dist CSS file
     */
    cssmin: {
      dist: {
        src: 'dist/photo-sphere-tour.css',
        dest: 'dist/photo-sphere-tour.min.css'
      }
    },

    /**
     * JSHint tests on src files
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      lib: {
        src: ['src/js/**/*.js']
      },
      grunt: {
        src: ['Gruntfile.js']
      }
    },

    /**
     * JSCS test on src files
     */
    jscs: {
      options: {
        config: '.jscsrc'
      },
      lib: {
        src: ['src/js/**/*.js']
      },
      grunt: {
        src: ['Gruntfile.js']
      }
    },

    /**
     * SCSSLint test on src files
     */
    scsslint: {
      options: {
        colorizeOutput: true,
        config: '.scss-lint.yml'
      },
      lib: {
        src: ['src/scss/**/*.scss']
      }
    },

    /**
     * Mocha unit tests
     */
    mochaTest: {
      options: {
        log: true
      },
      lib: {
        src: ['tests/utils/*.js']
      }
    },

    /**
     * Serve des content on localhost:9000
     */
    connect: {
      dev: {
        options: {
          port: 9000
        }
      }
    },

    /**
     * Rebuild lib and refresh server on files change
     */
    watch: {
      src: {
        files: ['src/**'],
        tasks: ['default'],
        options: {
          livereload: true
        }
      },
      example: {
        files: ['example/**'],
        tasks: [],
        options: {
          livereload: true
        }
      },
      psv: {
        files: [PSVDir + '/src/**'],
        tasks: [PSVDir ? 'build-psv' : 'noop'],
        options: {
          livereload: true
        }
      }
    },

    /**
     * Open the example page on the server
     */
    open: {
      dev: {
        path: 'http://localhost:<%= connect.dev.options.port%>/example/index.htm'
      }
    },

    /**
     * Build Photo-Sphere-Viewer
     */
    run_grunt: {
      psv: {
        src: [PSVDir + '/Gruntfile.js']
      }
    },

    /**
     * Copy Photo-Sphere-Viewer
     */
    copy: {
      psv: {
        files: [{
          expand: true,
          flatten: true,
          src: [PSVDir + '/dist/*'],
          dest: 'bower_components/Photo-Sphere-Viewer/dist'
        }]
      }
    }
  });

  grunt.registerTask('noop', function() {

  });

  /**
   * Build the lib
   */
  grunt.registerTask('default', [
    'concat:js',
    'wrap',
    'uglify',
    'sass',
    'cssmin',
    'concat:css'
  ]);

  /**
   * Build Photo-Sphere-Viewer
   */
  grunt.registerTask('build-psv', [
    'run_grunt:psv',
    'copy:psv'
  ]);

  /**
   * Run tests
   */
  grunt.registerTask('test', [
    'jshint',
    'jscs',
    'scsslint',
    'mochaTest'
  ]);

  /**
   * Development server
   */
  grunt.registerTask('serve', [
    'default',
    PSVDir ? 'build-psv' : 'noop',
    'open',
    'connect',
    'watch:src',
    'watch:example',
    PSVDir ? 'watch:psv' : 'noop'
  ]);
};
