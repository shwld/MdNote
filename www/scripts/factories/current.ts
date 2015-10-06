module MdNoteFactory {
	export class Current {
		isProgress: boolean;
		isStarted: boolean;
		file: MdNote.MarkdownFile;
		selectedElemId: string;
		dateFormat: string = "dd-MM-yyyy HH:mm";
		
		constructor($translate) {
			this.isProgress = true;
			this.isStarted = true;
			$translate("dateFormat").then((format) => {
				this.dateFormat = format;
			});
		}
		
		saveImage(buffer: any, type: string, callback: any) {
			var writeName = "images/" + (+new Date()) + "." + type;
			MdNote.FileSystem.mkdirpByNameSync(this.file.parentPath, writeName);
			MdNote.FileSystem.saveImage(
				this.file.parentPath + "/" + writeName,
				buffer,
				() => {
					callback(writeName);
				}, (err) => {
				}
			);
		};
	}
}

var app = angular.module("mdnote");
app.factory('mdnoteCurrent', ($translate) => {
	return new MdNoteFactory.Current($translate);
});
