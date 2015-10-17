(cd electron;npm install)
gulp electron

while getopts l:d OPT
do
    case $OPT in
        l)
            case $OPTARG in
                "en")
                    cp ./electron/main-en_US.js ./build/electron/main.js
                    ;;
            esac
            ;;
        d)
            cp ./electron/main-debug.js ./build/electron/main.js
            ;;
    esac
done

#gulp minify
electron-packager ./build/electron MdNote --overwrite --platform=darwin --arch=x64 --version=0.31.2 --asar=true --icon=./build/electron/assets/icon.icns
cp ./LICENSE ./MdNote-darwin-x64/.
