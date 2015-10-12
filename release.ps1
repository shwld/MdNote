Param([switch] $d, [string] $l)

pushd electron;npm install;popd
gulp electron
switch($l){
	"en" {
		cp ./electron/main-en_US.js ./build/electron/main.js
	}
}
if($d){
	cp ./electron/main-debug.js ./build/electron/main.js
}
#gulp minify
electron-packager ./build/electron MdNote --overwrite --platform=win32 --arch=x64 --version=0.31.2 --asar=true --asar=true --icon=./build/electron/assets/icon.ico
cp ./LICENSE ./MdNote-win32-x64/.
