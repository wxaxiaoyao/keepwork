
define([
	'app',
    'helper/dataSource/gitlab',
    'helper/mdwiki',
    'helper/util',
	'text!html/controller/test.html',
	'directive/treeview',
], function (app, gitlab, mdwiki, util, htmlContent) {
    app.registerController("testController",['$scope', function ($scope) {
		var $rootScope = app.ng_objects.$rootScope;
		$scope.user = $scope.user || $rootScope.user;
		console.log($scope);
		var git = gitlab($scope.user.default_data_source);

		//git.writeFile({
			//content:".gitkeep",
			//path: "xiaoyao/xiaoyao/.gitkeep",
		//}, function(data){
			//console.log(data);
			//git.getContent({path:"test.md"}, function(content){
				//console.log(content);
			//});
		//}, function(data){

		//});

		git.getTree({recursive:true, isFetchAll:true, path:"xiaoyao_site"}, function(data){
			console.log(data);
		});
		//$scope.message = "this is a test";
		//$scope.trees = {
			//nodes:[
			//{
				//text:"list1",
			//},
			//{
				//text:"list2",
				//nodes: [
				//{
					//text:"list21",
				//},
				//{
					//text:"list22",
				//}, 
				//{
					//text:"listi23",
					//nodes:[
					//{
						//text:"list231",
					//}
					//]
				//}
				//]
			//}],
		//}

		//$scope.click = function() {
			//util.pushState({url:"/www/editor"});
		//}
		//setTimeout(function(){
			//$scope.trees.nodes.push({text:"list3"});
			//$scope.$apply();
		//},2000);
	}]);

	return htmlContent;
});
