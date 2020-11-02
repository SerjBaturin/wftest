const path = require('path');
const { dest, parallel, series, src } = require('gulp');
const tsc = require('gulp-typescript').createProject('tsconfig.json');
const clean = require('gulp-clean');

const outputDir = path.resolve(__dirname, '..', '..', 'dist', 'server');

function cleanDir() {
    return src(outputDir, { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
}

function compile() {
    return tsc.src()
        .pipe(tsc())
        .pipe(dest(outputDir));
}

function copy() {
    return src([
        path.resolve(__dirname, 'package.json'),
        path.resolve(__dirname, 'package-lock.json'),
        path.resolve(__dirname, '.gitignore'),
    ]).pipe(dest(outputDir));
}

exports.build = series(cleanDir, parallel(compile, copy));
exports.clean = cleanDir;
exports.copy = copy;
exports.compile = compile;