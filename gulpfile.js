'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var rename = require("gulp-rename");
var babelify = require('babelify');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var livereload = require('gulp-livereload');
var exec = require('child_process').exec;
var minifyCss = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace');
var autoprefixer = require('gulp-autoprefixer');


var path = {
  HTML: 'src/index.html',
  ALL: ['src/assets/reactjs/*.js', 'src/assets/js/**/*.js', 'src/index.html'],
  JS: ['src/assets/js/*.js'],
  // REACTJS: ['src/assets/reactjs/*.js'],
  SRC_ASSET: 'src/assets/',
  SRC_DIR: 'src/',
  BUILD_DIR: 'build/',
};

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildWatchScript(file) {

  var props = {
    entries: [file],
    debug : true,
    transform: [reactify, babelify]
  };

  var bundler = watchify(browserify(props));

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(rename("bundle.js"))
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());
  }

  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  return rebundle();
}

gulp.task('server', function (cb) {
  exec('node server.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('copy', function(){
  gulp.src(path.SRC_DIR+'index.html')
  .pipe(gulp.dest('./build/'));
});

gulp.task('sass', function() {
  return gulp.src(path.SRC_ASSET+'css/scss/*.scss')
      .pipe(sass())
      .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
      .pipe(concatCss('style.css'))
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen(); //Make sure to install live reload chrome extension
  gulp.watch(path.SRC_ASSET+'css/scss/*.scss', ['sass']);
  return buildWatchScript(path.SRC_ASSET+'js/app.js');
});

 

//
//TASK FOR PROD
//
function buildProdScript(file) {

  var props = {
    entries: [file],
    debug : true,
    transform: [reactify, babelify]
  };

  var bundler = browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(streamify(uglify()))
      .pipe(rename("bundle.min.js"))
      .pipe(gulp.dest('./build/'));
  }

  return rebundle();
}

gulp.task('build', function() {
  return buildProdScript(path.SRC_ASSET+'js/app.js');
});

gulp.task('sass-build', function() {
  return gulp.src(path.SRC_ASSET+'css/scss/*.scss')
      .pipe(sass())
      .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
      .pipe(concatCss('style.min.css'))
      .pipe(minifyCss({compatibility: 'ie8'}))
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());
});

gulp.task('replaceHTML', function(){
  gulp.src(path.SRC_DIR+'index.html')
    .pipe(htmlreplace({
      'css': 'style.min.css',
      'js': 'bundle.min.js'
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('nodemon', function (cb) {
  exec('nodemon server.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('prod', ['build', 'sass-build', 'replaceHTML','nodemon']);
gulp.task('default', ['sass', 'watch', 'copy', 'nodemon']);
