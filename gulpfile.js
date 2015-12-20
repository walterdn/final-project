var gulp = require('gulp');
var mocha = require('gulp-mocha');
var webpack = require('webpack-stream');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');

gulp.task('htmlFiles:dev', function() {
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('build/'));
});

gulp.task('cssFiles:dev', function() {
  gulp.src('app/scss/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('build/css/'));
});

gulp.task('webpack:test', function() {
  return gulp.src('/test/client/test_entry.js')
    .pipe(webpack({
      output: {
        filename: 'test_bundle.js'
      }
    }))
    .pipe(gulp.dest('test/client'));
});

gulp.task('servertests', function() {
  return gulp.src('/test/server/**/*tests.js')
    .pipe(mocha({reporter: 'nyan'}))
    .once('error', function() {
      process.exit();
    })
    .once('end', function() {
      if (this.seq.length === 1 && this.seq[0] === 'servertests')
        process.exit();
    }.bind(this));
});

gulp.task('jsFiles:dev', function() {
  return gulp.src('app/js/**/*.js')
  .pipe(webpack({
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('build/js/'));
});

gulp.task('build:dev', ['jsFiles:dev', 'htmlFiles:dev', 'cssFiles:dev']);
gulp.task('default', ['build:dev']);
