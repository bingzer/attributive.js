var gulp = require('gulp');
var del = require("del");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pipeline = require('readable-stream').pipeline;
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json');

function ghPagesJsClean() {
    return del('docs/js');
}

function tsc() {
    return gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false }))
        .pipe(gulp.dest('docs/js/'));
}

function watch() {
    return gulp.watch('src/**/*.ts', gulp.series(tsc));
}

function uglifyAttributiveJs() {
    return pipeline(
        gulp.src('docs/js/*.js'),
        uglify(),
        gulp.dest('docs/js/dist')
    );
}

function concatAttributiveJs() {
    return pipeline(
        gulp.src([
            'docs/js/dist/attv.js',
            'docs/js/dist/data-attributes.js',
            'docs/js/dist/data-wall.js',
            'docs/js/dist/data-docs.js',
            'docs/js/dist/data-template.js',
            'docs/js/dist/data-partial.js',
            'docs/js/dist/data-tab.js',
            'docs/js/dist/data-table.js',
            'docs/js/dist/data-dialog.js'
        ]),
        sourcemaps.init(),
        concat('attributive.min.js'),
        sourcemaps.write('.'),
        gulp.dest('docs/js/dist/')
    )
        
}

const build = gulp.series(ghPagesJsClean, tsc, uglifyAttributiveJs, concatAttributiveJs);

exports.default = build;
exports.watch = watch;