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


function minifyJs() {
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

function packageJs() {
    return gulp.series(
        makePackage('bare', true),
        makePackage('core', true),
        makePackage('default', true)
    );
}

function makePackage(name, uglify) {
    name = name || 'default';

    const JS_DIR = BUILD_DIR;

    var prefix = name === 'default' ? "" : ("." + name + "");
    var suffix = typeof uglify === 'undefined' ? '.js' : '.min.js';
    var min = typeof uglify === 'undefined' ? '!(*.min)' : '.min';  // exlude .min.js files

    var files = {
        "bare": [
            JS_DIR + '/attv' + min + '.js'
        ],
        "core": [
            JS_DIR + '/attv' + min + '.js',
            JS_DIR + '/data-attributes' + min + '.js'
        ],
        "default": [
            JS_DIR + '/attv' + min + '.js',
            JS_DIR + '/data-attributes' + min + '.js',
            JS_DIR + '/extras/data-*' + min + '.js'
        ]
    }

    var jsFilename = 'attributive' + prefix + suffix;

    return () => pipeline(
        gulp.src(files[name]),
        sourcemaps.init(),
        concat(jsFilename),
        sourcemaps.write('.'),
        gulp.dest(BUILD_DIR)
    );  
}

function makeDataAttributesJs() {
    var files = BUILD_DIR + '/data-*.js';
    var jsFilename = 'data-attributes.js';

    return pipeline(
        gulp.src(files),
        sourcemaps.init(),
        concat(jsFilename),
        sourcemaps.write('.'),
        gulp.dest(BUILD_DIR)
    );
}

function distribute() {
    return gulp.series(
        distributeJs,
        distributeDts
    );
}

function distributeJs() {
    return pipeline(
        gulp.src(BUILD_DIR + '/attributive.*.js*'),
        gulp.dest(DIST_DIR)
    );
}

function distributeDts() {
    return pipeline(
        gulp.src(BUILD_DIR + '/**/*.d.ts'),
        gulp.dest(DIST_DIR)
    );
}

function watchTs() {
    return gulp.watch('src/**/*.ts', 
        gulp.series(tsc, makeDataAttributesJs)
    );
}

const build = gulp.series(distClean, tsClean, tsc, makeDataAttributesJs, minifyJs, packageJs(), distribute());
const watch = gulp.series(build, watchTs);

exports.default = build;
exports.watch = watch;