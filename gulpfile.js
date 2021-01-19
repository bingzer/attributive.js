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
const { escapeLeadingUnderscores } = require('typescript');
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


function uglifyAttributiveJs() {
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

function concatAttributiveJs(name, uglify) {
    name = name || 'default';

    const JS_DIR = BUILD_DIR;

    var suffix = name === 'default' ? "" : ("." + name + "");
    var min = typeof uglify === 'undefined' ? '!(*.min)' : '.min';  // exlude .min.js files
    var prefix = typeof uglify === 'undefined' ? '.js' : '.min.js';

    var files = {
        "bare": [
            JS_DIR + '/attv' + min + '.js'
        ],
        "core": [
            JS_DIR + '/attv' + min + '.js',
            JS_DIR + '/data-*' + min + '.js'
        ],
        "default": [
            JS_DIR + '/attv' + min + '.js',
            JS_DIR + '/data-*' + min + '.js',
            JS_DIR + '/extras/data-*' + min + '.js'
        ]
    }

    var jsFilename = 'attributive' + suffix + prefix;

    return () => pipeline(
        gulp.src(files[name]),
        sourcemaps.init(),
        concat(jsFilename),
        sourcemaps.write('.'),
        gulp.dest(BUILD_DIR)
    );  
}

function distribute() {
    return pipeline(
        gulp.src(
            BUILD_DIR + '/attributive.*.js.*',
        ),
        gulp.dest(DIST_DIR)
    );
}

function grabDts() {
    return pipeline(
        gulp.src(BUILD_DIR + '/**/*.d.ts'),
        gulp.dest(DIST_DIR)
    );
}

function concatJs(uglify) {
    return gulp.series(
        concatAttributiveJs('bare', uglify),
        concatAttributiveJs('core', uglify),
        concatAttributiveJs('default', uglify)
    );
}

function watchTs() {
    return gulp.watch('src/**/*.ts', 
        gulp.series(tsc, concatAttributiveJs('default'))
    );
}

const build = gulp.series(distClean, tsClean, tsc, concatJs(), uglifyAttributiveJs, concatJs(true), grabDts, distribute);
const watch = gulp.series(build, watchTs);

exports.default = build;
exports.watch = watch;