var browserify, buffer, gulp, source, uglify;

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify');

gulp.task('dev', function()
{
  return browserify(
  {
    entries: ['./src/index.coffee'],
    extensions: ['.coffee']
  })
  .transform('coffeeify')
  .bundle()
  .pipe(source('tv.js'))
  .pipe(buffer())
  .pipe(gulp.dest('./bin'));
});

gulp.task('rel', function() // release
{
  return browserify(
  {
    entries: ['./src/index.coffee'],
    extensions: ['.coffee']
  })
  .transform('coffeeify')
  .bundle()
  .pipe(source('tv.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./bin'));
});

gulp.task('watch', function() {
  gulp.watch('./src/**', ['dev']);
});

gulp.task('default', ['watch']);