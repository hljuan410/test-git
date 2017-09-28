'use strict'
const { join } = require('path')
const gulp = require('gulp')
const del = require('del')
const sass = require('gulp-sass')
const webpack = require('webpack') // 2.x
const gulpWebpack = require('webpack-stream')
const postcss = require('gulp-postcss')
const uglify = require('gulp-uglify')
const urlrev = require('postcss-urlrev')
const sprite = require('postcss-sprite')

const twig = require('gulp-twig')


gulp.task('clean', () => {
  return del(['./app/build'])
})

gulp.task('html', ['clean'], () => {
  return gulp
    .src(join('./app/views/', '*.html'))
    .pipe(twig({ data:{cdn: '/resource/couponpc'},errorLogToConsole: true }))
    .pipe(gulp.dest('./app/build/'))
})

gulp.task('sass', ['clean'], () => {
  return gulp.src('./app/src/sass/*.scss')
    .pipe(sass({
      // includePaths: ['./app/src/sass'],
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss([
      sprite({
        basePath: './app/static/img',
        spriteName: 'sprite.png',
        spritePath: './app/build/img',
        cssImagePath: '../img/',
        spritesmithOptions: {
          padding: 2
        },
        filter: function (url) {
          return !!~url.indexOf('/src/')
        }
      }),
      urlrev({
        relativePath: './app/build/img'
      })
    ]))
    .pipe(gulp.dest('./app/build/css'))
})

gulp.task('img', ['clean'], () => {
  return gulp.src([
      './app/static/img/*.*',
      './app/static/img/*/*',
      '!./app/static/img/src/*'
    ])
    .pipe(gulp.dest('./app/build/img'))
})

const filename = '2017gqj';
gulp.task('path-changing', function(){
  //修改html内的路径
  gulp.src(['./app/transfer/'+ filename +'.html'])
    .pipe(replace('../img/', '/imgn/zhuanti/'+ filename +'/'))
    .pipe(replace('../img/demo/', '/imgn/zhuanti/'+ filename +'/demo/'))
    .pipe(replace('css/', '/cssn/zhuanti/'+ filename +'/'))
    .pipe(replace('"js/', '"/jsn/zhuanti/'+ filename +'/'))
    .pipe(gulp.dest('./app/transfer/'));
    //修改css内的路径
    gulp.src(['./app/transfer/css/index.css'])
    .pipe(replace('../img/', '/imgn/zhuanti/'+ filename +'/'))
    .pipe(gulp.dest('./app/transfer/css/'));
});

gulp.task('js', ['clean'], () => {
  return gulp.src('./app/src/js/index.js')
    .pipe(gulpWebpack(require('./webpack.config'), webpack))
    .pipe(uglify())
    .pipe(gulp.dest('./app/build/js'))
})

gulp.task('default', ['img', 'sass', 'js','html'])