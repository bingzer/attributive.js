var gulp = require('gulp');
var del = require("del");
var typescript = require('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json');

function ghPagesJsClean() {
    return del('gh-pages/js');
}

function tsc() {
    var tsResult = gulp.src(['src/**/*.ts'])
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('gh-pages/js/'));
}

function watch() {
    return gulp.watch('src/**/*.ts', gulp.series(tsc));
}

const build = gulp.series(ghPagesJsClean, tsc);

exports.default = build;
exports.watch = watch;