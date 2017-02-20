const gulp            = require('gulp'); 
const handlebars      = require('gulp-handlebars');//模版 
const minifyCss       = require('gulp-minify-css');
const revCollector    = require('gulp-rev-collector');  
const imagemin        = require('gulp-imagemin');
const spritesmith     = require('gulp.spritesmith');
const watch           = require('gulp-watch');
const defineModule    = require('gulp-define-module');
const revOutdated     = require('gulp-rev-outdated');
const concat          = require('gulp-concat');
//const jshint          = require('gulp-jshint');
const uglify          = require('gulp-uglify');
const wrapJS          = require("gulp-wrap-js");
const rev             = require('gulp-rev');
const gutil           = require('gulp-util');
const rimraf          = require('rimraf');
const path            = require('path');
const through         = require('through2');
const browserSync     = require('browser-sync');
const usemin          = require('gulp-usemin');//替换html 页面的link 和js 
//var plumber = require('gulp-plumber');
//var less= require('gulp-less');

/**
 * 图片处理
 */
//图片合并
gulp.task('sprite', function () {
  var spriteData = gulp.src('./src/img/*.png').pipe(spritesmith({
    imgName: './img/sprite.png',
    cssName: './css/sprite.css'
  }));
  return spriteData.pipe(gulp.dest('./dist/'));
});
//图片压缩
gulp.task('images',['sprite'], function(){
    gulp.src('./img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./img/'));
})

//----------------------------------------------------------------------------------------------------------------------------------------------//

/**
 * 模版和json文件处理
 */
//tpl html 等模版转js
gulp.task('templates', function(){
  gulp.src('template/translateOrder.tpl')
    .pipe(handlebars())
    .pipe(concat('translateOrder.tpl.js'))
    .pipe(defineModule('node'))
    .pipe(wrapJS('define(function (require, exports, module) {%= body %})'))
    .pipe(gulp.dest('dist/template/'));
});
//json文件转js文件
gulp.task('json', function(){
  gulp.src('JSON/cityData.json')
    .pipe(concat('cityData.json.js'))
    .pipe(defineModule('node'))
    .pipe(wrapJS('define(function (require, exports, module) {%= body %})'))
    .pipe(gulp.dest('build/json/'));
});

//----------------------------------------------------------------------------------------------------------------------------------------------//

/**
 * 单元测试
 */
//语法检查
gulp.task('jshint', function () {
    return gulp.src('./src/js/index.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//捕获任务中的出错
//gulp.src('./*.ext')
    //.pipe(plumber())
    //.pipe(less())
    //.pipe(gulp.dest('./'));

//----------------------------------------------------------------------------------------------------------------------------------------------//

/**
 * css处理
 */
//更改html css引用路径 css压缩 合并 重命名 js压缩 合并 重命名
gulp.task('build', function() {
    gulp.src('./src/html/index.html')
        .pipe(usemin({
            css:[minifyCss(), rev()],
            js:[uglify(), rev()]
        })) 
        .pipe(gulp.dest('./dist/html'));                        //- 替换后的文件输出的目录
});
gulp.task('cssClean', function() {
    gulp.src( ['./dist/css/*.css'], {read: false})
        .pipe( revOutdated(1) ) // 只保留一个版本的文件 其余文件删除
        .pipe( cleaner() );
    return;
});
gulp.task('jsClean', function() {
    gulp.src( ['./dist/js/*.js'], {read: false})
        .pipe( revOutdated(1) ) // 只保留一个版本的文件 其余文件删除
        .pipe( cleaner() );
    return;
});
//执行文件清除
gulp.task('clean', function(){
  gulp.run('cssClean','jsClean');
})

//----------------------------------------------------------------------------------------------------------------------------------------------//

//清除文件
function cleaner() {
    return through.obj(function(file, enc, cb){
        rimraf( path.resolve( (file.cwd || process.cwd()), file.path), function (err) {
            if (err) {
                this.emit('error', new gutil.PluginError('Cleanup old files', err));
            }
            this.push(file);
            cb();
        }.bind(this));
    });
}

//----------------------------------------------------------------------------------------------------------------------------------------------//

/**
 * 监听文件
 */
//监听任务
gulp.task('watch', function() {
    watch('./template/*', function() {
        gulp.run('templates');
    });

});
//监听文件自动刷新浏览器
gulp.task('browser-sync', function () {
   var files = [
      './src/html/*.html',
      './src/css/*.css',
      './src/js/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: ''
      }
   });
});

//----------------------------------------------------------------------------------------------------------------------------------------------//
gulp.task('mytest',['rev'],function(){
debugger;
})
