var app = angular.module("mdnote");
app.factory('mdnoteFocus', ($timeout, $window) => {
    return (id) => {
        $timeout(() => {
            var element = $window.document.getElementById(id);
            if(element)
                element.focus();
        });
    };
});
app.factory('mdnoteFocusEditor', ($timeout, $window) => {
    return () => {
        $timeout(() => {
            var editor = $window.document.getElementById("mdnote-editor");
            var elements = editor.getElementsByTagName("textarea");
            if(elements[0])
                elements[0].focus();
        });
    }
});
