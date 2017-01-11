'use strict';

var path = require('./pathes');

var $ = require('gulp-load-plugins')();
// const sourcemaps = require('gulp-sourcemaps');
var gulp = require('gulp');
// const gulpIf = require('gulp-if');
// const autoprefixer = require("gulp-autoprefixer");
// var remember = require(path.CON_PATH_GLOBAL + 'gulp-remember');


module.exports = {
    def: function (options) {
        return function () {

        // return function () {
        //     gulp.task('styles-admin', function () {
        //         return gulp.src('frontend/admin_styles/index-admin.scss')
        //             .pipe(plumber({
        //                 errorHandler: notify.onError(err => ({
        //                     title: 'Styles',
        //                     message: err.message
        //                 }))
        //             }))
        //             .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        //             .pipe(sass())
        //             .pipe(autoprefixer({
        //                 browsers: ['last 4 versions']
        //             }))
        //             .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        //             // .pipe(gulpIf(!isDevelopment, combine(cssnano(), rev())))
        //             // .pipe(gulp.dest('public/styles'))
        //             .pipe(gulp.dest(OPTIONS.path.dest_server_admin + '/Content'))
        //         // .pipe(gulpIf(!isDevelopment, combine(rev.manifest('css.json'), gulp.dest('manifest'))));
        //
        //     })


            // return gulp.src('./test/theme/.scss/**/{index.scss,index-m.scss,modalwindow.scss}')

        var scssOpts = {outputStyle: options.isDevelopment ? 'compact' : 'compressed'};

        return gulp.src(options.src)
            .pipe($.sourcemaps.init())
            // .pipe($.cached('scss')) // тоже что и since, только сравнивает по содержимому
            .pipe($.sass(scssOpts).on('error', $.sass.logError))
            .pipe($.autoprefixer({
                browsers: ['last 4 versions']
            }))
            .pipe($.notify(function (file) {
                // 0||console.info( 'file.relative', file.relative );
                var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
                if (['index-admin.css'].indexOf(file.relative) >= 0) return "Compiled " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
                else return false;
            }))
            // .pipe(sass({outputStyle: 'compressed'}))
            // .on('data', function (file) { console.info( 'compile', file.basename ); })
            // .pipe(sourcemaps.write('.'))
            // .pipe($.rev())
            // .pipe(remember('scss'))
            .pipe($.if(options.isDevelopment, $.sourcemaps.write()))
            .pipe(gulp.dest(options.dst));
        // .pipe($.rev.manifest({path: 'css-manifest.json', merge: false}))
        // .pipe($.revDelRedundant({ dest: options.dst, force: true }))
        // .pipe(gulp.dest('./theme'));

        }
    }
};

// gulp.task('scss', function() {
// });