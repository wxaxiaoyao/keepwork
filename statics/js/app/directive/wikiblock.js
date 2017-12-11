
define([
], function () {
    // 注册一个扩展html指令
    // app.registerDirective("kpHtml", ['$compile', function ($compile) {
    //     return {
    //         controller: function ($scope) {
    //             $scope.name1 = "test";
    //             console.log($scope);
    //         },
    //         link: function ($scope, $element, $attrs) {
    //             $scope.$watch(function ($scope) {
    //                 console.log($scope);
    //                 return $scope.$eval($attrs.kpHtml);
    //             }, function (newVal) {
    //                 $element.html(newVal);
    //                 $compile($element.contents())($scope);
    //             });
    //         }
    //     };
    // }]);


    // app.registerComponent("wikiBlock", {
    //     template: '<div kp-html="content"></div>',
    //     // transclude: 'true',
    //     controller: ['$scope', '$attrs', function($scope, $attrs) {
    //         console.log($scope);
    //         console.log($attrs);
    //         var block = $attrs.params && angular.fromJson(decodeURI($attrs.params));
    //         if(!block) {
    //             return;
    //         }
    //         block.$scope = $scope;
    //         $scope.$kp_block = block;
    //         // 不是wiki block 直接渲染
    //         if (block.htmlContent) {
    //             $scope.content = block.htmlContent;
    //             return;
    //         }
    //         // wiki render
    //         if (block.isWikiBlock && block.wikiBlock) {
    //             var defaultModPath = "js/mod/wiki/js/"
    //             var wikiBlock = block.wikiBlock;
    //             var modParams = wikiBlock.modParams || {};
    //             var requireUrl = modParams.modPath || defaultModPath + wikiBlock.modName;
    //             require([requireUrl], function (mod) {
    //                 $scope.content = mod.render(block);
    //                 $scope.$apply();
    //             }, function () {
    //                 console.log("加载模块" + wikiBlock.modName + "失败");
    //             });
    //         }
    //     }],
    // });
});