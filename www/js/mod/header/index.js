
define([
	"text!wikimod/header/index.html",
], function(htmlContent){
	// 获取编辑器参数
	function getEditorParams(modParams) {
		var id = 0;
		modParams = modParams || {};
		modParams.title = modParams.title || {text:"Title"};
		modParams.title.$data = {
			type:"text",
			name:"标题",
			order:1,
			id: id++,
		}

		return modParams;
	}
	// 获取模块参数
	function getModuleParams(editorParams) {
		return editorParams;
	}

	function render(wikiBlock) {
		var $scope =  wikiBlock.$scope;
		//console.log(wikiBlock);
		$scope.params = wikiBlock.modParams || {};

		//console.log($scope.params);
		setTimeout(function(){
			$scope.$apply();
		})
		return htmlContent;
	}

	return {
		render:render,
		getEditorParams:getEditorParams,
		getModuleParams:getModuleParams,
	}
});
