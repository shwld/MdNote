module MdNote {
	export class SubDirectory {
		name: string;
		path: string;
		tree: MdNote.Tree;
		constructor(name: string, path: string, no: number, rootErmId: string) {
			this.name = name;
			this.path = path;
			this.tree = new MdNote.Tree(name, path, "mdnote-subdir-" + no);
			this.tree.prevId = (no-1<0) ? rootErmId : "mdnote-subdir-" + (no-1);
			this.tree.nextId = "mdnote-subdir-" + (no+1);
		}
	}
	export class SubDirectories {
		dirs: MdNote.SubDirectory[];
		rootErmId: string;
		
		constructor(_rootElemId: string) {
			this.rootErmId = _rootElemId;
			this.load();
		}
		
		load() {
			this.dirs = this.subDirsInStorage;
		}
		
		insert($file) {
			if (!$file) return;
			var dir = new SubDirectory($file.name, $file.path, this.dirs.length, this.rootErmId);
			this.dirs.push(dir);
			this.subDirsInStorage = this.dirs;
		}
		
		remove(index: number) {
			this.dirs.splice(index, 1);
			this.subDirsInStorage = this.dirs;
		}
		
		set subDirsInStorage(dirs: MdNote.SubDirectory[]) {
			var value = dirs.map((x) => {
				return { name: x.name, path: x.path };
			});
			localStorage.setItem("subDirs", JSON.stringify(value));
		}
		
		get subDirsInStorage(): MdNote.SubDirectory[] {
			var value = JSON.parse(localStorage.getItem("subDirs"));
			if (value && value.length > 0) {
				var result = value.map((x, index) => {
					return new MdNote.SubDirectory(x.name, x.path, index, this.rootErmId);
				});
				return result;
			}
			return [];
		}
	}
}
