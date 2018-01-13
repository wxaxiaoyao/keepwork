
define([
	"text!wikimod/template/index.html",
], function(htmlContent){
	var default_params = {
		urlmatch:{
			text:"",
		},
		rows:[
		{
			class:undefined,
			style:undefined,
			cols:[
			{
				class:undefined,
				style:undefined,
				is_main_content:true,
			}
			]
		},
		],
	}

	function string_to_object(value) {
		if (typeof(value) == "string") {
			return {text:value};
		}

		return value;
	}

	function get_mod_editor_params(wikiBlock) {
		var modParams = wikiBlock.modParams || {};
		var id = 0;

		modParams.urlmatch = string_to_object(modParams.urlmatch);
		modParams.urlmatch.$data = {
			type:"text",
			name:"urlmatch",
			order:1,
			id: id++,
		}

		for (var i = 0; i < modParams.rows.length; i++) {
			var row = modParams.rows[i];
			for (var j = 0; j < row.cols.length; j++) {
				var col = row.cols[j];
				col.$data = {
					type: "page",
					name: "区块" + i + "-" + j,
					id: id++,
				}
			}
		}
	}

	function render(wikiBlock) {
		var $scope = wikiBlock.$scope;
		var params = wikiBlock.modParams || {};

		params.rows = params.rows || [{cols:[{is_main_content:true}]}];
		
		if (!$scope) {
			return;
		}

		$scope.params = params;

		for (var i = 0; i < params.rows.length; i++) {
			var row = params.rows[i];
			for (var j = 0; j < row.cols.length; j++) {
				var col = row.cols[j];
				if (col.is_main_content) {
					col.content = wikiBlock.templateContent;
				}
			}
		}

		$scope.mode = wikiBlock.mode;
		//console.log($scope.params, $scope.mode);

		return htmlContent;
	}

	return {
		get_mod_editor_params: get_mod_editor_params,
		render: render,
	}
})
