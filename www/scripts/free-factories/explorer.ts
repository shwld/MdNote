module MdNoteFactory {
	export class Explorer {
		isShow: boolean;
		rootDir: MdNote.RootDirectory;
		subDirs: MdNote.SubDirectories;
		search: MdNote.Search;
		focus: any;
		focusEditor: any;
		mdDialog: any;
		
		constructor(mdnoteFocus, mdnoteFocusEditor, $mdDialog) {
			this.isShow = true;
			this.focus = mdnoteFocus;
			this.focusEditor = mdnoteFocusEditor;
			this.mdDialog = $mdDialog;
		}
		
		init() {
			this.rootDir = new MdNote.RootDirectory();
			this.subDirs = new MdNote.SubDirectories("mdnote-tree");
			
			if (this.rootDir.isSelected()) {
				this.rootDir.tree = new MdNote.Tree(this.rootDir.name, this.rootDir.path, "mdnote-tree");
				if (this.subDirs.dirs[0] && this.subDirs.dirs[0].tree) {
					this.rootDir.tree.nextId = this.subDirs.dirs[0].tree.elemId;
				}
				this.search = new MdNote.Search(this.rootDir.path, this.subDirs.dirs.map((v) => {return v.path}));
			} else {
				this.isShow = true;
			}
		}
		
		keyupOnTree (event: KeyboardEvent, node: MdNote.Tree, createDialog: any) {
			switch (event.keyCode) {
				case (38): /*Up*/
					this.focus(node.prevId);
					break;
				case (40): /*Down*/
					this.focus(node.nextId);
					break;
				case (37): /*Left*/
					if (node.isFile || !node.childrenShown) {
						this.focus(node.parentId());
					} else {
						node.childrenShown = false;
					}
					break;
				case (39): /*Right*/
					if (node.isFile) {
						this.close();
					} else {
						if (!node.childrenShown) {
							node.toggleChildren();
						}
						this.focus(node.firstChildId);
					}
					break;
				case (13): /*Enter*/
					if (node.isFile) {
						this.close();
					} else {
						if (!node.childrenShown) {
							node.toggleChildren();
						}
						this.focus(node.firstChildId);
					}
					break;
				case (65): /*a*/
					if (!node.isFile)
						createDialog(node, event)
					break;
			}
		}
		
		focusSearchResult (event: KeyboardEvent) {
			this.focus(this.search.generateId(0));
		};

		keyupOnSearch (event: KeyboardEvent) {
			switch (event.keyCode) {
				case (13): /*Enter*/
					this.search.grep();
					this.focus("mdnote-search-start");
					break;
				case (27): /*Esc*/
					this.search.close();
					break;
			}
		};
		
		keyupOnSearchResult (event: KeyboardEvent, result: MdNote.SearchResult, index: number) {
			switch (event.keyCode) {
				case (38): /*Up*/
					this.focus(this.search.generateId(index-1));
					break;
				case (40): /*Down*/
					this.focus(this.search.generateId(index+1));
					break;
				case (32): /*Space*/
					this.focus(this.search.generateId(index+1));
					break;
				case (39): /*Right*/
					this.close();
					break;
				case (13): /*Enter*/
					this.close();
					break;
				case (27): /*Esc*/
					this.search.close();
					break;
			}
		};
		
		close() {
			this.isShow = false;
			this.focusEditor();
		}
		
		
	}
}

var app = angular.module("mdnote");
app.factory('mdnoteExplorer', (mdnoteFocus, mdnoteFocusEditor, $mdDialog) => {
	return new MdNoteFactory.Explorer(mdnoteFocus, mdnoteFocusEditor, $mdDialog);
});
