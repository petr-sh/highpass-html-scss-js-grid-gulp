const { src, dest, series, watch } = require('gulp');
const htmlMin = require('gulp-htmlmin');
const typograf = require('gulp-typograf');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const image = require('gulp-image');
const webp = require('gulp-webp');
const svgSprite = require('gulp-svg-sprite');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const del = require('del');

let prod = false;

const isProd = (done) => {
  prod = true;

  done();
}

const clean = () => {
  return del(['./dist']);
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./dist'));
}

const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(gulpIf(!prod, sourcemaps.init()))
    .pipe(sass().on('error', notify.onError()))
    .pipe(gulpIf(prod, autoprefixer({
      cascade: false,
      overrideBrowserslist: ["last 5 versions"]
    })))
    .pipe(gulpIf(prod, cleanCSS({
      level: 2
    })))
    .pipe(gulpIf(!prod, sourcemaps.write('.')))
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream());
}

const scripts = () => {
  return src([
      './src/js/main.js'
    ])
    .pipe(gulpIf(!prod, sourcemaps.init()))
    .pipe(gulpIf(prod, babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpIf(prod, uglify({
      toplevel: true
    }).on('error', notify.onError())))
    .pipe(gulpIf(!prod, sourcemaps.write('.')))
    .pipe(dest('./dist/js'))
    .pipe(browserSync.stream());
}

const images = () => {
  return src([
      './src/img/**/*.jpg',
      './src/img/**/*.jpeg',
      './src/img/**/*.png',
      './src/img/*.svg'
    ])
    .pipe(image())
    .pipe(dest('./dist/img'));
}

const webpImages = () => {
  return src([
      './src/img/**/*.jpg',
      './src/img/**/*.jpeg',
      './src/img/**/*.png'
    ])
    .pipe(webp())
    .pipe(dest('./dist/img'))
};

const svgSprites = () => {
  return src('./src/img/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('./dist/img'));
}

const htmlMinify = () => {
  return src('./src/**/*.html')
    .pipe(typograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(gulpIf(prod, htmlMin({
      collapseWhitespace: true
    })))
    .pipe(dest('./dist'))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
}

watch('./src/resources/**', resources);
watch('./src/scss/**/*.scss', styles);
watch('./src/js/**/*.js', scripts);
watch('./src/img/**', images);
watch('./src/img/**', webpImages);
watch('./src/img/svg/**/*.svg', svgSprites);
watch('./src/**/*.html', htmlMinify);

exports.dev = series(clean, resources, styles, scripts, images, webpImages, svgSprites, htmlMinify, watchFiles);
exports.build = series(isProd, clean, resources, styles, scripts, images, webpImages, svgSprites, htmlMinify);
