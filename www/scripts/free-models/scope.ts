module MdNote {
    export interface IMdNoteScope {
        settings: MdNoteFactory.Settings;
        editor: MdNoteFactory.Editor;
        current: MdNoteFactory.Current;
        navigation: MdNoteFactory.Navigation;
        explorer: MdNoteFactory.Explorer;
        window: MdNoteFactory.Window;
        
        init: any;
        doOpen: any;
        reloadFile: any;
        isChanged: any;
        isEdited: any;
        isImageLoaded: boolean;
        showConfirmDialog: any;
        showConfirmDialogWithTranslate: any;
        updateViewer: any;
        codemirrorLoaded: any;
        dropFile: any;
        openFile: any;
        showSelectedFile: any;
        setFocusElemId: any;
        updateViewerWithImages: any;
        updating: any;
        saveFile: any;
        showToast: any;
        showToastWithTranslate: any;
        showCreateFileDialog: any;
        toggleExplorer: any;
        setRootDir: any;
        showSettings: any;
        onWatchAction: any;
        onGlobalKeyDown: any;
        
        
    }
}