module MdNoteFactory {
	export class Settings {
		constructor() {
			if (!this.editorType) {
				this.editorType = "default";
			}
		}
		
		get editorType():string {
			return localStorage.getItem("editorType");
		}
		set editorType(value:string) {
			localStorage.setItem("editorType", value);
		}
		
	}
}
var app = angular.module("mdnote");
app.factory('mdnoteSettings', () => {
	return new MdNoteFactory.Settings();
});
