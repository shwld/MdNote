module MdNote {
    export class CreateFileDialogController {
        public mdDialog: any;
        constructor($scope, $mdDialog, node) {
            $scope.node = node;
            $scope.cancel = () => {
                $mdDialog.cancel();
            }
            $scope.create = () => {
                if ($scope.fileName) {
                    if (!/^.*[ \.:\*\?"<>\|;'\^\~].*$/.test($scope.fileName)) {
                        var result = { parentPath: $scope.node.path, name: $scope.fileName + ".md" };
                        $mdDialog.hide(result);
                        return true;
                    }
                }
                return false;
            }
            
            /* HACK:Dialog would close in validation error when Enter key is pressed */
            $scope.onKeyDown = (e) => {
                switch (e.which) {
                    case (13): /*enter*/
                        return $scope.create();
                } 
            };
        }
    }
}
var app = angular.module("mdnote");
app.controller("MdNote.CreateFileDialogController", MdNote.CreateFileDialogController);

