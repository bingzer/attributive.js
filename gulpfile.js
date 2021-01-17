var gulp = require('gulp');
var del = require("del");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
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
        rename({ suffix: '.min' }),
        gulp.dest(BUILD_DIR)
    );
}

function concatAttributiveJs(name, min) {
    const JS_DIR = BUILD_DIR;
    var suffix = name ? ("." + name + ".") : ".";

    name = name || 'default';
    min = typeof min === 'undefined' ? '.min' : '';

    var files = {
        "default": [
            JS_DIR + '/attv' + min + '.js'
        ],
        "core": [
            JS_DIR + '/attv' + min + '.js',
            JS_DIR + '/data-**' + min + '.js'
        ],
        "extras": [
            JS_DIR + '/attv' + min + '.js',
            JS_DIR + '/data-**' + min + '.js',
            JS_DIR + '/extras/data-**' + min + '.js'
        ]
    }

    return () => pipeline(
        gulp.src(files[name]),
        sourcemaps.init(),
        concat('attributive' + suffix + version + min + '.js'),
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

const build = gulp.series(distClean, tsClean, tsc, uglifyAttributiveJs, concatAttributiveJs(), concatAttributiveJs(undefined, false), concatAttributiveJs('core'), concatAttributiveJs('core', false), concatAttributiveJs('extras'), concatAttributiveJs('extras', false), grabDts);
const watch = gulp.series(build, watchTs);

exports.default = build;
exports.watch = watch;