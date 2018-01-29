
define([
	"app",
	"helper/wikimod",
	'text!html/controller/editorModule.html',
], function(app, wikimod, htmlContent){
	var config = app.objects.config;
	var util = app.objects.util;
	var mdconf = app.objects.mdconf;

	var params = {
		block: undefined,
		showType: "blocklist",
		blocklist: wikimod.getWikimods(),
	};

	//params.setWikimod = function(wikimod) {

	//}
	
	function getBlockStyles(block, success, error) {
		function _getWikimodStyles(block) {
			var styles = [];
			
			if (!block.wikimod.mod || !block.wikimod.mod.getStyleList) {
				error && error();
				return
			}

			var stylelist = block.wikimod.mod.getStyleList() || [];
			for (var i = 0; i < (stylelist || []).length; i++) {
				styles.push({
					isChange: true,
					//htmlContent: block.htmlContent,
					modName: block.modName,
					cmdName: block.cmdName,
					isTemplate: block.modName == "template",
					isWikiBlock: true,
					mdName: undefined,	
					modParams: stylelist[i],
					mode: config.CONST.MD_MODE_PREVIEW,
					render: function() {
						var self = this;

						var mod = self.wikimod.mod;

						if (!self.htmlContent) {
							if (typeof(mod) == "function") {
								self.htmlContent = mod(self);
							} else if (typeof(mod) == "object") {
								self.htmlContent = mod.render(self);
							} else {
								self.htmlContent = mod;
							}
						}

						if (self.$render) {
							self.$render(self.htmlContent);
						}
					},
					wikimod: block.wikimod,
				});
			}

			success && success(styles);
		}

		if (block.wikimod) {
			_getWikimodStyles(block);
		} else {
			wikimod.loadWikiMod(block, function(mod){
				block.wikimod = {cmdName:block.cmdName, mod:mod};
				_getWikimodStyles(block);
			}, error);
		}
	}

	app.registerController("editorModuleController", ["$scope", function($scope){
		function init() {
			$scope.params = params;
		}

		$scope.clickSelectBlock = function(block) {
			if (!block) {
				params.showType = "blocklist";
				return;
			}

			//console.log(block);
			params.showType = "block";
			params.block = block;
			params.styles = [];
			getBlockStyles(block, function(styles) {
				params.styles = styles;
				//console.log(styles);
				util.$apply();
			});
		}

		$scope.clickSelectStyle = function(block) {
			var editor = app.objects.editor;
			if (!editor) {
				return;
			}
			var line = editor.editor.getCursor().line;
			var text = '```@' + block.cmdName + "\n" + mdconf.jsonToMd(block.modParams) + '\n```\n';
			//console.log(line);
			editor.editor.replaceRange(text, {line:line+1, ch:0}, {line:line+1, ch:0});
			//editor.editor.replaceRange('helloworld\n', {line:line+1, ch:0}, {line:line+1, ch:0});
			editor.editor.setCursor({line:line+1, ch:0});
			editor.editor.focus();
		}
		$scope.$watch("$viewContentLoaded", init);
	}]);


	return htmlContent;
})
