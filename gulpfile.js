'use strict';

const path = require('path');
const del = require('del');
const gulp = require('gulp');
// const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const gulplog = require('gulplog');
const combine = require('stream-combiner2').obj;
const throttle = require('lodash.throttle');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const $ = require('gulp-load-plugins')();

// Gulp + Webpack = ♡

const named = require('vinyl-named');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('fonts', function() {
  return gulp.src('frontend/fonts/**/*.*', {since: gulp.lastRun('fonts')})
             .pipe(gulp.dest('public/fonts'));
});


gulp.task('styles', function() {

  return gulp.src('frontend/styles/*.scss')
      .pipe(plumber({
        errorHandler: notify.onError(err => ({
          title:   'Styles',
          message: err.message
        }))
      }))
      .pipe(gulpIf(isDevelopment, sourcemaps.init()))
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 4 versions']
      }))
      .pipe(gulpIf(isDevelopment, sourcemaps.write()))
      .pipe(gulpIf(!isDevelopment, combine(cssnano(), rev())))
      .pipe(gulp.dest('public/styles'))
      .pipe(gulp.dest('../../altbetNew/Alt.Bet/Content'))
      .pipe(gulpIf(!isDevelopment, combine(rev.manifest('css.json'), gulp.dest('manifest'))));

});

gulp.task('assets', function() {
  return gulp.src('frontend/assets/**/*.html', {since: gulp.lastRun('assets')})
      //.pipe(jade())
      .pipe(gulpIf(!isDevelopment, revReplace({
        manifest: gulp.src('manifest/css.json', {allowEmpty: true})
      })))
      .pipe(gulp.dest('public'));
});


// gulp.task('ts:process', function () {
//   return gulp.src('test/theme/.ts/**/*.ts')
//              .pipe(plumber())
//              .pipe(sourcemaps.init())
//              .pipe(ts({
//                noImplicitAny: false,
//                removeComments: true,
//                // suppressImplicitAnyIndexErrors: true,
//                module: 'umd',
//                target: 'ES5',
//                out: 'index.js'
//              }))
//              // .pipe(sourcemaps.write('.'))
//              .pipe(notify("Compiled: <%= file.relative %>!"))
//              .pipe(gulp.dest('test/theme/js'));
// });
gulp.task('js',function(){
  return combine(
    gulp.src(['frontend/js/nonReact/**/*.js', '!frontend/js/nonReact/test.js', '!frontend/js/nonReact/access.js',
      '!frontend/js/nonReact/pageFirst.js']),
    babel({
      presets: ['es2015']
    }),
    $.concat('all.js'),
    sourcemaps.init(),
    // $.uglify(),
    gulp.dest('./public/js'),
    gulp.dest('../../altbetNew/Alt.Bet/Scripts')

    // gulp.src(['vendor/Waves/dist/waves.min.js', 'vendor/drag_drop/drag_drop.js', 'vendor/ms-Dropdown-js/js/msdropdown/jquery.dd.min.js',
    // 'vendor/eventEmitter/eventEmitter.min.js', 'vendor/react-0.14.7/build/react.min.js', 'vendor/react-0.14.7/build/react-dom.min.js']),
    // $.concat('vendors.js'),
    // $.uglify(),
    // gulp.dest('./public/js'),
    // gulp.dest('../../altbetNew/Alt.Bet/Scripts'),
		//
    // gulp.src(['vendor/fullpage.js/jquery.fullPage.min.js', 'frontend/js/nonReact/pageFirst.js']),
    // $.concat('landingPage.js'),
    // $.uglify(),
    // gulp.dest('./public/js'),
    // gulp.dest('../../altbetNew/Alt.Bet/Scripts'),
		//
		// gulp.src(['vendor/jquery/dist/jquery.min.js', 'frontend/js/nonReact/access.js']),
    // $.concat('jQuery.js'),
    // babel({
    //   presets: ['es2015']
    // }),
    // sourcemaps.init(),
    // $.uglify(),
    // gulp.dest('./public/js')
  ).on('error', $.notify.onError(function (err) {
    return {
      title: 'JS',
      message: err.message
    }
  }));
});

gulp.task('styles:assets', function() {
  return gulp.src('frontend/Images/**/*.{svg,png,jpg,gif,ico}', {since: gulp.lastRun('styles:assets')})
      .pipe(gulp.dest('../../altbetNew/Alt.Bet/Images'))
      .pipe(gulp.dest('public/Images'));
});

gulp.task('clean', function() {
  return del(['public', 'manifest']);
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles:assets', 'styles', 'js'), 'assets', 'fonts'));

gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});


gulp.task('dev',
    gulp.series(
        'build',
        gulp.parallel(
            'serve',
            function() {
              gulp.watch('frontend/styles/**/*.scss', gulp.series('styles'));
              gulp.watch('frontend/js/nonReact/**/*.js', gulp.series('js'));
              gulp.watch('frontend/assets/**/*.html', gulp.series('assets'));
              gulp.watch('frontend/fonts/**/*.*', gulp.series('fonts'));
              gulp.watch('frontend/Images/**/*.{svg,png,jpg,gif,ico}', gulp.series('styles:assets'));
            }
        )
    )
);
