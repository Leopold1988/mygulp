var gulp = require('gulp'),
  less = require('gulp-less'),
  jade = require('gulp-jade'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  autoprefixer = require('gulp-autoprefixer'),
  cssmin = require('gulp-minify-css'),
  notify = require('gulp-notify'), // 更改提醒
  cache = require('gulp-cache'), // 图片缓存，只有图片替换了才压缩
  clean = require('gulp-clean');

var connect = require('gulp-connect');
var server = require('gulp-server-livereload');
/* es6转es5 */
var es6transpiler = require('gulp-es6-transpiler');
/* react依赖合并 */
var browserify = require("browserify");
var source = require("vinyl-source-stream"); // 流转vinyl
var reactify = require("reactify"); // jsx转js
/* 去除不被使用的css */
var uncss = require("gulp-uncss");
/* 顺序执行任务 */
var sequence = require("gulp-sequence");
/* Gulp解决发布线上文件(CSS和JS)缓存问题 */
var rev = require("gulp-rev"); // 获取md5
var revCollector = require('gulp-rev-collector'); // 路径替换

//gulp主动设置的命令
gulp.task("combine", function() {
  //通过browserify管理依赖
  browserify({
      //入口点,app.jsx
      entries: ["./app.jsx"],
      //利用reactify工具将jsx转换为js
      transform: [reactify]
    })
    //转换为gulp能识别的流
    .bundle()
    //合并输出为app.js
    .pipe(source("app.js"))
    //输出到当前文件夹中
    .pipe(gulp.dest("./"));
});

//设置目录
var paths = {
  scripts: 'src/js/',
  images: 'src/img/',
  css: 'src/css/',
  html: 'src/html/',
  build: 'dist/'
};

// 清理
gulp.task('clean', function() {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});

// JS
gulp.task('jsmin', function() {
  return gulp.src(['!src/js/tobabel.js', 'src/js/*.js'])
    // .pipe(es6transpiler())
    // .pipe(notify({ message: 'ES6 to ES5' }))
    .pipe(uglify({
        mangle: true,//类型：Boolean 默认：true 是否修改变量名
        compress: true//类型：Boolean 默认：true 是否完全压缩
    }))
    .pipe(notify({ message: "JS---><%= file.relative %>压缩完成!" }))
    .pipe(rev())                              //- 文件名加MD5后缀
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())                     //- 生成一个rev-manifest.json
    .pipe(gulp.dest('./rev'));                //- 将 rev-manifest.json 保存到 rev 目录内
});

// less编译&自动添加css3后缀
gulp.task('less', function() {
  return gulp.src(paths.css + 'index.less')
    .pipe(less())
    .pipe(notify({ message: 'LESS to CSS' }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'last 2 Explorer versions'],
      cascade: true, //是否美化属性值 默认：true
      remove: true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(notify({ message: '自动添加CSS3前缀' }))
    .pipe(cssmin({
      compatibility: 'ie7'
    }))
    .pipe(notify({ message: 'CSS代码压缩完成' }))
    .pipe(rev())                              //- 文件名加MD5后缀
    .pipe(gulp.dest("dist/css/"))
    .pipe(rev.manifest())                     //- 生成一个rev-manifest.json
    .pipe(gulp.dest('./rev'));                //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('rev', function() {
    gulp.src(['./rev/*.json', './src/*.html'])
    //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件

    .pipe(revCollector())
    //- 执行文件内css名的替换

    .pipe(gulp.dest('dist/'));
    //- 替换后的文件输出的目录
});

gulp.task('uncss', function(){
  return gulp.src("dist/bootstrap/css/bootstrap.min.css")
    .pipe(uncss({
      html : ["dist/index.html"]
    }))
    .pipe(rename({
      suffix: ".clean"
    }))
    .pipe(gulp.dest('dist/bootstrap/css'));
});

// jade
gulp.task('jade', function() {
  return gulp.src(paths.html + "*.jade")
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('src/'));
});

// 图片
gulp.task('imagemin', function() {
  return gulp.src(paths.images + '**')
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(notify({ message: "IMAGE---><%= file.relative %>压缩完成!" }))
    .pipe(gulp.dest('dist/img'));
});

// copy
gulp.task('copy', function() {
  return gulp.src(['src/bootstrap/**','src/datatable/**'])
    .pipe(gulp.dest('dist/bootstrap'));
});

gulp.task('connect', function(){
  gulp.src('./')
    .pipe(server({
      livereload : true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('watch', function(){
  gulp.watch(paths.css + '*', ['less'], function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  gulp.watch(paths.images + '*', ['imagemin']).on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  gulp.watch(paths.html + '*', ['jade', 'uncss']).on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  gulp.watch(paths.scripts + '*', ['jsmin']).on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  gulp.watch('src/*.html', ['copy']).on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});


gulp.task('default', sequence('clean', ['less', 'jsmin'], ['copy', 'jade'], 'rev', 'uncss', 'imagemin', 'watch', 'connect'));

