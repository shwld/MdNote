module MdNote {
    export class ConfirmDialogController {
        public mdDialog: any;
        constructor($scope, $mdDialog, title) {
            $scope.title = title;
            $scope.ok = () => {
                $mdDialog.hide(true);
            }
            $scope.cancel = () => {
                $mdDialog.cancel();
            }
        }
    }
}
var app = angular.module("mdnote");
app.controller("MdNote.ConfirmDialogController", MdNote.ConfirmDialogController);
