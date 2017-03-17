'use strict';

var path = require('./pathes');

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
const babel = require('gulp-babel');


module.exports = {
    def: function (options) {
        return function ()
        {
            return gulp.src(options.src + '/**')
                .pipe($.plumber())
                .pipe(babel({
                  presets: ['es2015', 'stage-0'],
                  plugins: [['transform-class-properties', { "spec": true }], ["remove-comments"]],
                }))
                // $.uglify(),
                .pipe($.notify(function (file) {
                    var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
                    return "Compiled " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
                }))
                .pipe(gulp.dest(options.dst));
        }
    }
};