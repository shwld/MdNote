module MdNote {
    export class Tree {
        elemId: string;
        prevId: string;
        nextId: string;
        firstChildId: string;
        parent: Tree;
        name: string;
        path: string;
        isFile: boolean;
        children: Tree[];
        childrenShown: boolean;
        
        constructor(dirName: string, dirPath: string, id: string) {
            this.elemId = id;
            this.parent = null;
            this.name = dirName;
            this.path = dirPath;
            this.children = [];
            this.childrenShown = false;
            this.firstChildId = this.elemId + "-0";
	    }
        
        setChildren() {
            var results = [];
            this.children = results;
            if (!this.path) { return; }
            
            var childFiles: string[] = MdNote.FileSystem.childrenSync(this.path);
            var id = 0; /*Because that would fly the id number in case you've been continue, we are making apart from the i*/
            for(var i=0;i<childFiles.length;i++) {
                if (/^\..*/.test(childFiles[i])) {
                    continue;
                }
                var childPath = this.path + MdNote.FileSystem.sep() + childFiles[i];
                var item = new Tree(childFiles[i], childPath, this.generatedId(id));
                item.prevId = this.generatedId(id-1);
                item.nextId = this.generatedId(id+1);
                item.parent = new Tree(this.path, this.name, this.elemId);
                item.isFile = true;
                item.childrenShown = false;
                
                if (MdNote.FileSystem.isDirectorySync(childPath)) {
                    item.isFile = false;
                } else if (!/^.*\.md/.test(childFiles[i])) {
                    continue;
                }
                results.push(item);
                id++;
            }
            this.children = results;
        }
        
        generatedId(num:number): string {
            return this.elemId + "-" + num.toString();
        }
        
        parentId(): string {
            return this.elemId.replace(/\-[0-9]+$/, "");
        }
        
        toggleChildren(): void {
            this.childrenShown = !this.childrenShown;
            if (this.childrenShown) {
                this.setChildren();
            }
        }
    }
}
