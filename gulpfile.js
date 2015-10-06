var gulp = require("gulp");
var ts = require("gulp-typescript");
var uglify = require('gulp-uglify');
var winInstaller = require('electron-windows-installer');

gulp.task('electron', function() {
    /* copy www src */
    gulp.src(
        [ 'www/*.html', 'www/views/*.html', 'www/css/*.css', 'www/vendor/**', 'www/assets/**', 'www/locales/**' ],
        { base: 'www' }
    ).pipe( gulp.dest("./build/electron") );
    
    gulp.src(
        [ 'electron/node_modules/**', 'electron/main.js', 'electron/package.json' ],
        { base: 'electron' }
    ).pipe( gulp.dest("./build/electron") );
    
    var build_dir = "./build/electron";
    
    /* compile nodejs typescript */
    var tsProject;
    tsProject = ts.createProject("nodejs/scripts/tsconfig.json");
    tsProject.src().pipe(ts(tsProject)).js.pipe(gulp.dest(build_dir));
    
    /* compile electron typescript */
    tsProject = ts.createProject("electron/scripts/tsconfig.json");
    tsProject.src().pipe(ts(tsProject)).js.pipe(gulp.dest(build_dir));
    
    /* compile www typescript */
    tsProject = ts.createProject("www/scripts/tsconfig.json");
    tsProject.src().pipe(ts(tsProject)).js.pipe(gulp.dest(build_dir));
    
    return;
} );

gulp.task('www', function() {
    var build_dir = "./www";
    
    /* compile nodejs typescript */
    var tsProject;
    tsProject = ts.createProject("www/scripts/tsconfig.json");
    tsProject.src().pipe(ts(tsProject)).js.pipe(gulp.dest(build_dir));
});

gulp.task('minify', function() {
    gulp.src('./build/electron/scripts/appBundle.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/electron/scripts'));
    gulp.src('./build/electron/scripts/solutionOverrides.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/electron/scripts'));
    gulp.src('./build/electron/scripts/platformOverrides.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/electron/scripts'));
    gulp.src('./build/electron/scripts/viewerBundle.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/electron/scripts'));
});

gulp.task('create_windows_installer', function(done) {
  winInstaller({
    appDirectory: './MdNote-win32-x64',
    outputDirectory: './windows_installer',
    iconUrl: 'file://' + __dirname + + 'assets/icon.png'
  }).then(done).catch(done);
});
