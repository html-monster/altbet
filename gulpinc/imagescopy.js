'use strict';

var path = require('./pathes');

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');


module.exports = {
    def: function (options) {
        return function ()
        {
            return gulp.src(options.src + '/**/*.{svg,png,jpg,gif,ico}')
                .pipe($.newer(options.dst))
                .pipe($.notify(function (file) {
                    var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
                    return "Copied " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
                }))
                .pipe(gulp.dest(options.dst));
        }
    }
};