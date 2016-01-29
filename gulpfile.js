var gulp = require('gulp'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    plumber  = require('gulp-plumber');

var connect = require('gulp-connect');

//设置目录
var paths = {
  scripts: 'src/js/',
  images: 'src/imgs/',
  css: 'src/css/',
  scss: 'src/scss/',
  build: 'dist/'
};


//清理操作
gulp.task('clean', function() {
  return gulp.src('dist', {read: false}).pipe(clean());
});

//less&自动添加css3后缀
gulp.task('less', function () {
  return gulp.src(paths.css + '*.less')
    .pipe(less())
    .pipe(cssmin({compatibility: 'ie7'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'last 2 Explorer versions'],
      cascade: true, //是否美化属性值 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg);
      remove: true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(gulp.dest('dist/css'));
});

//js压缩
gulp.task('jsmin', function () {
  return gulp.src(paths.scripts + '*.js')
    .pipe(plumber())
    .pipe(uglify({
        mangle: true,//类型：Boolean 默认：true 是否修改变量名
        compress: true//类型：Boolean 默认：true 是否完全压缩
    }))
    .pipe(gulp.dest('dist/js'));
});

//copy
// gulp.task('copy', function () {
//   return  gulp.src(['src/**'])
//     .pipe(gulp.dest('dist/'))
// })

gulp.watch(paths.css + '*', ['less']).on('change', function(event) {
  gulp.src(paths.css + '*')
    .pipe(connect.reload());
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.watch(paths.scripts + '*', ['jsmin']).on('change', function(event) {
  gulp.src(paths.scripts + '*')
    .pipe(connect.reload());
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// gulp.watch(paths.html + '*', ['jsmin']).on('change', function(event) {
//   gulp.src(paths.html + '*')
//     .pipe(connect.reload());
//   console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
// });

gulp.task('build', ['less'], function(){
  // connect.server({
  //   root: 'dist',
  //   port: 3000,
  //   livereload: true
  // });
});
