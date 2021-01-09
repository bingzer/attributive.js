var gulp = require('gulp');
var del = require("del");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pipeline = require('readable-stream').pipeline;
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json');
var packageJson = require('./package.json');
var flatten = require('gulp-flatten');
var version = packageJson.version;

const DIST_DIR = 'dist';
const BUILD_DIR = 'build';

function tsClean() {
    return del(BUILD_DIR);
}

function distClean() {
    return del(DIST_DIR)
}

function tsc() {
    return gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false }))
        .pipe(gulp.dest(BUILD_DIR));
}

function watchTs() {
    return gulp.watch('src/**/*.ts', gulp.series(tsc));
}

function uglifyAttributiveJs(name) {
    return pipeline(
        gulp.src(BUILD_DIR + '/**/*.js'),
        uglify({
            compress: {
                global_defs: {
                    ATTV_DEBUG : false,
                    ATTV_VERBOSE_LOGGING : false,
                    ATTV_VERSION : version
                }
            }
        }),
        gulp.dest(DIST_DIR)
    );
}

function concatAttributiveJs(name) {
    const JS_DIR = DIST_DIR;
    var suffix = name ? ("." + name + ".") : ".";
    if (!name) 
        name = "default";

    var files = {
        "default": [
            JS_DIR + '/attv.js'
        ],
        "core": [
            JS_DIR + '/attv.js',
            JS_DIR + '/data-attributes.js',
            JS_DIR + '/data-template.js',
            JS_DIR + '/data-partial.js'
        ]
    }

    return () => pipeline(
        gulp.src(files[name]),
        sourcemaps.init(),
        concat('attributive' + suffix + version + '.min.js'),
        sourcemaps.write('.'),
        gulp.dest(DIST_DIR)
    )
        
}

function grabDts() {
    return pipeline(
        gulp.src(BUILD_DIR + '/**/*.d.ts'),
        gulp.dest(DIST_DIR)
    );
}

const build = gulp.series(distClean, tsClean, tsc, uglifyAttributiveJs, concatAttributiveJs(), grabDts);
const watch = gulp.series(build, watchTs);

exports.default = build;
exports.watch = watch;