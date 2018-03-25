import markdown from "./markdown.js";
import mdconf from "./mdconf.js";

// md 构造函数
function mdwiki(options) {
	options = options || {};

	var md = {
		md:markdown(options),
		template:{
			blocklist:[],
		}
	}

	md.getBlockList = function() {
		return md.template.blocklist;
	}
	// md.bind
	md.parseBlock = function (block) {
		// 进来表明该模块发生变化 应重置所有状态
		var token = block.token;
		var content = token.content;
		var text = token.text;
		var line = text.split("\n")[0];
		var isMod = token.tag == "pre"  && /^```@([\w_\/]+)/.test(line);

		block.isMod = isMod;
		if (!isMod) {
			//block.blockUrl = undefined;
			block.isTemplate = false;
			block.modName = undefined;
			block.cmdName = undefined;
			block.modParams = undefined;
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

			block.modName = modName;
			block.cmdName = cmdName;
			block.modParams = modParams;
			block.isTemplate = modName == "template";
			block.templateContent = block.isTemplate ? templateContent : undefined;

		}
	}

	md.parse = function (text, theme) {
		theme = theme || "";
		text = theme + '\n' + text;
		var self = this;
		var themeLineCount = theme.split("\n").length;
		var tokenList = self.md.parse(text);
		var blocklist = self.template.blocklist;
		var template = undefined;
		for (var i = 0; i < tokenList.length; i++) {
			var token = tokenList[i];
			var block = blocklist[i] || {};

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
			blocklist[i] = block;
			//console.log(blcok);
			if (block.isTemplate) {
				template = block;
			}
		}

		var size = blocklist.length;
		for (var i = tokenList.length; i < size; i++) {
			blocklist.pop();
		}

		var templateText = md.template.text;
		//  预览模式不支持template
		if (template) {
			md.template.text = template.text;
			md.template.token = template.token;
			md.template.modName = template.modName;
			md.template.cmdName = template.cmdName;
			md.template.modParams = template.modParams;
		} else {
			md.template.text = undefined;
			md.template.token = undefined;
			md.template.modName = undefined;
			md.template.cmdName = undefined;
			md.template.modParams = undefined;
		}
		if (templateText != md.template.text) {
			md.template.isChange = true;
		} else {
			md.template.isChange = false;
		}
		console.log(blocklist);
		return blocklist;
	}

	return md;
}

export default mdwiki;
