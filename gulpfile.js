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

gulp.task('styles', function() {

  return gulp.src('frontend/styles/index.scss')
      .pipe(plumber({
        errorHandler: notify.onError(err => ({
          title:   'Styles',
          message: err.message
        }))
      }))
      .pipe(gulpIf(isDevelopment, sourcemaps.init()))
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 10 versions']
      }))
      .pipe(gulpIf(isDevelopment, sourcemaps.write()))
      .pipe(gulpIf(!isDevelopment, combine(cssnano(), rev())))
      .pipe(gulp.dest('public/styles'))
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


gulp.task('ts:process', function () {
  return gulp.src('test/theme/.ts/**/*.ts')
             .pipe(plumber())
             .pipe(sourcemaps.init())
             .pipe(ts({
               noImplicitAny: false,
               removeComments: true,
               // suppressImplicitAnyIndexErrors: true,
               module: 'umd',
               target: 'ES5',
               out: 'index.js'
             }))
             // .pipe(sourcemaps.write('.'))
             .pipe(notify("Compiled: <%= file.relative %>!"))
             .pipe(gulp.dest('test/theme/js'));
});
gulp.task('js',function(){
  return combine(
    gulp.src(['vendor/drag_drop/drag_drop.js', 'vendor/ms-Dropdown-master/js/msdropdown/jquery.dd.min.js', 'frontend/js/**/*.js', '!frontend/js/test.js', '!frontend/js/access.js'])
    .pipe(babel({
      presets: ['es2015']
    })),
    $.concat('all.js'),
    // $.uglify(),
    gulp.dest('./public/js'),
    gulp.src(['vendor/jquery/dist/jquery.min.js', 'frontend/js/access.js'])
    .pipe(babel({
      presets: ['es2015']
    })),
    $.concat('access.js'),
    gulp.dest('./public/js')
  ).on('error', $.notify.onError(function (err) {
    return {
      title: 'JS',
      message: err.message
    }
  }));
});

gulp.task('styles:assets', function() {
  return gulp.src('frontend/Images/**/*.{svg,png,jpg,gif,ico}', {since: gulp.lastRun('styles:assets')})
      .pipe(gulp.dest('public/Images'));
});

gulp.task('clean', function() {
  return del(['public', 'manifest']);
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles:assets', 'styles', 'js'), 'assets'));

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
              gulp.watch('frontend/js/**/*.js', gulp.series('js'));
              gulp.watch('frontend/assets/**/*.html', gulp.series('assets'));
              gulp.watch('frontend/Images/**/*.{svg,png,jpg,gif,ico}', gulp.series('styles:assets'));
            }
        )
    )
);
