module MdNoteFactory {
    export class Editor {
        html: string;
        markdown: string;
        sce: any;
        sanitize: any;
        
        basePath: string;
	    codemirrorOptions = {
            lineWrapping: false,
            lineNumbers: true,
            indentUnit: 2,
            keyMap: "default",
            showCursorWhenSelecting: true,
        };
		
        constructor($sce, $sanitize, mdnoteSettings) {
            this.codemirrorOptions.keyMap = mdnoteSettings.editorType;
            this.sce = $sce;
            this.sanitize = $sanitize;
        }
        
        convert(html: any) {
            var newDiv = document.createElement("div");
            newDiv.innerHTML = html;
            
            var links = newDiv.getElementsByTagName("a");
            for (var i=0;i<links.length;i++) {
                links[i].setAttribute("onclick", "MdNote.Platform.openExternal('" + links[i].href + "');return false;");
            }
            
            return newDiv.innerHTML;
        }
        
        withImages(html, callback) {
            if (!this.basePath) { callback(false);return; }
            var newDiv = document.createElement("div");
            newDiv.innerHTML = html;
            
            var promises = [];
            var imgs = newDiv.getElementsByTagName("img");
            if (imgs.length == 0) {
                callback(false);return;
            }
            
            for (var i=0; i < imgs.length; i++) {
                promises.push(this.imageAsync(imgs[i]));
            }
            Promise.all(promises).then((results) => {
                callback(newDiv.innerHTML);
            }).catch((err) => {
                callback(false);return;
            });
        }
        
        imageAsync(element) {
            var imagesrc = this.basePath + MdNote.FileSystem.sep() + element.getAttribute("src");
            var mimeType = MdNote.FileSystem.getMimeType(imagesrc);
            return new Promise((resolve, reject) => {
                MdNote.FileSystem.readFile(imagesrc, (data) => {
                    var url = "data:" + mimeType + ";base64, " + data.toString("base64");
				    element.setAttribute("src", url);
				    resolve(element);
                }, (err) => {
                    reject(err);
                });
            });
        }
        
        dropFile(event, imageCallback: any, textCallback: any) {
            var reader = new FileReader();
            var files = event.dataTransfer.files;
            if (files.length != 0) {
                event.stopPropagation();
                event.preventDefault();
            }
            for (var i=0, file; file=files[i]; i++) {
                if (file.type.match(/image.*/)) {
                    var type = file.type.split("/").pop();
                    reader.readAsBinaryString(file);
                    reader.onload = (e: any) => {
                        imageCallback(e.target.result);
                    };
                }
                if (file.type.match(/text.*/)) {
                    textCallback(file.path);
                }
            }
        }
        
        setViewer(html: any) {
            this.html = this.sce.trustAsHtml(this.convert(this.sanitize(html)));
        };
    }
}

var app = angular.module("mdnote");
app.factory('mdnoteEditor', ($sce, $sanitize, mdnoteSettings) => {
	return new MdNoteFactory.Editor($sce, $sanitize, mdnoteSettings);
});