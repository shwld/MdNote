module MdNoteFactory {
	export class Navigation {
		saveNav = {};
		publishNav = {};
		settingsNav = {};
		previewNav = {};
	}
}
var app = angular.module("mdnote");
app.factory('mdnoteNavigation', () => {
	return new MdNoteFactory.Navigation();
});
