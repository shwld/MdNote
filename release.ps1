pushd electron;npm install;popd
gulp electron
#gulp minify
electron-packager ./build/electron MdNote --overwrite --platform=win32 --arch=x64 --version=0.31.2 --asar=true --asar=true --icon=./build/electron/assets/icon.ico
cp ./LICENSE ./MdNote-win32-x64/.
