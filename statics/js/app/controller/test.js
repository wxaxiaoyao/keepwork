
define([
	'app',
    'helper/mdwiki',
    'helper/util',
	'text!html/controller/test.html',
	'directive/treeview',
], function (app, mdwiki, util, htmlContent) {
    app.registerController("testController",['$scope', function ($scope) {
		$scope.message = "this is a test";
		$scope.trees = {
			nodes:[
			{
				text:"list1",
			},
			{
				text:"list2",
				nodes: [
				{
					text:"list21",
				},
				{
					text:"list22",
				}, 
				{
					text:"listi23",
					nodes:[
					{
						text:"list231",
					}
					]
				}
				]
			}],
		}

		$scope.click = function() {
			util.pushState({url:"/www/editor"});
		}
		//setTimeout(function(){
			//$scope.trees.nodes.push({text:"list3"});
			//$scope.$apply();
		//},2000);
	}]);

	return htmlContent;
});
