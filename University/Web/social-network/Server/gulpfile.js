const {src, dest, parallel, series} = require('gulp')
const pug = require('gulp-pug')
const cleaner = require('gulp-clean')
const babel = require('gulp-babel')
const cleanCSS = require('gulp-clean-css')
const less = require('gulp-less')
const path = require('path')
const minify = require('gulp-minify')

paths = {
    pages : "./pages/*.pug",
    scripts: "./scripts/*.js",
    styles: "./styles/*.less",
    sources: "./src/**",
    dest: "./views/"
}

function pages(){
    return src(paths.pages)
        .pipe(pug())
        .pipe(dest(paths.dest + "pages/"))
}

function scripts(){
    return src(paths.scripts)
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(dest(paths.dest + "scripts/"))
}

function styles(){
    return src(paths.styles)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(dest(paths.dest + "styles/"))
}

function sources(){
    return src(paths.sources)
        .pipe(dest(paths.dest + "src/"))
}

function clean(){
    return src(paths.dest)
        .pipe(cleaner())
}



exports.default = series(clean, parallel(pages, styles, scripts, sources))
exports.pages = pages
exports.clean = clean