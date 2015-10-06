module MdNote {
    export class SettingsController {
        public timeout: any;
        public mdBottomSheet: any;
        public parent: MdNote.IMdNoteScope;
        public explorer: MdNoteFactory.Explorer;
        public data: MdNoteFactory.Settings;
        constructor($timeout, $mdBottomSheet, mdnoteExplorer, mdnoteSettings, parentScope: MdNote.IMdNoteScope) {
            this.parent = parentScope;
            this.timeout = $timeout;
            this.mdBottomSheet = $mdBottomSheet;
            this.explorer = mdnoteExplorer;
            this.data = mdnoteSettings;
        }
        
        closeSettings($event) {
            this.mdBottomSheet.hide();
        }
        
        setRootDir($file) {
            if ($file) {
                this.explorer.rootDir.save($file);
            }
        }
        
        setSubDir($file) {
            if ($file) {
                this.explorer.subDirs.insert($file);
            }
        }
        
        removeSubDir(index) {
            this.parent.showConfirmDialogWithTranslate("settings.confirm.delete",
                () => {
                    this.explorer.subDirs.remove(index);
                }, () => {});
        }
        
    }
}
var app = angular.module("mdnote");
app.controller("MdNote.SettingsController", MdNote.SettingsController);
