'use strict';

var path = require('./pathes');

var $ = require('gulp-load-plugins')();
// const sourcemaps = require('gulp-sourcemaps');
var gulp = require('gulp');

const RevAll = require('gulp-rev-all');
const revDelRedundant = require('gulp-rev-del-redundant');


module.exports = {
    def: function (options) {
        return function ()
        {
            var scssOpts = {outputStyle: options.isDevelopment ? 'compact' : 'compressed'};

            return gulp.src(options.src + '/**')
                .pipe(RevAll.revision({
                    transformFilename: function (file, hash) {
                        var ext = path.extname(file.path);
                        return path.basename(file.path, ext) + '-' + hash.substr(0, 8) + ext; // 3410c.filename.ext
                    }
                }))
                .pipe(gulp.dest(options.dst))
                .pipe(RevAll.manifestFile({fileNameManifest: "rev-manifest.json",}))
                .pipe(revDelRedundant({dest: options.dst, force: true}))
                // .pipe(revDel({ dest: OPTIONS.path.dest_server_admin + '/Scripts/js-assets/' }))
                .pipe(gulp.dest(options.manifestPath))
                .pipe($.notify(function (file) {
                    // 0||console.info( 'file.relative', file.relative );
                    var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
                    return "Compiled " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
                }))
                .pipe(gulp.dest(options.dst));
        }
    }
};
