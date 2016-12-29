'use strict';

var path = require('./pathes');

var gulp = require('gulp');
var uglify = require(path.CON_PATH_GLOBAL + 'gulp-uglify');
var pump = require('pump');


class commFunctions
{
    doUglify(cb, src, dst) {
        pump([
                gulp.src(src),
                uglify(),
                gulp.dest(dst)
            ],
            cb
        );
    }
}

module.exports = new commFunctions();
