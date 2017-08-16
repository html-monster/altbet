'use strict';

// var OPTIONS = require('./pathes');

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');

const path = require('path');
const RevAll = require('gulp-rev-all');
const revDelRedundant = require('gulp-rev-del-redundant');


module.exports = {
    def: function (options) {
        return function ()
        {
            // var scssOpts = {outputStyle: options.isDevelopment ? 'compact' : 'compressed'};

            return gulp.src(options.src + '/*.*')
                .pipe(RevAll.revision({
                    fileNameManifest: "css-assets.json",
                    transformFilename: function (file, hash) {
                        var ext = path.extname(file.path);
                        return path.basename(file.path, ext) + '-' + hash.substr(0, 8) + ext;
                    }
                }))
                .pipe(gulp.dest(options.dst))
                .pipe(RevAll.manifestFile())
                .pipe(revDelRedundant({dest: options.dst, force: true}))
                .pipe(gulp.dest(options.manifestPath))
                .pipe($.notify(function (file) {
                    var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
                    return "Compiled " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
                        // " (" + options.chList + ")";
                }))
                ;
        }
    }
};
