declare var hljs: any;
var app = angular.module("mdnote");
app.config(['markedProvider', (markedProvider) => {
    markedProvider.setOptions({
        gfm: true,
        tables: true,
        highlight: (code) => {
            return hljs.highlightAuto(code).value.replace(/\r?\n/g, "<br />").replace(/  |\t/g, "&nbsp;&nbsp;");
        }
    });
}]);

app.config(['$translateProvider', ($translateProvider) => {
    $translateProvider.useStaticFilesLoader({
        prefix: 'locales/lang-',
        suffix: '.json'
    });
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    /* HACK:it is not possible to correctly get the locale on OSX */
    /*$translateProvider.determinePreferredLanguage();*/
    $translateProvider.preferredLanguage('ja');
    $translateProvider.fallbackLanguage('en');
}]);
