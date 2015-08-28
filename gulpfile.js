var gulp = require('gulp'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    del = require('del');

//设置目录
var paths = {
  scripts: 'src/js/',
  images: 'src/imgs/',
  css: 'src/css/',
  scss: 'src/scss/',
  build: 'dist/'
};

//清理操作
gulp.task('clean', function(cb) {
  del([paths.build], cb)
});

//自动添加css3后缀
gulp.task('testAutoFx', ['testLess'], function() {
  gulp.src(paths.css + '*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'last 2 Explorer versions'],
      cascade: true, //是否美化属性值 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg);
      remove: true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(gulp.dest('dist/css'));
});

//less
gulp.task('testLess', function () {
    gulp.src(paths.css + '*.less')
        .pipe(less())
        .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest('src/css'));
});

gulp.task('build', ['clean', 'testLess', 'testAutoFx'], function() {
  gulp.watch(paths.css + '*', ['testAutoFx']);
});