module MdNote {
    export class MainController {
        constructor($scope: MdNote.IMdNoteScope, $timeout, $mdBottomSheet, $mdToast,
                    $interval, $mdDialog, $translate, marked, 
                    mdnoteFocus, mdnoteFocusEditor, mdnoteScrollViewer, mdnoteScrollComment, mdnoteWindow, mdnoteSettings, mdnoteNavigation,
                    mdnoteExplorer, mdnoteEditor, mdnoteCurrent) {
            
            $scope.window = mdnoteWindow;
            $scope.settings = mdnoteSettings;
            $scope.navigation = mdnoteNavigation;
            $scope.explorer = mdnoteExplorer;
            $scope.current = mdnoteCurrent;
            $scope.editor = mdnoteEditor;
            
            function init() {
                $scope.explorer.init();
                
                if ($scope.explorer.rootDir.isSelected()) {
                    /* dialy open */
                    if (!$scope.current.file) {
                        $scope.doOpen($scope.explorer.rootDir.diaryPath, true);
                    }
            
                    /* root dir watch */
                    MdNote.FileSystem.watch($scope.explorer.rootDir.path, (action, filePath) => {
                        if (action == "change" || action == "add") {
                            $scope.onWatchAction(filePath);
                        }
                    });
                    
                    /* sub dirs watch */
                    for (var i=0;i<$scope.explorer.subDirs.dirs.length;i++) {
                        MdNote.FileSystem.watch($scope.explorer.subDirs.dirs[i].path, (action, filePath) => {
				            if (action == "change" || action == "add") {
                                $scope.onWatchAction(filePath);
                            }
                        });
                    }
                    $scope.updateViewer();
                    $scope.updateViewerWithImages();
                } else {
                    $translate('main.welcome_message').then((message) => {
                        $scope.editor.markdown = message;
                        $scope.editor.setViewer(marked($scope.editor.markdown));
                    });
                }
                
                $scope.current.isProgress = false;
                $scope.current.isStarted = true;
            }
            
            $scope.onWatchAction = (filePath) => {
                if (!MdNote.FileSystem.isMarkdownFile(filePath)) {
                    return;
                }
                
                /* current file update */
                if (filePath === $scope.current.file.path) {
                    if (!$scope.isChanged()) {
                        $scope.reloadFile(filePath);
                    } else {
                        $scope.showConfirmDialogWithTranslate('main.external_updated', () => {
                            $scope.reloadFile(filePath);
                        }, () => {});
                    }
                }
            };
            
            $scope.dropFile = (doc, e) => {
                $scope.editor.dropFile(e, (imageFile) => {
                    $scope.current.saveImage(imageFile, "png", (writeName) => {
                        doc.replaceSelection("![](" + writeName + " )");
                    });
                }, (filePath) => {
                    $scope.openFile(filePath);
                });
            };
            
            $scope.updateViewer = () => {
                if ($scope.isEdited()) {
                    $scope.editor.setViewer(marked($scope.editor.markdown));
                }
            };
            
            $scope.isImageLoaded = false;
            $scope.updateViewerWithImages = () => {
                if ($scope.editor.markdown) {
                    $scope.current.isProgress = true;
                    $scope.editor.withImages(marked($scope.editor.markdown), (resultHtml) => {
                        $scope.current.isProgress = false;
                        if (!resultHtml) { return; }
                        $scope.isImageLoaded = true;
                        $timeout(() => {
                            $scope.editor.setViewer(resultHtml);
                        });
                    });
                }
            };
            
            $scope.updating = $interval(() => {
                if (!$scope.isImageLoaded) {
                    $scope.updateViewerWithImages();
                }
            }, 10000);
            
            $scope.saveFile = () => {
                if ($scope.current.file) {
                    $scope.current.isProgress = true;
                    $scope.current.file.data = $scope.editor.markdown;
                    $scope.current.file.save(() => {
                        $scope.current.isProgress = false;
                        $scope.updateViewerWithImages();
                        $scope.showToastWithTranslate("toast.saved");
                    }, (errMessage) => {
                        $scope.current.isProgress = false;
                    } );
                }
            };
            
            var tmpValue = $scope.editor.markdown;
            $scope.isEdited = () => {
                if (!$scope.current.file) { return false; }
                if (tmpValue !== $scope.editor.markdown) {
                    tmpValue = $scope.editor.markdown;
                    $scope.isImageLoaded = false;
                    return true;
                }
                return false;
            };
            
            $scope.isChanged = () => {
                if (!$scope.current.file) { return false; }
                return $scope.current.file.data !== $scope.editor.markdown;
            };
            
            $scope.showCreateFileDialog = (node: MdNote.Tree, event: Event) => {
                $mdDialog.show({
                    controller: MdNote.CreateFileDialogController,
                    templateUrl: 'views/create-file-dialog-template.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    locals: { node: node },
                    onComplete: () => {
                        mdnoteFocus("mdnote-new-filename");
                    },
                }).then((pathData) => {
                    var fullPath = MdNote.MarkdownFile.create(pathData.parentPath, pathData.name, (err) => {$scope.showToast(err);} );
                    $scope.openFile(fullPath);
                    $scope.showToastWithTranslate("main.welcome");
                }, () => {
                    mdnoteFocus($scope.current.selectedElemId);
                });
            };
            
            $scope.showConfirmDialog = (title: string, callback, cancelCallback) => {
                $mdDialog.show({
                    controller: MdNote.ConfirmDialogController,
                    templateUrl: 'views/confirm-dialog-template.html',
                    parent: angular.element(document.body),
                    locals: { title: title },
                }).then((result: boolean) => {
                    if (result) {
                        callback();
                    } else {
                        cancelCallback();
                    }
                }, () => {
                    mdnoteFocus("mdnote-viewer-wrapper");
                });
            };
            
            $scope.showConfirmDialogWithTranslate = (messageId: string, callback, cancelCallback) => {
                $translate(messageId).then((message) => {
                $scope.showConfirmDialog(message, callback, cancelCallback);
                });
            };
            
            $scope.showToast = (message: string) => {
              $scope.current.isProgress = false;
              $mdToast.show(
                $mdToast.simple()
                  .content(message)
                  .position("top right")
                  .hideDelay(700)
              );
            };
            
            $scope.showToastWithTranslate = (messageId: string) => {
                $translate(messageId).then((message) => {
                    $scope.showToast(message);
                });
            };

            $scope.toggleExplorer = (focusId: string = "") => {
                $scope.explorer.isShow = !$scope.explorer.isShow;
                if ($scope.explorer.isShow) {
                    var target = focusId;
                    if (target == "" && $scope.explorer.rootDir.isSelected()) {
                        target = $scope.current.selectedElemId?$scope.current.selectedElemId:$scope.explorer.rootDir.tree.elemId;
                    }
                    mdnoteFocus(target);
                } else {
                    mdnoteFocusEditor();
                }
            };
            
            $scope.window.onClose(() => {
                if ($scope.isChanged()) {
                    $scope.showConfirmDialogWithTranslate("main.closeOnEditing", () => {
                        $scope.window.close(true);
                    }, () => { });
                } else {
                    return null;
                }
                return false;
            });
            
            $scope.openFile = (_path, withEdit: boolean = true) => {
                if (!$scope.isChanged()) {
                    $scope.doOpen(_path, withEdit);
                } else {
                    $scope.showConfirmDialogWithTranslate("main.openOnEditing", () => {
                        $scope.doOpen(_path, withEdit);
                    }, () => {});
                }
            };
            
            $scope.reloadFile = (_path: string) => {
                $scope.current.isProgress = true;
                $scope.current.file = new MdNote.MarkdownFile(_path);
                if ($scope.editor.markdown !== $scope.current.file.data) {
                    $scope.editor.markdown = $scope.current.file.data;
                    $scope.updateViewer();
                    $scope.updateViewerWithImages();
                }
                $scope.current.isProgress = false;
            };
            
            $scope.setFocusElemId = (elemId: string) => {
                $scope.current.selectedElemId = elemId;
            };
            
            $scope.showSelectedFile = (treeItem: MdNote.Tree, withEdit: boolean = true) => {
                if (treeItem.isFile) {
                    $scope.openFile(treeItem.path, withEdit);
                }
            };
            
            $scope.setRootDir = ($file) => {
                if ($file) {
                    $scope.explorer.rootDir.save($file);
                    init();
                }
            };
            
            $scope.showSettings = ($event: Event) => {
                if ($scope.isChanged()) {
                    $scope.showConfirmDialogWithTranslate("main.before_settings", ()=>{}, ()=>{});
                    return;
                }
                $mdBottomSheet.show({
                    templateUrl: 'views/settings-template.html',
                    controller: 'MdNote.SettingsController as setting',
                    targetEvent: $event,
                    locals: { parentScope: $scope },
                }).then(() => {
                    init();
                }, () => {
                });
            };
            
            /* hotkeys */
            $scope.onGlobalKeyDown = (event: KeyboardEvent) => {
                /* ctrl or cmd */
                if (((event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey))) {
                    switch (event.keyCode) {
                        case (83): /*s*/
                            $scope.saveFile();
                            break;
                        case (70): /*f*/
                            $scope.explorer.isShow = true;
                            mdnoteFocus("mdnote-search-box");
                            break;
                        case (60): /*e*/
                            $scope.toggleExplorer();
                            break;
                        case (48): /*0*/
                            $scope.toggleExplorer();
                            break;
                        case (73): /*i*/
                            if (!$scope.explorer.isShow) {
                                mdnoteFocusEditor();
                            }
                            break;
                        case (79): /*o*/
                            mdnoteFocus("mdnote-viewer-wrapper");
                            break;
                        case (81): /*q*/
                            $scope.window.close(false);
                            break;
                    } 
                }
            };
            
            $scope.codemirrorLoaded = (_editor: any) => {
                var _doc = _editor.getDoc();
                
                $scope.doOpen = (_path: string, withEdit: boolean) => {
                    $scope.current.isProgress = true;
                    $scope.current.file = new MdNote.MarkdownFile(_path);
                    $scope.editor.markdown = $scope.current.file.data;
                    $scope.editor.basePath = $scope.current.file.parentPath;
                    _doc.clearHistory();
                    $scope.isImageLoaded = false;
                    $scope.updateViewer();
                    $scope.current.isProgress = false;
                    $scope.updateViewerWithImages();
                    if (withEdit) {
                        $scope.explorer.isShow = false;
                        mdnoteFocusEditor();
                    }
                };
                
                init();
                
                if ($scope.explorer.rootDir.isSelected()) {
                    _editor.focus();
                }
                _doc.markClean();
                
                _editor.on("drop", (__doc, e) => {
                    $scope.dropFile(__doc, e);
                });
                _editor.on("keydown", (__doc, event) => {
                    $scope.updateViewer();
                    if (event.keyCode == 86 && ((event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey))) {
                        var clipboard = new MdNote.Clipboard();
                        if (clipboard.hasImage()) {
                            $scope.current.saveImage(clipboard.getPngImage(), "png", (writeName) => {
                                __doc.replaceSelection("![](" + writeName + " )");
                                $scope.updateViewerWithImages();
                            });
                        }
                    }
                    var currentLineNumber = __doc.getCursor().line;
                    if (currentLineNumber < 6) {
                        mdnoteScrollViewer("top");
                    }
                    if (currentLineNumber > (__doc.lastLine() - 6)) {
                        mdnoteScrollViewer("bottom");
                    }
                });
                
                _editor.save = () => {
                    $scope.saveFile();
                };
                         
                /* HACK:Mac only! for chokidar is not available */
                if (navigator.platform.indexOf("Win") == -1) {       
                    if ($scope.explorer.rootDir.isSelected()) {
                        MdNote.FileSystem.recursive($scope.explorer.rootDir.path, (filePath: string) => {
                            $scope.onWatchAction(filePath);
                        });
                    }
                }
            };
            
            
            
            
        }
    }
}
var app = angular.module("mdnote");
app.controller("MdNote.MainController", MdNote.MainController);
