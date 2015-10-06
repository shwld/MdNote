declare function require(name:string);
module MdNote {
	export class Clipboard {
		image: any;
		constructor() {
			var clipboard = require('clipboard');
			this.image = clipboard.readImage();
		}
		
		hasImage():boolean {
			return !this.image.isEmpty();
		}
		getPngImage() {
			return this.image.toPng();
		}
	}
}
