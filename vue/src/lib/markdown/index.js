import markdown from "./md.js";
import mdconf from "./mdconf.js";

// md 构造函数
function mdwiki(options) {
	options = options || {};

	var md = markdown(options);

	md.register_rule_render("pre", function(obj, defaultRender){

	});

	// 渲染
	md.render = function (text) {
		md.parse(text, theme);

		//console.log("-------render----------");
		md.template.render(function(){
			for(var i = 0; i < md.template.blockList.length; i++) {
				var block = md.template.blockList[i];
				block.render();
			}
		});

		md.template.$apply && md.template.$apply();
		//console.log(md.template);

		md.bindContainer();
		return '<wiki-block-container data-template="true" data-params="' + encodeURI(md.mdName) + '"></wiki-block-container>';
	}

	md.getBlockList = function() {
		return md.template.blockList;
	}
	// md.bind
	md.parseBlock = function (block) {
		// 进来表明该模块发生变化 应重置所有状态
		var token = block.token;
		var content = token.content;
		var text = token.text;
		var line = text.split("\n")[0];
		var isWikiBlock = token.tag == "pre"  && /^```@([\w_\/]+)/.test(line);

		block.isWikiBlock = isWikiBlock;
		if (!isWikiBlock) {
			//block.blockUrl = undefined;
			block.isTemplate = false;
			block.modName = undefined;
			block.cmdName = undefined;
			block.modParams = undefined;
			block.wikimod = undefined;
			block.applyModParams = undefined;
			block.render = function() {
				if (block.htmlContent != token.htmlContent && block.$render) {
					block.htmlContent = token.htmlContent;
					//console.log(block.htmlContent, block);
					block.$render(block.htmlContent);
				}
			}
		} else {
			var wikiCmdRE = /^```@([\w_\/]+)/;
			var wikiModNameRE = /^([\w_]+)/;
			var cmdName = line.match(wikiCmdRE)[1];
			var modName = cmdName.match(wikiModNameRE)[1];
			var modParams = undefined;
			try {
				modParams = angular.fromJson(content)
			}
			catch (e) {
				modParams = mdconf.mdToJson(content) || content;
			}

			if (block.cmdName != cmdName) {
				block.wikimod = undefined;
			}

			block.modName = modName;
			block.cmdName = cmdName;
			block.modParams = modParams;
			block.isTemplate = modName == "template";
			block.templateContent = block.isTemplate ? templateContent : undefined;

			if (typeof(block.modParams) == "string" && !block.modParams.trim()) {
				block.modParams = undefined;
			}

			block.applyModParams = function(modParams) {
				var md = getMd(block.mdName);
				var editor = (md.editor || {}).editor;

				if (!editor) {
					return;
				}

				var from = block.token.start;
				var to = block.token.end;
				modParams = modParams || block.modParams;

				//console.log(modParams);
				if (typeof(modParams) == "object") {
					//modParams = angular.toJson(modParams, 4);
					modParams = mdconf.jsonToMd(modParams);
				}

				editor.replaceRange(modParams + '\n', {line: from + 1, ch: 0}, {line: to - 1, ch: 0});
			}

			block.render = function(success, error) {
				var self = this;

				// 强制渲染
				if (self.$render && self.cmdName && self.wikimod && self.cmdName == self.wikimod.cmdName && 
						self.wikimod.mod && self.wikimod.mod.forceRender) {
					self.wikimod.mod.forceRender(self);
				}

				if (!self.isChange) {
					success && success();
					return;
				}

				//console.log(self);
				function _render(mod) {
					if (!self.$render) {
						return;
					}

					// 获取模板html
					function _getModHtml() {
						var htmlContent = undefined;
						if (typeof(mod) == "function") {
							htmlContent = mod(self);	
						} else if(typeof(mod) == "object") {
							htmlContent = mod.render(self);
						} else {
							htmlContent = mod;
						}

						return htmlContent;
					}
					
					var htmlContent = _getModHtml();
					var md = getMd(self.mdName);

					// text 改变不一定重新渲染  htmlContent改变则重新渲染
					if (self.htmlContent != htmlContent) {
						self.htmlContent = htmlContent;
						// 预览模式渲染魔板块 此外排除魔板块
						if (self.mode == "preview" || !self.isTemplate || self.blockList != undefined) { // template 与 template_block 唯一区别是blockList
							self.$render(_getModHtml);
						}
					} else {
					}
					success && success();
				}

				if (self.cmdName && self.wikimod && self.cmdName == self.wikimod.cmdName) {
					_render(self.wikimod.mod);
				} else {
					loadMod(self, function (mod, cmdName) {
						if (self.cmdName != cmdName) {
							return;
						}

						self.wikimod = {cmdName: cmdName, mod: mod};
						_render(self.wikimod.mod);
					}, function () {
						console.log("加载模块" + block.modName + "失败");
						error && error();
					});
				}
			}
		}
	}

	md.parse = function (text, theme) {
		theme = theme || "";
		text = theme + '\n' + text;
		themeLineCount = theme.split("\n").length;

		var tokenList = md.md.parse(text);
		var blockList = md.template.blockList;
		var template = undefined;
		for (var i = 0; i < tokenList.length; i++) {
			var token = tokenList[i];
			var block = blockList[i] || {};

			block.token = token;
			block.mdName = md.mdName;
			block.mode = md.mode;
			if (block.text != token.text) {
				block.text = token.text;
				block.isChange = true;
				md.parseBlock(block);
			} else {
				block.isChange = false;
			}
			block.token.start = block.token.start - themeLineCount;
			block.token.end = block.token.end - themeLineCount;
			blockList[i] = block;
			//console.log(blcok);
			if (block.isTemplate) {
				template = block;
			}
		}

		var size = blockList.length;
		for (var i = tokenList.length; i < size; i++) {
			blockList.pop();
		}

		var templateText = md.template.text;
		//  预览模式不支持template
		if (md.mode != "preview" && template) {
			md.template.text = template.text;
			md.template.token = template.token;
			md.template.modName = template.modName;
			md.template.cmdName = template.cmdName;
			md.template.modParams = template.modParams;
			md.template.wikimod = template.wikimod;
			md.template.render = template.render;
			md.template.applyModParams = template.applyModParams;
		} else {
			md.template.text = undefined;
			md.template.token = undefined;
			md.template.modName = undefined;
			md.template.cmdName = undefined;
			md.template.modParams = undefined;
			md.template.wikimod = undefined;
			md.template.applyModParams = undefined;
			md.template.render = function(success){
				if (md.template.htmlContent != blankTemplateContent && md.template.$render) {
					md.template.htmlContent = blankTemplateContent;
					md.template.$render(blankTemplateContent);
				}
				success && success();
			};
		}
		if (templateText != md.template.text) {
			md.template.isChange = true;
		} else {
			md.template.isChange = false;
		}
		//console.log(blockList);
		return blockList;
	}

	return md;
}

export default mdwiki;
