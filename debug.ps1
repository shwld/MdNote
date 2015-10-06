pushd electron;npm install;popd
gulp www
gulp electron
cp electron/main-debug.js build/electron/main.js
electron build/electron/.
