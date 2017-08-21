'use strict';

// var OPTIONS = require('./pathes');

var $ = require('gulp-load-plugins')();
// const sourcemaps = require('gulp-sourcemaps');
var gulp = require('gulp');
// const gulpIf = require('gulp-if');
// const autoprefixer = require("gulp-autoprefixer");
// var remember = require(path.CON_PATH_GLOBAL + 'gulp-remember');


module.exports = {
    def: function (options) {
        return function () {

        var scssOpts = {outputStyle: options.isDevelopment ? 'compact' : 'compressed'};

        return gulp.src(options.src)
            .pipe($.sourcemaps.init())
            // .pipe($.cached('scss')) // тоже что и since, только сравнивает по содержимому
            .pipe($.sass(scssOpts).on('error', $.sass.logError))
            .pipe($.autoprefixer({
                browsers: ['last 4 versions']
            }))
            // .pipe($.notify(function (file) {
            //     // 0||console.info( 'file.relative', file.relative );
            //     var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
            //     if (['index-admin.css'].indexOf(file.relative) >= 0) return "Compiled " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
            //     else return false;
            // }))
            .pipe($.if(options.isDevelopment, $.sourcemaps.write()))
            .pipe(gulp.dest(options.dst));
        }
    }
};

// gulp.task('scss', function() {
// });