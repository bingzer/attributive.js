var gulp = require('gulp');
var del = require("del");

function ghPagesJs() {
    return gulp.src('dist/*.js').pipe(gulp.dest('gh-pages/js'));
}

function ghPagesJsClean() {
    return del('gh-pages/js');
}

const build = gulp.series(ghPagesJsClean, ghPagesJs);

exports.default = build;