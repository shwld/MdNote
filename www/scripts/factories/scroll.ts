var app = angular.module("mdnote");
app.factory('mdnoteScrollViewer', ($timeout, $window) => {
    return (dest) => {
        $timeout(() => {
            var viewer = $window.document.getElementById("mdnote-viewer-wrapper");
            var viewerEnd = $window.document.getElementById("mdnote-viewer-end");
            if(dest === "top") {
                viewer.scrollTop = 0;
            } else if(dest === "bottom") {
                viewer.scrollTop = viewerEnd.offsetTop;
            }
        });
    }
});
app.factory('mdnoteScrollComment', ($timeout, $window) => {
    return () => {
        $timeout(() => {
            var viewer = $window.document.getElementById("mdnote-viewer-wrapper");
            viewer.focus();
            viewer.scrollTop = viewer.scrollHeight;
        });
    }
});
