var gulp = require('gulp');
var del = require("del");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var pipeline = require('readable-stream').pipeline;
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
//var tsProject = typescript.createProject('tsconfig.json');
var packageJson = require('./package.json');
const flatten = require('gulp-flatten');
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
    return gulp.series(
        makeTsc({ tsconfig: 'src/tsconfig.json', files: ['src/*.ts'] }),
        makeTsc({ tsconfig: 'src/data-attributes/tsconfig.json', files: ['build/attv.d.ts', 'src/data-attributes/*.ts', '!src/data-attributes/_refs.ts'] }),
        makeTsc({ tsconfig: 'src/data-models/tsconfig.json', files: ['build/attv.d.ts', 'build/data-attributes.d.ts', 'src/data-models/*.ts', '!src/data-models/_refs.ts'] }),
    )
}

function makeTsc(options) {
    let tsConfigProject = typescript.createProject(options.tsconfig);
    
    return () => gulp.src(options.files)
        .pipe(sourcemaps.init())
        .pipe(tsConfigProject())
        .pipe(sourcemaps.write('.'))
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

function distribute() {
    return pipeline(
        gulp.src([
            BUILD_DIR + '**/*.min.js*',
            BUILD_DIR + '**/*.d.ts*',
            BUILD_DIR + '**/*.js.map*'
        ]),
        rename({ dirname: '' }),
        gulp.dest(DIST_DIR, { })
    );
}

function watchTs() {
    return gulp.watch('src/**/*.ts', 
        gulp.series(tsc)
    );
}

const build = gulp.series(distClean, tsClean, tsc(), minifyJs, distribute);
const watch = gulp.series(build, watchTs);

exports.default = build;
exports.watch = watch;