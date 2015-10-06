module MdNote {
	export class MarkdownFile  {
		path: string;
		name: string;
		parentPath: string;
		data: string;
		options: string;
        constructor(_path) {
			this.path = _path;
			this.setInfo();
			this.open();
        }
		
		setInfo() {
			this.name = MdNote.FileSystem.fileName(this.path);
			this.parentPath = MdNote.FileSystem.dirName(this.path);
		}
		
		static getText(path: string) {
			var result = { data: "", optionStr: null};
			try {
				var readData: string = MdNote.FileSystem.readFileSync(path);
				var separatePos: number = readData.lastIndexOf("<!--- #mdnote-options --- ");
				if (separatePos != -1) {
					result.data = readData.slice(0, separatePos);
					result.optionStr = readData.slice(separatePos).replace("<!--- #mdnote-options --- ", "").replace(" -->", "");
				} else {
					result.data = readData;
				}
			} catch (err) {
				if (err.code === "ENOENT") {
				}
			}
			return result;
		}
		
		open() {
			var text = MdNote.MarkdownFile.getText(this.path);
			this.data = text.data;
			this.options = text.optionStr;
		}
		
		static create(parentPath, name, errCallback): string {
			var fullPath = parentPath + MdNote.FileSystem.sep() + name;
			MdNote.FileSystem.mkdirpByNameSync(parentPath, name);
			MdNote.FileSystem.writeFile(fullPath, "", () => {
			}, (err) => {
				errCallback(err);
			});
			return fullPath;
		}
		
		save(callback, errCallback) {
			MdNote.FileSystem.writeFile(this.path, this.data + this.makeOptionString(), () => {
				callback();
			}, (err) => {
				errCallback(err);
			});
		}
		
		makeOptionString() {
			if (this.options) {
				return "<!--- #mdnote-options --- " + this.options + " -->";
			}
			return "";
		}
    }
}

