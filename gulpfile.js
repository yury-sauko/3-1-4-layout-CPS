const gulp         = require('gulp');
const browserSync  = require('browser-sync');
const sass         = require('gulp-sass')(require('sass'));
const cleanCSS     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require('gulp-rename');
const tinypng      = require('gulp-tinypng');
const htmlmin      = require('gulp-htmlmin');

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel('scripts'));
});

gulp.task('html', function() {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('icons', function() {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest('dist/icons'))
});

gulp.task('img-min', function() {
    return gulp.src("src/img/**/*.{png,jpg}")
        .pipe(tinypng('vjHNZmS45ZR1fSywLN8xSPbPRXQtVxl6'))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('svg+webp', function() {
    return gulp.src("src/img/**/*.{svg,webp}")
        .pipe(gulp.dest('dist/img'));
});

gulp.task('pdf', function() {
    return gulp.src("src/*.pdf")
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'html', 'scripts', 'fonts', 'icons', 'img-min', 'svg+webp', 'pdf'));