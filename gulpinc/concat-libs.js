'use strict';

var path = require('./pathes');

var $ = require(path.CON_PATH_GLOBAL + 'gulp-load-plugins')();
var gulp = require('gulp');
var concat = require(path.CON_PATH_GLOBAL + 'gulp-concat');

var libs = {
    'jquery': 'jquery.js',
    'owl.carousel': 'owl.carousel/owl-carousel/owl.carousel.min.js',
    'jquery-match-height': 'jquery-match-height/jquery.matchHeight-min.js',
    'msdropdown': 'msdropdown/jquery.dd.min.js',
    'device': 'device.js',
    'jquery.cookie': 'jquery.cookie.min.js',
    'multiple-select': 'multiple-select/multiple-select.js',
    'bootstrap-datepicker': 'bootstrap-datepicker/js/bootstrap-datepicker.min.js',
    'bootstrap-datepicker.ru': 'bootstrap-datepicker/locales/bootstrap-datepicker.ru.min.js',
    'tooltipster': 'tooltipster/js/tooltipster.bundle.min.js',
    'easyautocomplete': 'easyautocomplete/jquery.easy-autocomplete.min.js',
    'moment': 'moment.min.js',
};


module.exports = {
    def: function (options) {
        return function ()
        {
            let tmpl = '';
            let flag = false;
            for( var ii in libs ) { flag ? tmpl += ',' : flag = true; tmpl += libs[ii]; }
            0||console.info( 'tmpl:', tmpl );

            // return gulp.src('./jslib/**/{jquery.js,owl.carousel/owl-carousel/owl.carousel.min.js}')
            return gulp.src('./jslib/**/{' + tmpl + '}')
                .pipe(concat(options.allfn))
                .pipe($.notify(function (file) {
                    var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
                    return "Compiled " + file.relative + ' ' + (new Date()).toLocaleString("ru", options);
                }))
                .pipe(gulp.dest(options.dst));
        }
    }
};