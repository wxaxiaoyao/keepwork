
define([
	"text!wikimod/template/index.html",
], function(htmlContent){
	var default_params = {
		design: "style1",
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
		} else if (typeof(value) == "object") {
			return value;
		}

		return {};
	}

	// 获取模块参数
	function getModuleParams(editorParams) {
		for (var i = 0; i < editorParams.rows.length; i++) {
			var row = editorParams.rows[i];
			for (var j = 0; j < row.cols.length; j++) {
				var col = row.cols[j];
				if (col.is_main_content) {
					col.content = undefined;
				}
			}
		}

		return editorParams;
	}

	// 获取编辑参数
	function getEditorParams(modParams) {
		var idPrefix = "wikiblock_template_";
		var id = 0;
		modParams = modParams || {};
		modParams.rows = modParams.rows || [{cols:[{is_main_content:true}]}];
		modParams.urlmatch = string_to_object(modParams.urlmatch);
		modParams.urlmatch.$data = {
			type:"text",
			name:"urlmatch",
			order:1,
			id: idPrefix + id++,
		}

		for (var i = 0; i < modParams.rows.length; i++) {
			var row = modParams.rows[i];
			for (var j = 0; j < row.cols.length; j++) {
				var col = row.cols[j];
				col.$data = {
					type: "page",
					name: "区块" + i + "-" + j,
					id: idPrefix + id++,
				}
			}
		}

		return modParams;
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
		return htmlContent;
	}

	function renderAfter(wikiBlock) {
		if (wikiBlock.mode == "preview") {
			return;
		}

		var $compile = app.ng_objects.$compile;
		var $scope = wikiBlock.$scope;
		var htmlContent = $compile(wikiBlock.templateContent)($scope);
		$(".kp_wiki_template_main_content").html(htmlContent);
		wikiBlock.$apply && wikiBlock.$apply();
	}

	function usage() {
		return "";
	}

	function getStyleList(wikiBlock) {
		return [
		{ 
			design: "样式1",
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
		},
		{ 
			design: "样式2",
			rows:[
			{
				class:undefined,
				style:undefined,
				cols:[
				{
					class:"container",
					style:undefined,
					is_main_content:true,
				}
				]
			},
			],
		},
		{ 
			design: "样式3",
			rows:[
			{
				class:undefined,
				style:undefined,
				cols:[
				{
					class:"col-xs-3",
					style:undefined,
					is_main_content:true,
				},
				{
					class:"col-xs-9",
					style:undefined,
					is_main_content:true,
				},
				]
			},
			],
		},
		{ 
			design: "样式4",
			rows:[
			{
				class:undefined,
				style:undefined,
				cols:[
				{
					class:"col-xs-9",
					style:undefined,
					is_main_content:true,
				},
				{
					class:"col-xs-3",
					style:undefined,
					is_main_content:true,
				},
				]
			},
			],
		},
		];
	}

	return {
		getEditorParams: getEditorParams,
		getModuleParams: getModuleParams,
		getStyleList: getStyleList,
		render: render,
		renderAfter: renderAfter, // 二次渲染问题
		usage: usage,
	};
})
