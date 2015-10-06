declare function require(name:string);
declare function Buffer(object:any, code:string);
module MdNote {
	export class FileSystem {
		static sep() {
			var path = require('path');
			return path.sep;
		}
		static childrenSync(path): string[] {
            var fs = require('fs');
			try {
				return fs.readdirSync(path);	
			} catch (err) {
				return [];
			}
		}
		
		static isMarkdownFile(path): boolean {
			if (/^.*\.md$/.test(path)) {
				return true;
			}
			return false;
		}
		
		static recursive(path, callback) {
			MdNote.FileSystem.children(path, (files: string[]) => {
				for (var i=0;i<files.length;i++) {
					var filePath = path + MdNote.FileSystem.sep() + files[i];
					if (MdNote.FileSystem.isDirectorySync(filePath)) {
						MdNote.FileSystem.recursive(filePath, callback);
					} else {
						callback(filePath);
					}
				}
			});
		}
		
		static children(path, callback, errCallback = undefined) {
            var fs = require('fs');
			fs.readdir(path, (err, files) => {
				if (err) {
					if (errCallback) { errCallback(err); }
				} else {
					callback(files);
				}
			});
		}
		
		static fileName(fullPath):string {
			var path = require('path');
			return path.basename(fullPath);
		}
		
		static dirName(fullPath):string {
			var path = require('path');
			return path.dirname(fullPath);
		}
		
		static readFile(path: string, callback, errCallback) {
            var fs = require('fs');
			fs.readFile(path, function(err, data){
				if (err) {
					errCallback(err);
					return;
				}
				callback(data);
			});
		}
		
		static readFileSync(path: string): string {
            var fs = require('fs');
            return fs.readFileSync(path, "utf8");
		}
		
		static writeFile(path: string, data: string, callback: any, errCallback: any) {
            var fs = require('fs');
			fs.writeFile(path, data, function (err) {
				if (err) {
					errCallback(err);
				}
				callback();
			});
		}
		
		/* It automatically generates up to the parent folder of the name that was passed as fileName */
		static mkdirpByNameSync(parentPath: string, fileName: string) {
			var pathModule = require('path');
			var fs = require('fs');
			var parts = fileName.split(/\/|\\/);
			for( var i=1; i < parts.length; i++ ) {
				try {
					fs.mkdirSync( parentPath + pathModule.sep + pathModule.join.apply(null, parts.slice(0, i)) );	
				} catch (err) {
					if (err.code != "EEXIST") {
						throw err;
					}
				}
			}
		}
		
		static getMimeType(path: string): string {
            var mime = require('mime');
            return mime.lookup(path);
		}
		
		static watch(path: string, callback: any) {
			if (navigator.platform.indexOf("Win") != -1) {
				/* HACK:chokidar does not work on Mac OSX */
				var chokidar = require('chokidar')
				var watcher = chokidar.watch(path, {
					ignored: /[\/\\]\./,
					persistent:true
				});
				watcher.on('ready', () => {
				}).on('all', (action, file) => {
					callback(action, file);
				}).on('error', (error) => {
				});
			} else {
				/* HACK:fs.watch does not work on Windows */
				var fs = require('fs');
				fs.watch(path, { recursive: true }, (event, filePath) => {
					var fullPath = path + MdNote.FileSystem.sep() + Buffer(filePath, 'binary').toString();
					fs.open(fullPath, 'r', (err, fd) => {
						if (err) {
							if (err.code === 'ENOENT') {
								callback("delete", fullPath);
							}
							return;
						}
						callback("change", fullPath);
					});
				});
			}
		}
		
		static statSync(path: string) {
            var fs = require('fs');
			return fs.statSync(path); 
		}
		
		static isDirectorySync(path: string): boolean {
            var fs = require('fs');
			var stat = fs.statSync(path);
			return stat.isDirectory(); 
		}
		
		static saveImage(path: string, data: any, callback, errCallback) {
			var fs = require('fs');
			var writeStream = fs.createWriteStream(path);
			writeStream.on('drain', () => {	
				}).on('error', (err) => {
					errCallback(err);
				}) .on('close', () => {
					callback();
				}).on('pipe', (src) => {
				});
			writeStream.write(data,'binary');
			writeStream.end();
		}
		
		static search(text: string, path: string, callback: any) {
            var fs = require('fs');
			try {
				var files = fs.readdirSync(path);
				for(var i=0;i<files.length;i++) {
					var filePath = path + MdNote.FileSystem.sep() + files[i];
					var stat = fs.statSync(filePath);
					if (stat.isDirectory()) {
						MdNote.FileSystem.search(text, filePath, callback);
					} else if (/^.*\.md$/.test(filePath)) {
						var data = fs.readFileSync(filePath, 'utf8');
						if (data.toString().indexOf(text) != -1) {
							callback(filePath);
						}
					}
				}
			} catch(err) {
			}
		}
	}
}
