const projectFolder = "dist";
const sourceFolder = "#src";
const path = {
    build:{
        html: projectFolder + '/',
        css: projectFolder + '/css/',
        js: projectFolder + '/js/',
        img: projectFolder + '/img/',
        fonts: projectFolder + '/fonts/'
    },
    src:{
        html: sourceFolder + '/index.html',
        sass: sourceFolder + '/sass/style.sass',
        scss: sourceFolder + '/scss/style.scss',
        js: sourceFolder + '/js/script.js',
        img: sourceFolder + '/img/**/*',
        fonts: sourceFolder + '/fonts/*.ttf'
    },
    watch:{
        html: sourceFolder + '/**/*.html',
        sass: sourceFolder + '/sass/**/*.sass',
        scss: sourceFolder + '/scss/**/*.scss',
        js: sourceFolder + '/js/**/*.js',
        img: sourceFolder + '/img/**/*',
    },
    clean: './' + projectFolder + '/'
};

const {src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');

const preprocessor = {
    name: sass,
    path: path.src.sass,
    watch: path.watch.sass
};

function browsersync(p){
    browserSync.init({
        server:{
            baseDir: './' + projectFolder + '/'
        },
        port: 3000,
        notify: false,
        online: true
    })
};

function scripts(){
    return src(path.src.js)
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

function styles(){
    return src(path.src.scss)
        .pipe(sass())
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({overrideBrowserslist: ['last 50 versions'], grid: true}))
        // .pipe(cleancss(( { level: { 1: {specialComments: 0} }, format: 'beautify' } )))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
};

function images(){
    return src(path.src.img)
        .pipe(newer(path.build.img))
        .pipe(imagemin())
        .pipe(dest(path.build.img))
}

function cleanimg(){
    return del( path.build.img,{force: true});
}

const html = () => {
    return src(path.src.html)
    .pipe(dest(path.build.html))
    // .pipe(browserSync.reload())
}

function startwatch(){
    watch(path.watch.scss, styles);
    watch(path.watch.js, scripts);
    watch(path.watch.html, html);
    watch(path.watch.html).on('change', browserSync.reload);
    watch(path.watch.img, images);
};


exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.html = html;

exports.default = parallel(scripts, styles, html, browsersync, startwatch);
