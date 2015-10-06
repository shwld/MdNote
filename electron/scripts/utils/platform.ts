declare var __dirname;
declare function require(name:string);
declare var process;
module MdNote {
	export class Platform {
		static onOpenWithFile(callback: any) {
		}
		
		static openExternal(url: string) {
			var shell = require('shell');
  			shell.openExternal(url);
		}
		
		static showViewer() {
			var ipc = require('ipc');
			ipc.send("show-viewer");
		}
	}
}

