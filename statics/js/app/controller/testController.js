
define([
	'app',
    'helper/mdwiki',
    'helper/util',
	'text!html/test.html',
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
				},{
					text:"list22",
				}, {
					text:"list3",
					nodes:[
					{
						text:"list31",
					}
					]
				}
				]
			}],
		}
	}]);

	return htmlContent;
});
