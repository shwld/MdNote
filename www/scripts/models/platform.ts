declare function require(name:string);
module MdNote {
	export class Platform {
		static onOpenWithFile(callback: any) {
		}
		
		static openExternal(url: string) {
			var elem = document.createElement("a");
			elem.href = url;
			elem.setAttribute("target", "_blank");
    		elem.click();
		}
		
		static showViewer() {
		}
	}
}

