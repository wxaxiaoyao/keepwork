import markdown from "./markdown.js";
import mdconf from "./mdconf.js";

// md 构造函数
export const mdFactory = function(options) {
	options = options || {};

	var md = {
		md:markdown(options),
		template:{
			blocklist:[],
		}
	}

	md.render = function(text) {
		return this.md.render(text);
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
			block.styleName = undefined;
			block.modParams = undefined;
		} else {
			var wikiCmdRE = /^```@([\w_\/]+)/;
			var wikiModNameRE = /^([\w_]+)/;
			var wikiStyleNameRE = /([\w_]+)$/;
			var cmdName = line.match(wikiCmdRE)[1];
			var modName = cmdName.match(wikiModNameRE)[1];
			var styleName = cmdName.match(wikiStyleNameRE)[1];
			var modParams = undefined;
			try {
				modParams = angular.fromJson(content)
			}
			catch (e) {
				modParams = mdconf.mdToJson(content) || content;
			}

			block.modName = modName;
			block.cmdName = cmdName;
			block.styleName = styleName;
			block.modParams = modParams;
			block.isTemplate = modName == "template";
		}
	}

	md.parse = function (text, theme) {
		var self = this;
		var themeLineCount = 0;
		if (theme) {
			text = theme + "\n" + text;
			themeLineCount = theme.split("\n").length;
		}

		var tokenList = self.md.parse(text);
		var blocklist = self.template.blocklist;
		var template = undefined;
		var tokens = [];
		var index = 0;
		var tmpToken = undefined;
		var text = "";
		var texts = [];

		self.tokens = tokenList;
		//console.log(self.tokens);

		for (var i = 0; i < tokenList.length; i++) {
			var token = tokenList[i];
			if (token.tag == "pre") {
				if (tmpToken) {
					tmpToken.text = texts.join("\n");
					tokens[index++] = tmpToken;
					tmpToken = undefined;
					texts = [];
				}
				tokens[index++] = token;
				continue;
			} 

			texts.push(token.text);

			if (tmpToken) {
				tmpToken.end = token.end;
			} else {
				tmpToken = {
					start: token.start,
					end: token.end,
				};
			}
		}

		if (tmpToken) {
			tmpToken.text = texts.join("\n");
			tokens[index++] = tmpToken;
		}

		//console.log(tokenList, tokens);

		for (var i = 0; i < tokens.length; i++) {
			var token = tokens[i];
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
		for (var i = tokens.length; i < size; i++) {
			blocklist.pop();
		}

		var templateText = md.template.text;
		//  预览模式不支持template
		if (template) {
			md.template.text = template.text;
			md.template.token = template.token;
			md.template.modName = template.modName;
			md.template.styleName = template.styleName;
			md.template.cmdName = template.cmdName;
			md.template.modParams = template.modParams;
		} else {
			md.template.text = undefined;
			md.template.token = undefined;
			md.template.modName = "template";
			md.template.styleName = "default";
			md.template.cmdName = undefined;
			md.template.modParams = undefined;
		}
		if (templateText != md.template.text) {
			md.template.isChange = true;
		} else {
			md.template.isChange = false;
		}
		//console.log(blocklist);
		return blocklist;
	}

	return md;
}

export default mdFactory();
