var gulp = require('gulp');
var del = require("del");
var uglify = require('gulp-uglify');
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

const components = [ { 
        name: 'attv', 
        tsconfig: 'src/tsconfig.json',
        enabled: true,
        files: [
            'src/prototypes.ts', 
            'src/helpers.ts', 
            'src/attv.ts',  
        ]
    }, { 
        name: 'data-attributes', 
        tsconfig: 'src/data-attributes/tsconfig.json', 
        enabled: true,
        files: [
            'build/attv.d.ts', 
            'src/data-attributes/*.ts', 
            '!src/data-attributes/_refs.ts'
        ] 
    }, { 
        name: 'data-models', 
        tsconfig: 'src/data-models/tsconfig.json', 
        enabled: true,
        files: [
            'build/attv.d.ts', 
            'build/data-attributes.d.ts', 
            'src/data-models/*.ts', 
            '!src/data-models/_refs.ts'
        ] 
    }, { 
        name: 'data-templates', 
        tsconfig: 'src/data-templates/tsconfig.json', 
        enabled: true,
        files: [
            'build/attv.d.ts', 
            'build/data-attributes.d.ts', 
            'build/data-models.d.ts', 
            'src/data-templates/*.ts', 
            '!src/data-templates/_refs.ts'
        ]
    }, { 
        name: 'data-walls', 
        tsconfig: 'src/data-walls/tsconfig.json', 
        enabled: true,
        files: [
            'build/attv.d.ts', 
            'build/data-attributes.d.ts', 
            'src/data-walls/*.ts', 
            '!src/data-walls/_refs.ts'
        ]
    }, { 
        name: 'data-partials', 
        tsconfig: 'src/data-partials/tsconfig.json', 
        enabled: true,
        files: [
            'build/attv.d.ts', 
            'build/data-attributes.d.ts', 
            'build/data-models.d.ts', 
            'build/data-templates.d.ts', 
            'src/data-partials/*.ts', 
            '!src/data-partials/_refs.ts'
        ]
    }, { 
        name: 'data-apps', 
        tsconfig: 'src/data-apps/tsconfig.json', 
        enabled: true,
        files: [
            'build/attv.d.ts', 
            'build/data-models.d.ts', 
            'build/data-partials.d.ts', 
            'src/data-apps/*.ts', 
            '!src/data-apps/_refs.ts'
        ]
    }, { 
        name: 'data-spinners', 
        tsconfig: 'src/data-spinners/tsconfig.json', 
        enabled: true,
        files: [
            'build/attv.d.ts', 
            'src/data-spinners/*.ts', 
            '!src/data-spinners/_refs.ts'
        ]
    }
];

function tsClean() {
    return del(BUILD_DIR);
}

function distClean() {
    return del(DIST_DIR)
}

function tsc() {
    let tasks = components.filter(comp => comp.enabled).map(comp => makeTsc(comp));
    return gulp.series(tasks);
}

function makeTsc(component) {
    let tsConfigProject = typescript.createProject(component.tsconfig);
    
    return () => gulp.src(component.files)
        .pipe(sourcemaps.init())
        .pipe(tsConfigProject())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(BUILD_DIR))
        .on('end', () => console.log('\t makeTsc: ' + component.name + ' [OK]'));
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
    components.filter(comp => comp.enabled).forEach(comp => {
        gulp.watch(comp.files, makeTsc(comp))
    });
}

// -------------------------------------------------------------------------------- //

const build = gulp.series(distClean, tsClean, tsc(), minifyJs, distribute);
const watch = gulp.series(build, watchTs);

exports.default = build;
exports.watch = watch;