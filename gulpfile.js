var gulp = require('gulp');
var del = require("del");
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json');

function ghPagesJsClean() {
    return del('gh-pages/js');
}

function tsc() {
    return gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false }))
        .pipe(gulp.dest('gh-pages/js/'));
}

function watch() {
    return gulp.watch('src/**/*.ts', gulp.series(tsc));
}

function uglifyAttributiveJs() {
    return pipeline(
          gulp.src('gh-pages/js/*.js'),
          uglify(),
          gulp.dest('gh-pages/js/dist')
    );
}

const build = gulp.series(ghPagesJsClean, tsc);

exports.default = build;
exports.watch = watch;