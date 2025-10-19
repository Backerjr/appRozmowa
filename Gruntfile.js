module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      options: {
        esversion: 11,
        node: true,
        asi: true,        // Allow missing semicolons
        strict: false,    // Don't require "use strict"
        expr: true,       // Allow expressions as statements
        boss: true        // Allow assignments in conditional expressions
      },
      gruntfile: {
        options: {
          strict: true,
          esversion: 6
        },
        src: ['Gruntfile.js']
      },
      commonjs: {
        options: {
          esversion: 9
        },
        src: ['scripts/**/*.cjs']
      },
      modules: {
        options: {
          esversion: 11,
          module: true,    // Enable ES6 module syntax
          predef: ['__filename', '__dirname'],  // Allow ES module polyfills
          '-W079': true    // Suppress redefinition warnings
        },
        src: [
          'app/src/**/*.js',
          'proxy/src/**/*.js',
          'web/server-dev.js',
          'scripts/**/*.js'
        ]
      },
      browser: {
        options: {
          esversion: 11,
          module: true,
          browser: true    // Enable browser globals like WebSocket
        },
        src: [
          'web/src/**/*.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);
};
