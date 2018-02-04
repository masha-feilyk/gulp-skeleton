var gulp        = require('gulp'); // Подключаем 'Gulp'
    sass        = require('gulp-sass'); //Подключаем 'Sass'
    pug         = require('gulp-pug'); // Подключаем 'Pug'
    browserSync = require('browser-sync'); // Подключаем 'Browser Sync'
    watch       = require('gulp-watch'); // Подключаем 'Watch', чтобы следить за изменением файлов
    imagemin    = require('gulp-imagemin'); // Подключаем 'Imagemin' для минификации изображений
    svgSprite   = require('gulp-svg-sprite'); // Подключаем 'Svg-sprite' для svg спрайтов
    rimraf      = require('rimraf'); // Подключаем 'Rimraf' для удаление папок


// Виносим все пути к нужным папкам в переменную
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

// Конфигурация для локального сервера
var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 3000
};

// Таск для запуска сервера
gulp.task('webserver', function () {
    browserSync(config);
});

// Таск для удаления папки 'build'
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

// Таск для сборки html
gulp.task('html:build', function () {
    gulp.src(path.src.html) // Берем все файли .pug
        .pipe(pug()) // Конвертируем их в .html
        .pipe(gulp.dest(path.build.html)) // Ложим их в папку 'build'
        .pipe(browserSync.reload({
            stream: true // Перезапускаем сервер
        }))
});

// Таск для сборки css
gulp.task('sass:build', function () {
    gulp.src(path.src.sass) // Берем все файли .sass
        .pipe(sass()) // Конвертируем их в .css
        .pipe(gulp.dest(path.build.css)) // Ложим их в папку 'build'
        .pipe(browserSync.reload({
            stream: true // Перезапускаем сервер
        }))
});

// Таск для минификации картинок
gulp.task('image:build', function () {
    gulp.src(path.src.img) // Берем все картинки
        .pipe(imagemin()) // Минифицируем их
        .pipe(gulp.dest(path.build.img)) // Ложим их в папку 'build'
        .pipe(browserSync.reload({
            stream: true // Перезапускаем сервер
        }))
});

// Таск для сборки спрайтов
gulp.task('sprite:build', function () {
    gulp.src(path.src.sprite) // Берем все иконки .svg
        .pipe(svgSprite({
            mode: {
                symbol: true // Конвертируем их в <symbol> для инлайнового спрайта
            }
        }))
        .pipe(gulp.dest('src/template/sprites/')) // Ложим их в папку 'sprites'
        .pipe(browserSync.reload({
            stream: true // Перезапускаем сервер
        }))
});

// Таск для сборки шрифтов
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts) // Берем шрифты
        .pipe(gulp.dest(path.build.fonts)) // Ложим их в папку 'build'
        .pipe(browserSync.reload({
            stream: true // Перезапускаем сервер
        }))
});

// В этом таске собраны все таски, которые нужно исполнить
gulp.task('build', [
    'sprite:build',
    'fonts:build',
    'html:build',
    'sass:build',
    'image:build'
]);

// Таск для отслеживания изменений в файлах
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

// Дефолтный такс для запуска проекта
gulp.task('default', ['build', 'webserver', 'watch']);