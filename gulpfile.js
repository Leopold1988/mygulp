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

var open = require('gulp-open');

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
  return del.sync([paths.build], cb);
});

//自动添加css3后缀
// gulp.task('testAutoFx', function() {
//   return gulp.src(paths.css + '*.css')
//     .pipe(autoprefixer({
//       browsers: ['last 2 versions', 'last 2 Explorer versions'],
//       cascade: true, //是否美化属性值 默认：true 像这样：
//       //-webkit-transform: rotate(45deg);
//       //        transform: rotate(45deg);
//       remove: true //是否去掉不必要的前缀 默认：true
//     }))
//     .pipe(gulp.dest('dist/css'));
// });

//less
gulp.task('css', function () {
  return gulp.src(paths.css + '*.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'last 2 Explorer versions'],
      cascade: true, //是否美化属性值 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg);
      remove: true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(cssmin({compatibility: 'ie7'}))
    .pipe(gulp.dest('dist/css'));
});

//js压缩
gulp.task('jsmin', function () {
  return gulp.src(paths.scripts + '*.js')
    .pipe(uglify({
        mangle: true,//类型：Boolean 默认：true 是否修改变量名
        compress: true//类型：Boolean 默认：true 是否完全压缩
    }))
    .pipe(gulp.dest('dist/js'));
});

gulp.watch(paths.css + '*', ['css']);
gulp.watch(paths.scripts + '*', ['jsmin']);

gulp.task('build', ['clean', 'jsmin', 'css'], function() {
  gulp.src(__filename)
    .pipe(open({uri: 'localhost:3000'}));
});