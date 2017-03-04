'use strict';

module.exports = function(grunt){
    grunt.initConfig({
        pkg     : grunt.file.readJSON('package.json'),
        jst     : {
            ae   : {
                options: {
                    namespace       : 'App.Templates',
                    processName     : function(filePath){
                        filePath = filePath.replace('source/views/', '');
                        var pieces = filePath.split('/').join('__');
                        var nameFile = pieces.split('.')[0];
                        var sections = nameFile.split('_');
                        var fragments = sections[0];
                        for(var i = 0; i < sections.length; i++){
                            if(i > 0){
                                var fragment = sections[i];
                                fragment = fragment.charAt(0).toUpperCase() + fragment.substring(1);
                                fragments += fragment;
                            }
                        }
                        console.info('Template SOURCE: ' + fragments);
                        return fragments;
                    },
                    templateSettings: {
                        interpolate: /\{\{(.+?)\}\}/g,
                        variable   : 'data'
                    }
                },
                files  : {
                    'source/templates.js': ['source/views/**/*.ejs']
                }
            }
        },
        jshint  : {
            ae   : {
                src    : ['Gruntfile.js',
                          'source/helpers/util.js',
                          'source/helpers/util_rivets.js',
                          'source/views/**/*.js',
                          'source/views/**/**/*.js',
                          'source/routes/**/*.js',
                          'source/models/**/*.js',
                          'source/collections/**/*.js',
                          'singletons.js',
                          'ajax_setup.js'],
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish')
                }
            }
        },
        sass    : {
            ae       : {
                options: {
                    style: 'compressed'
                },
                files  : [{
                    expand: true,
                    cwd   : 'source/styles',
                    src   : ['main.scss'], //['**/*.scss'],
                    dest  : 'styles',
                    ext   : '.css'
                }]
            },
            prod     : {
                options: {
                    style: 'compressed'
                },
                files  : [{
                    expand: true,
                    cwd   : 'source/styles',
                    src   : ['main.scss'], //['**/*.scss'],
                    dest  : 'source/prod',
                    ext   : '.css'
                }]
            }
        },
        watch   : {
            configFiles  : {
                files  : ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            aejs         : {
                files: ['Gruntfile.js',
                        'source/helpers/**/*.js',
                        'source/views/**/*.js',
                        'source/views/**/**/*.js',
                        'source/routes/**/*.js',
                        'source/models/**/*.js',
                        'source/collections/**/*.js',
                        'source/theme/**.*.js',
                        'singletons.js',
                        'ajax_setup.js'],
                tasks: ['jshint:ae']
            },
            aecss        : {
                files: ['source/styles/**/*.scss'],
                tasks: ['sass:ae'],
            },
            aetemplate   : {
                files: ['source/views/**/*.ejs'],
                tasks: ['jst:ae']
            }
        },
        babel   : {
            options: {
                'sourceMap': false,
                presets    : ['es2015']
            },
            ae     : {
                files: [{
                    'expand': true,
                    'src'   : ['bower_components/uit.js/uit.js',
                               'ajax_setup.js',
                               'application.js',
                               'source/theme/js/app.min.js',
                               'source/theme/plugins/**/*.js',
                               'source/helpers/util.js',
                               'source/helpers/util_rivets.js',
                               'source/models/**/*.js',
                               'source/collections/**/*.js',
                               'source/views/**/*.js',
                               'source/routes/**/*.js',
                               'singletons.js'
                    ],
                    'dest'  : 'source/prod/js-compiled/',
                    'ext'   : '.js'
                }]
            }
        },
        uglify  : {
            bowersae   : {
                src : [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/blueimp-load-image/js/load-image.all.min.js',
                    'bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.min.js',
                    'bower_components/jquery-file-upload/js/vendor/jquery.ui.widget.js',
                    'bower_components/jquery-file-upload/js/jquery.iframe-transport.js',
                    'bower_components/jquery-file-upload/js/jquery.fileupload.js',
                    'bower_components/jquery-file-upload/js/jquery.fileupload-process.js',
                    'bower_components/jquery-file-upload/js/jquery.fileupload-image.js',
                    'bower_components/jquery-file-upload/js/jquery.fileupload-audio.js',
                    'bower_components/jquery-file-upload/js/jquery.fileupload-video.js',
                    'bower_components/jquery-file-upload/js/jquery.fileupload-validate.js',
                    'bower_components/jquery-file-upload/js/jquery.fileupload-ui.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/underscore/underscore-min.js',
                    'bower_components/underscore.string/dist/underscore.string.js',
                    'bower_components/jquery-cookie/jquery.cookie.js',
                    'bower_components/backbone/backbone.js',
                    'source/typeahead.bundle.js',
                    'bower_components/rivets/dist/rivets.bundled.min.js',
                    'bower_components/jquery-validation/dist/jquery.validate.min.js',
                    'bower_components/jquery-validation/dist/additional-methods.min.js',
                    'bower_components/moment/min/moment.min.js',
                    'bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js',
                    'bower_components/jquery.maskedinput/dist/jquery.maskedinput.min.js',
                    'bower_components/bootstrap-timepicker/js/bootstrap-timepicker.js',
                    'bower_components/jquery-ui-1.11.4/jquery-ui.min.js',
                    'bower_components/google_libs/google_charts.js',
                    'bower_components/jquery-deparam/jquery-deparam.js',
                    'bower_components/garand-sticky/jquery.sticky.js',
                    'bower_components/jquery.nicescroll/jquery.nicescroll.min.js',
                    'bower_components/select2/select2.min.js',
                    'bower_components/bootstrap-submenu/dist/js/bootstrap-submenu.min.js',
                    'bower_components/jquery-highlighttextarea/jquery.highlighttextarea.min.js',
                    'bower_components/clipboard/clipboard.min.js',
                ],
                dest: 'source/prod/libs.js'
            },
            js         : {
                src : [
                    'bower_components/uit.js/uit.js',
                    'source/prod/js-compiled/ajax_setup.js',
                    'source/prod/js-compiled/application.js',
                    'source/prod/js-compiled/source/theme/js/app.js',
                    'source/prod/js-compiled/source/theme/plugins/**/*.js',
                    'source/prod/js-compiled/source/helpers/util.js',
                    'source/prod/js-compiled/source/helpers/util_rivets.js',
                    'source/templates.js',
                    'source/prod/js-compiled/source/models/**/*.js',
                    'source/prod/js-compiled/source/collections/**/*.js',
                    'source/prod/js-compiled/source/views/**/*.js',
                    'source/prod/js-compiled/source/routes/**/*.js',
                    'source/prod/js-compiled/singletons.js',
                ],
                dest: 'source/prod/app.js'
            }
        },
        cssmin  : {
            options: {
                shorthandCompacting: false,
                roundingPrecision  : -1
            },
            ae     : {
                files: {
                    'source/prod/libs.css': [
                        'bower_components/jquery-file-upload/css/jquery.fileupload.css',
                        'bower_components/jquery-file-upload/css/jquery.fileupload-ui.css',
                        'bower_components/jquery-ui-1.11.4/jquery-ui.min.css',
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'bower_components/font-awesome/css/font-awesome.css',
                        'bower_components/bootstrap-datepicker/css/datepicker3.css',
                        'bower_components/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                        'bower_components/select2/select2.css',
                        'bower_components/select2/select2-bootstrap.css',
                        'bower_components/bootstrap-submenu/dist/css/bootstrap-submenu.min.css',
                        'bower_components/jquery-highlighttextarea/jquery.highlighttextarea.min.css',
                        'source/theme/css/AdminLTE.min.css',
                        'source/theme/css/_all-skins.min.css',
                        'source/theme/plugins/iCheck/all.css',
                        'source/theme/plugins/data-tables/dataTables.bootstrap.css',
                    ]
                }
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'gzip'
                },
                expand : false,
                files  : [
                    {src: ['source/prod/app.js'], dest: 'source/prod/app.js.gz'},
                    {src: ['source/prod/libs.js'], dest: 'source/prod/libs.js.gz'},
                    {src: ['source/prod/libs.css'], dest: 'source/prod/libs.css.gz'},
                    {src: ['source/prod/main.css'], dest: 'source/prod/main.css.gz'},
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    // grunt.registerTask('default', ['sass:ae', 'sass:admin', 'jshint', 'jst', 'watch']);
    grunt.registerTask('default', ['sass:ae', 'jshint:ae', 'jst:ae', 'watch']);
    grunt.registerTask('prod', ['jst', 'babel', 'uglify', 'cssmin', 'sass:prod', 'compress']);
};
