(cd electron;npm install)
gulp www
gulp electron
#gulp minify
cp electron/main-debug.js build/electron/main.js
electron build/electron/.
