var gulp = require('gulp');
var del = require("del");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
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

function concatAttributiveJs() {
    return pipeline(
        gulp.src([
            'gh-pages/js/dist/attv.js',
            'gh-pages/js/dist/data-attributes.js',
            'gh-pages/js/dist/data-wall.js',
            'gh-pages/js/dist/data-docs.js',
            'gh-pages/js/dist/data-template.js',
            'gh-pages/js/dist/data-partial.js',
            'gh-pages/js/dist/data-tab.js',
            'gh-pages/js/dist/data-table.js',
            'gh-pages/js/dist/data-dialog.js'
        ]),
        sourcemaps.init(),
        concat('attributive.min.js'),
        sourcemaps.write('.'),
        gulp.dest('gh-pages/js/dist/')
    )
        
}

const build = gulp.series(ghPagesJsClean, tsc, uglifyAttributiveJs, concatAttributiveJs);

exports.default = build;
exports.watch = watch;