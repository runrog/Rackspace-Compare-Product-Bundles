const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const browserSync = require('browser-sync');
const autoClose = require('browser-sync-close-hook');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const ejs = require('gulp-ejs');
const fs = require('fs');
const cloudfiles = require('gulp-cloudfiles');

const rackspace = JSON.parse(fs.readFileSync('./rackspace.json'));

const reload = browserSync.reload;

const sassTask = function buildSass() {
  return gulp.src('styles/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' })
    .on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./dist/css'))
    .on('end', () => {
      console.log('Successfully Built SASS');
      browserSync.reload();
    });
};

const jsTask = function buildJS() {
  return gulp.src('js/**/*.js')
  .pipe(concat('app.js'))
  .pipe(babel({
    presets: ['env'],
  }))
  .pipe(minify({
    ext: {
      min: '.min.js',
    },
  }))
  .pipe(gulp.dest('dist/js/'))
  .on('end', () => {
    console.log('Successfully Built JS');
  });
};

const rackspaceFiles = function buildJS() {
  const container = 'http://b908c4040f36e92b6c1d-5868806ce06e7becdec4f0e74f1f735c.r92.cf1.rackcdn.com/';
  const options = {
    uploadPath: 'static/bundle-compare/',
  };
  return gulp.src('./dist/**', { read: false })
  .pipe(cloudfiles(rackspace, options))
  .on('end', () => {
    console.log(`Successfully pushed to cloudfiles: Static URL: \x1b[33m${container}${options.uploadPath}index.html`);
  });
};

gulp.task('build-sass', sassTask);
gulp.task('build-js', jsTask);

gulp.task('build-dist', () => {
  gulp.src('index.ejs')
   .pipe(ejs({}, {}, { ext: '.html' }))
   .pipe(gulp.dest('./dist'))
   .on('end', () => {
     console.log('Successfully Built ejs');
     // run sass/js tasks
     sassTask();
     jsTask();
     setTimeout(() => {
       rackspaceFiles();
     }, 1000);
   });
});

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.use({
    plugin() {},
    hooks: {
      'client:js': autoClose,
    },
  });
  browserSync({
    proxy: 'localhost:2001',
    port: 2004,
    notify: false,
    ui: false,
  });
});

gulp.task('nodemon', (cb) => {
  let called = false;
  return nodemon({
    script: 'server.js',
    ignore: [
      'gulpfile.js',
      'node_modules/',
    ],
  })
  .on('start', () => {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', () => {
    setTimeout(() => {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('default', [
  'browser-sync',
  'build-sass',
  'build-js',
], () => {
  watch([
    '**/*.ejs',
  ], reload);
  gulp.watch([
    'styles/**/*.scss',
  ], ['build-sass']);
  gulp.watch([
    'js/**/*.js',
  ], ['build-js']);
});
