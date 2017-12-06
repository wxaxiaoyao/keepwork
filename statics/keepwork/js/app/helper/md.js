
define([
	
], function(){
	var escape_ch = "@";
	var special_str = '`*_{}[]()#+-.!>\\';

	// markdown 特殊字符转义
	function md_special_char_escape(text) {
		var new_text = "";
		for (var i = 0; i < text.length; i++) {
			var ch = text[i];
			var nextch = text[i+1];
			if (ch == escape_ch) {
				new_text += escape_ch + escape_ch;
				continue;
			} 
			if (ch == '\\' && nextch && special_str.indexOf(nextch) >= 0) {
				new_text += nextch;
				i++;	
				continue;
			}
			if (special_str.indexOf(ch) >= 0) {
				new_text += escape_ch + ch;	
				continue;
			}
			new_text += ch;
		}

		return new_text;
	}

	function md_special_char_unescape(text) {
		var new_text = "";
		for (var i = 0; i < text.length; i++) {
			var ch = text[i];
			var nextch = text[i+1];
			if (ch == escape_ch && nextch == escape_ch) {
				new_text += escape_ch;
				i++;
				continue;
			} 
			if (ch == "@" && nextch && special_str.indexOf(nextch) >= 0) {
				new_text += nextch;
				i++;	
				continue;
			}
			new_text += ch;
		}
		return new_text;
	}

	window.md_special_char_escape = md_special_char_escape;
	window.md_special_char_unescape = md_special_char_unescape;

	// 是否是空行
	function is_empty_list(line) {
		if (line.trim() == "") {
			return true;
		}
		return false;
	}

	// 是否是水平线
	function is_hr(line) {
		//if (line.match(/^-{3,}[-\s]*$/) || line.match(/^\*{3,}[\*\s]*$/)) {
			//return true;
		//}

		line_trim = line.trim();
		if (line_trim == "@*@*@*" && line.indexOf("@*@*@*") == 0) {
			return true;
		}
		if (line_trim == "@-@-@-" && line.indexOf("@-@-@-") == 0) {
			return true;
		}

		return false;
	}

	// 是否是列表 
	function is_list(line) {
		//if (line.indexOf("* ") == 0 ||
				//line.indexOf("- ") == 0 ||
				//line.indexOf("+ ") == 0 || 
				//line.match(/^\d+\./)) {
			//return true;
		//}

		if (line.indexOf("@* ") == 0 ||
				line.indexOf("@- ") == 0 ||
				line.indexOf("@+ ") == 0 || 
				line.match(/^\d+\./)) {
			return true;
		}
		return false;
	}

	// 是否是引用
	function is_blockquote(line) {
		//if (line.indexOf(">") == 0) {
			//return true;
		//}
		if (line.indexOf("@>") == 0) {
			return true;
		}
		return false;
	}

	// 是否是标题
	function is_header(line) {
		//if (line.match(/^#{1,6} /)) {
			//return true;
		//}
		if (line.match(/^(@#){1,6} /)) {
			return true;
		}
		return false;
	}

	function link(text) {
		var reg_str = /@\[(.*?)@\]@\((.*?)@\)/;
		var regs = text.match(reg_str);
			
		if (!regs) {
			return text;
		}
		
		console.log(text, regs);	

		var match_str = regs[0];
		var link_text = regs[1];
		var link_href = regs[2];
		var link_str = '<a href="'+ link_href +'">' + link_text + '</a>';
		
		text = text.replace(reg_str, link_str)

		return link(text);
	}

	function image(text) {
		var reg_str = /@!@\[(.*?)@\]@\((.*?)@\)/;
		var regs = text.match(reg_str);
			
		if (!regs) {
			return text;
		}	

		var match_str = regs[0];
		var image_text = regs[1];
		var image_href = regs[2];
		var image_str = '<img src="'+ image_href +'" alt="'+ image_text + '"/>';
		
		text = text.replace(reg_str, image_str)

		return image(text);
	}

	function image_link(text) {
		return link(image(text));
	}

	function em(text) {
		var reg_str = /@\*(.+?)@\*/;
		var regs = text.match(reg_str);
		var htmlstr = "";	
		if (regs){
			htmlstr = '<em>' + regs[1] + '</em>';
			text = text.replace(reg_str, htmlstr);
			return em(text);
		}

		reg_str = /@_(.*?)@_/;
		regs = text.match(reg_str);
		if (regs){
			htmlstr = '<em>' + regs[1] + '</em>';
			text = text.replace(reg_str, htmlstr);
			return em(text);
		}

		return text;
	}

	function strong(text) {
		var reg_str = /@\*@\*(.+?)@\*@\*/;
		var regs = text.match(reg_str);
		var htmlstr = "";	
		if (regs){
			htmlstr = '<strong>' + regs[1] + '</strong>';
			text = text.replace(reg_str, htmlstr);
			return strong(text);
		}

		reg_str = /@_@_(.*?)@_@_/;
		regs = text.match(reg_str);
		if (regs){
			htmlstr = '<strong>' + regs[1] + '</strong>';
			text = text.replace(reg_str, htmlstr);
			return strong(text);
		}

		return text;
	}

	function strong_em(text) {
		return	em(strong(text))
	}

	function inline_code(text) {
		var reg_str = /@`(.*?)@`/;
		var regs = text.match(reg_str);
		var htmlstr = "";	
		if (regs){
			htmlstr = '<code>' + regs[1] + '</code>';
			text = text.replace(reg_str, htmlstr);
			return strong(text);
		}

		return text;
	}

	// 代码块
	function block_code(obj) {
		var cur_line = obj.lines[obj.start];
		var flag_str = '@`@`@`';
		if (cur_line.indexOf(flag_str) != 0) {
			return ;
		}
		var content = cur_line, i = 0;
		var codeContent = "";
		for (i = obj.start + 1; i < obj.lines.length; i++) {
			var line = obj.lines[i];
			content += "\n" + line;
			if (line.indexOf(flag_str) == 0) {
				i++;
				break;
			}
			codeContent += "\n" + line;
		}

		return {
			tag:'pre',
			content:content,
			start: obj.start,
			end: i,
			htmlContent: '<pre>' + codeContent + '</pre>',
		}
	}

	function block_code_tab(obj){
		var last_line = obj.start > 0 ? obj.lines[obj.start-1] : "";
		var cur_line = obj.lines[obj.start];
		var is_blockcode_flag = function(line) {
			if (line.indexOf("\t") == 0 || line.indexOf("    ") == 0) {
				return true;
			}
			return false;
		};

		if (!is_empty_list(last_line) || !is_blockcode_flag(cur_line)) {
			return ;
		}

		var content = cur_line[0] == " " ? cur_line.substring(4) : cur_line.substring(1), i = 0;
		for (i = obj.start + 1; i < obj.lines.length; i++) {
			var line = obj.lines[i];
			if (!is_blockcode_flag(line)) {
				break;
			}
			content += "\n" + (line[0] == " " ? line.substring(4) : line.substring(1));
		}

		return {
			tag:'pre',
			content:content,
			start: obj.start,
			end: i,
			htmlContent: '<pre>' + content + '</pre>',
		}
	}

	// 头部判断
	function header(obj) {
		var cur_line = obj.lines[obj.start];
		var header_list = [
			"@# ",
			"@#@# ",
			"@#@#@# ",
			"@#@#@#@# ",
			"@#@#@#@#@# ",
			"@#@#@#@#@#@# ",
		];

		for (var i = 0 ; i < header_list.length; i++) {
			if (cur_line.indexOf(header_list[i]) == 0) {
				break;
			}
		}

		if (i == header_list.length) {
			return ;
		}
		var token = {
			tag:"h" + (i+1),
			content: cur_line.substring(header_list[i].length),
			start: obj.start,
			end: obj.start + 1,
		}

		token.htmlContent = '<' + token.tag + '>' + obj.md.line_parse(token.content) + '</' + token.tag + '>';
		return token;
	}

	// 换行
	function br(obj) {
		var cur_line = obj.lines[obj.start];
		var i = 0, htmlContent = "";	
		if (!is_empty_list(cur_line)) {
			return;
		}

		for (i = obj.start + 1; i < obj.length; i++) {
			if (!is_empty_list(obj.lines[i])) {
				break;
			}
			htmlContent += "<br/>";
		}

		if (i == obj.start + 1) {
			return;
		}

		return {
			tag: "div",
			htmlContent: htmlContent,
			start: obj.start+1,
			end: i,
		}
	}

	// 段落
	function paragraph(obj, env) {
		var is_paragraph_line = function(line) {
			if (is_hr(line)
				   	|| is_list(line) 
					|| is_blockquote(line) 
					|| is_header(line) 
					|| line.indexOf("```") == 0
					|| is_empty_list(line)) {
				return false;
			}

			return true;
		}

		var cur_line = obj.lines[obj.start];
		if (!is_paragraph_line(cur_line)) {
			return;
		}

		var content = cur_line, i = 0;
		for (i = obj.start+1; i < obj.lines.length; i++) {
			var line = obj.lines[i];
			if (!is_paragraph_line(line)) {
				break;
			}
			content += "<br/>" + line;
		}

		var token = {
			tag: "p",
			content: content,
			start: obj.start,
			end:i,
		}
		if (env && env.is_sub_tag) {
			token.htmlContent = obj.md.line_parse(token.content);
		} else {
			token.htmlContent = '<' + token.tag + '>' + obj.md.line_parse(token.content) + '</' + token.tag + '>';
		}
		return token;
	}

	// 引用
	function blockquote(obj) {
		var cur_line = obj.lines[obj.start];
		if (cur_line.indexOf("@>") != 0) {
			return ;
		}
		
		var content = cur_line.substring(2), i = 0;
		for (i = obj.start + 1; i < obj.lines.length; i++) {
			var line = obj.lines[i];
			if (is_empty_list(line)) {
				break;
			}
			line = line.trim();
			content += "\n" + ((line.indexOf("@>") == 0) ? line.substring(2) : line);
		}

		return {
			tag: "blockquote",
			content: content,
			start: obj.start,
			end: i,
			subtokens: obj.md.block_parse(content, {start: obj.start, is_sub_tag:true}),
		}
	}

	// 列表
	function list(obj) {
		var cur_line = obj.lines[obj.start];
		var is_list = function(line) {
			if (line.indexOf("@* ") == 0 || line.indexOf("@- ") == 0 || line.indexOf("@+ ") == 0) {
				return {is_list: true, is_sort: false};
			}
			if (line.match(/^\d+\./)) {
				return {is_list:true, is_sort: true};
			}

			return {is_list:false, is_sort: false};
		}

		var cur_ret = is_list(cur_line);
		if (!cur_ret.is_list) {
			return;
		}

		var content = cur_line, i = 0;
		var subtokens = [];
		var token = {
			tag: "li",
			start: obj.start,
			content: cur_line.substring(2).trim(),
		}
		for (i = obj.start + 1; i <= obj.lines.length; i++) {
			var line = obj.lines[i] || "";
			var ret = is_list(line);
			if (is_empty_list(line)) {
				token.end = i;
				token.subtokens = obj.md.block_parse(token.content, {start:i, is_sub_tag:true});
				subtokens.push(token);
				break;
			}
			if (ret.is_list) {
				token.end = i;
				token.subtokens = obj.md.block_parse(token.content, {start:i, is_sub_tag:true});
				subtokens.push(token);
				if (cur_ret.is_sort != ret.is_sort) {
					break;
				} else {
					token = {
						tag: "li",
						start: i,
						content: line.substring(2).trim(),
					}
				}
			} else {
				token.content += "\n" + line.trim();
			}
			content += "\n" + line;
		}

		return {
			tag: (cur_line[1] == "*" || cur_line[1] == "+" || cur_line[1] == "-") ? "ul" : "ol",
			content: content,
			start: obj.start,
			end: i,
			subtokens: subtokens,
		} 
	}	


	// 分割线
	function horizontal_line(obj) {
		var cur_line = obj.lines[obj.start];
		if (!is_hr(cur_line)) {
			return ;
		}

		return {
			tag: "div",
			htmlContent:"<hr>",
			content: cur_line,
			start: obj.start,
			end: obj.start+1,
		}
	}

	// 表
	function table(obj) {
		var cur_line = obj.lines[obj.start];
		var next_line = obj.lines[obj.start+1] ||"";
		var format_line = function(line) {
			line = line[0] == "|" ? line.substring(1) : line;
			line = line.trim();
			line = line[line.length-1] == "|" ? line.substring(0, line.length-1) : line;

			return line;
		}

		cur_line = format_line(cur_line);
		next_line = format_line(next_line);

		var cur_line_fields = cur_line.split("|");
		var next_line_fields = next_line.split("|");
		var i = 0, line_fields, field, htmlField, line, style_list = [];
		if (cur_line_fields.length != next_line_fields.length || cur_line_fields.length == 1) {
			return;
		}
		for (var i = 0; i < next_line_fields.length; i++) {
			field = next_line_fields[i].trim();
			if (!field.match(/^:?(@-)+:?$/)) {
				return;
			}
			if (field[0] == ":" && field[field.length-1] != ":") {
				style_list.push('style="text-align:left"');
			} else if (field[0] != ":" && field[field.length-1] == ":") {
				style_list.push('style="text-align:right"');
			} else if (field[0] == ":" && field[field.length-1] == ":") {
				style_list.push('style="text-align:center"');
			} else {
				style_list.push('style="text-align:left"');
			}
		}

		var content = cur_line + '\n' + next_line + '\n';
		var htmlContent = "<table><thead><tr>";
		for (var i = 0; i < cur_line_fields.length; i++) {
			field = cur_line_fields[i].trim();
			htmlField = obj.md.line_parse(field);
			htmlContent += "<th>" + htmlField + "</th>";
		}
		htmlContent += "</tr></thead><tbody>";

		for (i = obj.start + 2; i < obj.lines.length; i++) {
			line = obj.lines[i];
			line = format_line(line);
			line_fields = line.split("|");
			if (line_fields.length != cur_line_fields.length) {
				break;
			}

			htmlContent += "<tr>";
			for (var j = 0; j < line_fields.length; j++) {
				field = line_fields[j].trim();
				htmlField = obj.md.line_parse(field);
				htmlContent += "<td "+ style_list[j] +">" + htmlField + "</td>";
			}
			htmlContent += "</tr>";
			content += "\n" + line;
		}

		htmlContent += "</tbody></table>";

		return {
			tag:"table",
			content: content,
			htmlContent: htmlContent,
			start: obj.start,
			end: i,
		}
	}

	// 渲染token
	function render_token(token) {
		var htmlContent = "";

		if (token.htmlContent) {
			return token.htmlContent;
		}

		htmlContent += "<" + token.tag + ">";

		var subtokens = token.subtokens || [];
		for (var i = 0; i < subtokens.length; i++) {
			htmlContent += render_token(subtokens[i]);
		}
		htmlContent += "</" + token.tag + ">";

		return htmlContent;
	}

	function markdown(options) {
		var md = {
			block_rule_list:[],
			inline_rule_list:[],
			options: options,
		};


		md.register_inline_rule = function(rule) {
			this.inline_rule_list.push(rule);
		}

		md.register_block_rule = function(rule) {
			this.block_rule_list.push(rule);
		}

		md.register_inline_rule(image_link);
		md.register_inline_rule(strong_em);
		md.register_inline_rule(inline_code);
		
		md.register_block_rule(horizontal_line);
		md.register_block_rule(br);
		md.register_block_rule(header);
		md.register_block_rule(block_code);
		md.register_block_rule(block_code_tab);
		md.register_block_rule(blockquote);
		md.register_block_rule(list);
		md.register_block_rule(table);
		// 段落需放最后
		md.register_block_rule(paragraph);

		md.line_parse = function(text) {
			for (var i = 0; i < md.inline_rule_list.length; i++) {
				var rule = md.inline_rule_list[i];
				text = rule(text);
			}
			return text;
		}

		md.block_parse = function(text, env) {
			var self = this;
			var params = {}, tokens = [], lines = text.split("\n"), start = 0;
			//console.log(lines);	
			while(start < lines.length && start >= 0) {
				params.start = start;
				params.lines = lines;
				params.md = self;

				for (var i = 0; i < md.block_rule_list.length; i++){
					var block_rule = md.block_rule_list[i];
					var token = block_rule(params, env);
					if (token) {
						tokens.push(token);
						console.log(token);
						if (start >= token.end) 
							break;
						start = token.end - 1;
						break;
					}
				}
				start++;
			}	

			return tokens;
		}

		md.parse = function(text) {
			return this.block_parse(text);
		}

		md.render = function(text) {
			text = md_special_char_escape(text);
			var tokens = this.parse(text || "");

			var htmlContent = "";
			for (var i = 0; i < tokens.length; i++) {
				htmlContent += render_token(tokens[i]);	
			}

			htmlContent = md_special_char_unescape(htmlContent);
			return htmlContent;
		}

		return md;
	}
	
	return markdown;
});

