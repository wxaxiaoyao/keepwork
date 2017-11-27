
define([
], function () {
    app.registerController("mainController", ['$rootScope', '$compile','$scope', function ($rootScope, $compile, $scope) {
        app.ng_objects.$rootScope = $rootScope;
        app.ng_objects.$compile = $compile;

        $scope.list = ["<div>{{message}}</div><input ng-model='message'>", "<div>{{message}}</div><input ng-model='message'>"];
    }]);
});