(cd electron;npm install)
gulp electron
#gulp minify
electron-packager ./build/electron MdNote --overwrite --platform=darwin --arch=x64 --version=0.31.2 --asar=true --icon=./build/electron/assets/icon.icns
cp ./LICENSE ./MdNote-win32-x64/.
