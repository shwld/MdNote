module MdNote {
	export class SearchResult {
		name: string;
		path: string;
		constructor(_path: string) {
			this.name = MdNote.FileSystem.fileName(_path);
			this.path = _path;
		}
	}
	export class Search {
		rootPaths: string[];
		results: MdNote.SearchResult[] = [];
		text: string;
		shown: boolean = false;
		constructor(root: string, subs: string[]) {
			subs.unshift(root);
			this.rootPaths = subs;
		}
		
		grep() {
			this.results = [];
			for(var i=0;i<this.rootPaths.length;i++) {
				MdNote.FileSystem.search(this.text, this.rootPaths[i], (filePath) => {
					this.results.push(new MdNote.SearchResult(filePath));
				});
			}
			this.shown = true;
		}
		
		generateId(num: number): string {
			return "mdnote-search-result-" + num;
		}
		
		close() {
			this.text = "";
			this.shown = false;
		}
	}
}
