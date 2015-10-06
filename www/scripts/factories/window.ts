declare function require(name:string);
module MdNoteFactory {
	export class Window {
		constructor() {
			/* It does not transition to another page in the drop */			
			document.body.addEventListener('dragover', function(e){
				e.preventDefault();
				e.stopPropagation();
			}, false);
				document.body.addEventListener('drop', function(e){
				e.preventDefault();
				e.stopPropagation();
			}, false);
			
  			/* window size restoration */
			var width = localStorage.getItem("windowWidth");
			var height = localStorage.getItem("windowHeight");
			var x = localStorage.getItem("windowX");
			var y = localStorage.getItem("windowY");
			if (width && height) {
				resizeTo(width, height);
			}
			if (x && y) {
				moveTo(x, y);
			}
		}
		
		onClose(callback: any) {
			window.onbeforeunload = (event) => {
				localStorage.setItem("windowWidth", window.outerWidth.toString());
				localStorage.setItem("windowHeight", window.outerHeight.toString());
				localStorage.setItem("windowX", window.screenLeft.toString());
				localStorage.setItem("windowY", window.screenTop.toString());
				return callback();
			};
		}
		
		close(isForce: boolean = true) {
			if ( isForce ) {
				window.onbeforeunload = (event) => {};
			}
			window.close();
		}
	}
}
var app = angular.module("mdnote");
app.factory('mdnoteWindow', () => {
	return new MdNoteFactory.Window();
});
