var gulp        = require('gulp'); // Подключаем Gulp
    sass        = require('gulp-sass'); //Подключаем Sass пакет,
    pug         = require('gulp-pug'); // Подключаем pug пакет
    inject      = require('gulp-inject');
    browserSync = require('browser-sync'); // Подключаем Browser Sync
    concat      = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)
    watch       = require('gulp-watch');
    imagemin    = require('gulp-imagemin');
    svgSprite   = require('gulp-svg-sprite');
    rimraf      = require('rimraf');
    reload      = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        css: 'build/css/',
        img: 'build/img/',
        sprite: 'build/sprite/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/template/*.pug',
        sass: 'src/sass/manifest.sass',
        img: 'src/img/**/*.*',
        sprite: 'src/sprite/**/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/template/**/*.pug',
        sass: 'src/sass/**/*.sass',
        img: 'src/img/**/*.*',
        sprite: 'src/sprite/**/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 3000
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(pug())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('sass:build', function () {
    gulp.src(path.src.sass)
        .pipe(sass())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('sprite:build', function () {
    gulp.src(path.src.sprite)
        .pipe(svgSprite({
            mode: {
                symbol: true
            }
        }))
        .pipe(gulp.dest('src/template/sprites/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'sprite:build',
    'fonts:build',
    'html:build',
    'sass:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.sass], function(event, cb) {
        gulp.start('sass:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);