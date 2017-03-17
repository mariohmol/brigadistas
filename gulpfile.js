var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv;

var webpackBuild = require('ionic-gulp-webpack');


// var buildBrowserify = require('ionic-gulp-browserify-typescript');
//var buildBrowserify = require('./lib/ionic-gulp-browserify-typescript-babel');

const mocha = require('gulp-mocha');
const plumber = require('gulp-plumber');
const nightwatch = require('gulp-nightwatch');



gulp.task('nightwatch', () => {
    gulp.src('').pipe(plumber()).pipe(nightwatch({configFile: 'test/nightwatch.conf.js'}));
});

gulp.task('nightwatch:w', ['nightwatch'], () => {
    // gulp.watch(['{./,}app/**/*.{ts,html,scss}'], ['build']);
    gulp.watch([
        '{./,}www/build/**/*', '{./,}test/{e2e,nightwatch}/**/*.js'
    ], ['nightwatch']);
});
