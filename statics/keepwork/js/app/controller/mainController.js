
define([
    'helper/markdown',
], function (markdown) {
    app.registerController("mainController", ['$rootScope', '$compile','$scope', function ($rootScope, $compile, $scope) {
        app.ng_objects.$rootScope = $rootScope;
        app.ng_objects.$compile = $compile;

        // $scope.list = ["<div>{{message}}</div><input ng-model='message'>", "<div>{{message}}</div><input ng-model='message'>"];
        //
        // var newList = ["<div>{{message}}</div><input ng-model='message'>", "<div>{{message}}</div><input ng-model='message'>","<div>{{message}}</div><input ng-model='message'>"];
        //
        // setTimeout(function () {
        //     $scope.list = newList;
        //     $scope.$apply();
        // },2000);

        var md = markdown();
        $("#editor").html($compile(md.render("# test\n## test"))($scope));
        setTimeout(function () {
            $scope.$apply();
        });
    }]);
});