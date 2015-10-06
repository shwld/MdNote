module MdNote {
	export class RootDirectory {
		name: string;
		path: string;
		diaryPath: string;
		tree: MdNote.Tree;
		
		constructor() {
			this.load();
		}
		
		load() {
			var data = localStorage.getItem("rootDir");
			if (data) {
				var jsonData = JSON.parse(data);
				this.name = jsonData.name;
				this.path = jsonData.path;
				
				var now = new Date();
				var formattedDate = now.getFullYear() + ("0"+(now.getMonth()+1)).slice(-2) + ("0"+now.getDate()).slice(-2);
				var diaryName = "diaries" + MdNote.FileSystem.sep() + formattedDate + ".md";
				this.diaryPath = this.path + MdNote.FileSystem.sep() + diaryName;
				MdNote.FileSystem.mkdirpByNameSync(this.path, diaryName);
			}
		}
		
		isSelected(): boolean {
			return (this.path)? true : false;
		}
		
		save($file) {
			if (!$file) return;
            var data = {
                name: $file.name,
                path: $file.path
            };
			this.name = data.name;
			this.path = data.path;
            localStorage.setItem("rootDir", JSON.stringify(data));
		}
	}
}
