declare function require(name:string);
module MdNote {
	export class FileSystem {
		static sep() {
			return "/";
		}
		static childrenSync(path): string[] {
			return [];
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
			callback([]);
		}
		
		static fileName(fullPath):string {
			return "example.md";
		}
		
		static dirName(fullPath):string {
			return "mdnote";
		}
		
		static readFile(path: string, callback, errCallback) {
			callback("# MdNote\n\nExample");
		}
		
		static readFileSync(path: string): string {
			return "# MdNote\n\nExample";
		}
		static writeFile(path: string, data: string, callback: any, errCallback: any) {
			callback();
		}
		
		static mkdirpByNameSync(parentPath: string, fileName: string) {
		}
		
		static getMimeType(path: string): string {
            return "";
		}
		
		static watch(path: string, callback: any) {
		}
		
		static statSync(path: string) {
			return null; 
		}
		
		static isDirectorySync(path: string): boolean {
			return false;
		}
		
		static saveImage(path: string, data: any, callback, errCallback) {
		}
		
		static search(text: string, path: string, callback: any) {
		}
	}
}
