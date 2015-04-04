// Burada öncelikle gulp'ı projeye dahil ediyoruz.
var gulp 						= require('gulp'),
		less 						= require('gulp-less'),
		minifycss 			= require('gulp-minify-css'),
		rename 				= require('gulp-rename'),
		concat 				= require('gulp-concat'),
		uglify 					= require('gulp-uglify'),
		ngAnnotate 		= require('gulp-ng-annotate'),
		connect				= require('gulp-connect'),
		clean 					= require('gulp-clean');
		// Daha sonra eklenebilecekler : gulp-jshint, gulp-csslint, gulp-file-include

gulp.task('default', ['connect', 'less', 'js', 'watch']);

// Less Dosyalarını CSS Dosyasına Çevirme
gulp.task('less', function() {
	gulp.src(['./src/less/**/*.less'])
		// Less dosyasını Css'e çevirmeye uygun hale getirir.
		.pipe(less())
		// Tüm css'e dönüşmüş dosyaları tek bir css dosyasında toplar.
		.pipe(concat('main.css'))
		// Oluşturulan Css dosyasını belirtilen konuma kopyalar.
		.pipe(gulp.dest('./src/css/'))
		// app.css dosyasının ismini başka bir yere kaydetmek üzere app.min.css yapar.
		.pipe(rename({suffix: '.min'}))
		// app.css dosyasını boyutunu küçültmek üzere sıkıştırır.
		.pipe(minifycss())
		// Ve yine aşağıda belirtilen klasöre kaydeder.
		.pipe(gulp.dest('./src/css/'))
		//Bu kısım tarayıcıyı değişikliklerden sonra otomatik güncelleyecektir.
		.pipe(connect.reload());
});

// Javascript Dosyalarını Birleştirme ve Sıkıştırma İşlemi
gulp.task('js', function() {
	gulp.src('./src/scripts/**/*.js')
		// Belirtilen klasör içerisindeki tüm js dosyalarını app.js adında tek bir dosya haline getirir.
		.pipe(concat('main.js'))
		// Burada angularjs dosyalarımızdaki dependencies'lerimizi sıkıştırılmış dosyada kullanılabilecek hale getiriyor.
		.pipe(ngAnnotate())
		// Ve aşağıda belirttiğimiz klasöre kaydediyor.
		.pipe(gulp.dest('./src/js/'))
		// app.js dosyasının ismini başka bir yere kaydetmek üzere app.min.js yapar.
		.pipe(rename({suffix: '.min'}))
		// app.js dosyasını boyutunu küçültmek üzere sıkıştırır.
		.pipe(uglify())
		// Ve yine aşağıda belirtilen klasöre kaydeder.
		.pipe(gulp.dest('./src/js/'))
		//Bu kısım tarayıcıyı değişikliklerden sonra otomatik güncelleyecektir.
		.pipe(connect.reload());
});

// Gulp Watch görevi html'leri izlerken bir değişiklik olduğunda bu kısmı çalıştırır. Bu kısım ise değişiklikleri anında görebilmemiz için tarayıcıyı güncelleyecektir.
gulp.task('html', function() {
	gulp.src('./src/')
		//Bu kısım tarayıcıyı değişikliklerden sonra otomatik güncelleyecektir.
		.pipe(connect.reload());
});

// Proje içerisindeki değişiklikleri kontrol ederek belirttiğimiz görevlerin çalışmasını sağlar.
gulp.task('watch', function() {
	gulp.watch(['./src/less/**/*.less'], ['less']);
	gulp.watch(['./src/scripts/**/*.js'], ['js']);
	gulp.watch(['./src/*.html'], ['html']);
});

// Tarayıcıyı yeniler ve son değişikliklerimizi gösterir.
gulp.task('connect', function() {
	connect.server({
		root: 'src',
		port: 8000,
		livereload: true
	});
});