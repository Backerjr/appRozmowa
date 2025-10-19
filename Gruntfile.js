module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        esversion: 2020,
        node: true,
        browser: true,
        globals: {
          React: true,
        },
      },
      all: [
        'Gruntfile.js',
        'app/src/**/*.js',
        'app/src/**/*.mjs',
        'web/src/**/*.js',
        'web/src/**/*.jsx',
        'proxy/src/**/*.js'
      ]
    }
  });

  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);
};
