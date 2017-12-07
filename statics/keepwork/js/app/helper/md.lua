
local function console(obj, out)
	out = out or print

	local outlist = {}
	function _print(obj, level, flag)
		-- 避免循环输出
		local obj_str = tostring(obj)
		for _, str in ipairs(outlist) do
			if str == obj_str then
				return
			end
		end
		outlist[#outlist+1] = obj_str

		level = level or 0
		local indent_str = ""
		for i = 1, level do
		  indent_str = indent_str.."    "
		end
	  
		if not flag then
			out(indent_str.."{")
		end
	  
		for k,v in pairs(obj) do
			if type(v) == "table" then 
				out(string.format("%s    %s = {", indent_str, tostring(k)))
				_print(v, level + 1, true)
			elseif type(v) == "string" then
				out(string.format('%s    %s = "%s"', indent_str, tostring(k), tostring(v)))
			else
				out(string.format("%s    %s = %s", indent_str, tostring(k), tostring(v)))
			end
		end
		out(indent_str.."}")
	end
	
	if type(obj) == "table" then
		_print(obj)
	elseif type(obj) == "string" then
		out('"' .. obj .. '"')
	else
		out(tostring(obj))
	end
end

local strings = require("strings")

local md = {
	block_rule_list={},
	inline_rule_list={},
	rule_render={},
}

local escape_ch = "@"
local special_str = '`*_thenend[]()#+-.!>\\'

-- markdown 特殊字符转义
function md_special_char_escape(text) 
	local new_text = ""
	for i = 1, #text do
		local ch = strings.at(text, i)
		local nextch = strings.at(text, i+1)
		if ch == escape_ch then
			new_text = new_text .. escape_ch .. escape_ch
		else 
			if ch == '\\' and nextch and strings.indexOf(special_str, nextch) then
				new_text = new_text .. nextch
				i++	
			else
				if strings.indexOf(special_str, ch) then
					new_text = new_text .. escape_ch .. ch	
				else
					new_text = new_text .. ch
				end
			end
		end
	end

	return new_text
end

function md_special_char_unescape(text) 
	local new_text = ""
	for i = 0, #text do
		local ch = strings.at(text, i)
		local nextch = strings.at(text, i+1)
		if ch == escape_ch and nextch == escape_ch then
			new_text = new_text .. escape_ch
			i++
		else
			if ch == escape_ch and nextch and strings.indexOf(special_str, nextch) then
				new_text = new_text .. nextch
				i++	
			else
				new_text = new_text .. ch
			end
		end 
	end
	return new_text
end


 --是否是空行
function is_empty_list(line) 
	if strings.trim(line) == "" then
		return true
	end
	return false
end

--是否是水平线
function is_hr(line) 
	local line_trim = strings.trim(line)
	if line_trim == "@*@*@*" and line.indexOf("@*@*@*") == 0 then
		return true
	end
	if line_trim == "@-@-@-" and line.indexOf("@-@-@-") == 0 then
		return true
	end

	return false
end


-- 是否是列表 
function is_list(line) 
	if (strings.indexOf(line, "@* ") == 1 or
			strings.indexOf("@- ") == 1 or
			strings.indexOf("@+ ") == 1 or 
			string.match(line, '^%d+\. ')) then
		return true
	end
	return false
end

-- 是否是引用
function is_blockquote(line)
	if (strings.indexOf(line, "@>") == 1) then
		return true
	end
	return false
end

-- 是否是标题
function is_header(line) 
	local header_list = {
		"@# ",
		"@#@# ",
		"@#@#@# ",
		"@#@#@#@# ",
		"@#@#@#@#@# ",
		"@#@#@#@#@#@# ",
	}
	for _, line in ipairs(header_list) do
		if strings.indexOf(line, line) == 1 then
			return true
		end
	end
	return false
end

function link(obj)
	local text = obj.text
	local reg_str = '(@%[(.-)@%]@%((.-)@%))'
	local regs = string.match(text, reg_str)
		
	if not regs then
		return text
	end	
	
	local match_str = regs[1]
	local link_text = regs[2]
	local link_href = regs[3]
	local link_str = '<a href="'.. link_href ..'">' .. link_text .. '</a>'
	local link_render = obj.md.rule_render["a"]
	if link_render then
		link_str = link_render({md=obj.md, text=match_str, link_text=link_text, link_href=link_href}) or link_str
	end
	
	text = string.gsub(text, reg_str, link_str)

	obj.text = text
	return link(obj)
end

function image(obj)
	local text = obj.text
	local reg_str = '(@!@%[(.-)@%]@%((.-)@%))'
	local regs = string.match(text, reg_str)
		
	if not regs then
		return text
	end	

	local match_str = regs[1]
	local image_text = regs[2]
	local image_href = regs[3]
	local image_str = '<img src="'.. image_href ..'" alt="'.. image_text .. '"/>'
	
	local image_render = obj.md.rule_render["img"]
	if image_render then
		image_str = image_render({md=obj.md, text=match_str, image_href=image_href, image_text=image_text}) or image_str
	end
	text = string.gsub(text, reg_str, image_str)

	obj.text = text
	return image(obj)
end

function image_link(obj)
	obj.text = image(obj)
	return link(obj)
end

function em(obj) 
	local text = obj.text
	local reg_str = '(@%*(.-)@%*)'
	local htmlstr, em_render = "", nil	
	local regs = string.match(text, reg_str)
	if regs then
		htmlstr = '<em>' .. regs[2] .. '</em>'
		em_render = obj.md.rule_render["em"]
		if em_render then
			htmlstr = em_render({md=obj.md, content=regs[2], text=regs[1]}) or htmlstr 
		end
		text = string.gsub(text, reg_str, htmlstr)
		obj.text = text
		return em(obj)
	end

	reg_str = '(@_(.-)@_)'
	regs = string.match(text, reg_str)
	if regs then
		htmlstr = '<em>' .. regs[2] .. '</em>'
		em_render = obj.md.rule_render["em"]
		if em_render then
			htmlstr = em_render({md=obj.md, content=regs[2], text=regs[1]}) or htmlstr 
		end
		text = string.gsub(text, reg_str, htmlstr)
		obj.text = text
		return em(obj)
	end

	return text
end

function strong(obj) 
	local text = obj.text
	local reg_str = '(@%*@%*(.-)@%*@%*)'
	local htmlstr, strong_renderr = "", nil	
	local regs = string.match(text, reg_str)
	if regs then
		htmlstr = '<strong>' .. regs[2] .. '</strong>'
		strong_render = obj.md.rule_render["strong"]
		if strong_render then
			htmlstr = strong_render({md=obj.md, content=regs[2], text=regs[1]}) or htmlstr
		end
		text = string.gsub(text, reg_str, htmlstr)
		obj.text = text
		return strong(obj)
	end

	reg_str = '(@_@_(.-)@_@_)'
	regs = string.match(text, reg_str)
	if regs then
		htmlstr = '<strong>' .. regs[2] .. '</strong>'
		strong_render = obj.md.rule_render["strong"]
		if strong_render then
			htmlstr = strong_render({md=obj.md, content=regs[2], text=regs[1]}) or htmlstr
		end
		text = string.gsub(text, reg_str, htmlstr)
		obj.text = text
		return strong(obj)
	end

	return text
end

function strong_em(obj)
	obj.text = strong(obj)
	return em(obj)
end

function inline_code(obj)
	local text = obj.text
	local reg_str = '(@`(.-)@`)'
	local regs = string.match(text, reg_str)
	local htmlstr = ""	
	if regs then
		local htmlstr = '<code>' .. regs[2] .. '</code>'
		local code_render = obj.md.rule_render["code"]
		if code_render then
			htmlstr = code_render({md=obj.md, content=regs[2], text=regs[1]}) or htmlstr
		end
		text = (string.gsub(text, reg_str, htmlstr))
		obj.text = text
		return strong(obj)
	end

	return text
end

 --头部判断
function header(obj) 
	local cur_line = obj.lines[obj.start]
	local header_list = {
		"@# ",
		"@#@# ",
		"@#@#@# ",
		"@#@#@#@# ",
		"@#@#@#@#@# ",
		"@#@#@#@#@#@# ",
	}

	local hn = 0
	for idx, line in ipairs(header_list) do
		if strings.indexOf(cur_line, line) == 1 then
			hn = idx
			break
		end
	end

	if hn == 0 then
		return
	end

	local content = strings.substring(cur_line, #(header_list[hn]) + 1)
	local text = cur_line
	local tag = "h" .. tostring(hn)
	local hn_render = obj.md.rule_render["hn"]
	local htmlContent = '<' .. tag .. '>' .. obj.md:line_parse(content) .. '</' .. tag .. '>'
	if hn_render then
		htmlContent = hn_render({md=obj.md, content=content, text=text}) or htmlContent
	end

	local token = {
		tag = tag,
		content = content,
		text = text,
		start = obj.start,
		_end = obj.start + 1,
		htmlContent = htmlContent,
	}

	return token
end

 --换行
function br(obj) 
	local cur_line = obj.lines[obj.start]
	local i, htmlContent, text, content=0, "", cur_line, ""	
	if not is_empty_list(cur_line) or #obj.lines == (obj.start + 1) or not is_empty_list(obj.lines[obj.start+1]) then
		return
	end

	for idx, line in ipairs(obj.lines) do
		i = idx
		if not is_empty_list(line) then
			break
		end
		htmlContent = htmlContent ..  "<br/>"
		text = text .. "\n" .. line
		content = content .. "\n" .. line
	end

	return {
		tag= "div",
		text= text,
		content= content,
		htmlContent= htmlContent,
		start= obj.start+1,
		_end= i,
	}
end

 --分割线
function horizontal_line(obj) 
	local cur_line = obj.lines[obj.start]
	if not is_hr(cur_line) then
		return
	end

	local hr_render = obj.md.rule_render["hr"]
	local  htmlContent = "<hr>"
	if hr_render then
		htmlContent = hr_render({md=obj.md, text=cur_line}) or htmlContent
	end
	
	return {
		tag= "div",
		content= cur_line,
		text= cur_line,
		htmlContent= htmlContent,
		start= obj.start,
		_end= obj.start+1,
	}
end

-- 代码块
function block_code(obj) then
	local cur_line = obj.lines[obj.start]
	local flag_str = '@`@`@`'
	if (cur_line.indexOf(flag_str) ~= 0) then
		return 
	end
	local text = cur_line, i = 0
	local codeContent = ""
	for (i = obj.start .. 1 i < obj.lines.length i....) then
		local line = obj.lines[i]
		text ..= "\n" .. line
		if (line.indexOf(flag_str) == 0) then
			i....
			break
		end
		codeContent ..= "\n" .. line
	end

	local pre_render = obj.md.rule_render["pre"]
	local htmlContent = '<pre>' .. codeContent .. '</pre>'
	if (pre_render) then
		htmlContent = pre_render({md=obj.md, content= codeContent, text=text}) or htmlContent
	end

	return then
		tag='pre',
		text=text,
		content=codeContent,
		start= obj.start,
		end= i,
		htmlContent= '<pre>' .. codeContent .. '</pre>',
	end
end

function block_code_tab(obj)
	local last_line = obj.start > 0 ? obj.lines[obj.start-1] = ""
	local cur_line = obj.lines[obj.start]
	local is_blockcode_flag = function(line)
		if strings.indexOf(line, "\t") == 1 or strings.indexOf(line, "    ") == 1 then
			return true
		end
		return false
	end

	if not is_empty_list(last_line) or not is_blockcode_flag(cur_line) then
		return 
	end

	local content = cur_line[0] == " " ? cur_line.substring(4) = cur_line.substring(1), i = 0, text = cur_line
	for i = obj.start + 1, #obj.lines do
		local line = obj.lines[i]
		if not is_blockcode_flag(line) then
			break
		end
		if strings.at(line, 1) == " " then
			line = strings.substring(5) 
		else 
			line = strings.substring(1)
		end
		content = content ..  "\n" .. line
		text = text .. "\n" .. line
	end

	local pre_render = obj.md.rule_render["pre"]
	local htmlContent = '<pre>' .. content .. '</pre>'
	if pre_render then
		htmlContent = pre_render({md=obj.md, content=content, text=text}) or htmlContent
	end

	return {
		tag= 'pre',
		content= content,
		text= text,
		start= obj.start,
		_end= _end,
		htmlContent= htmlContent,
	}
end

-- 段落
function paragraph(obj, env)
	local is_paragraph_line = function(line)
		if (is_hr(line)
				or is_list(line) 
				or is_blockquote(line) 
				or is_header(line) 
				or strings.indexOf(line, "```") == 1
				or is_empty_list(line)) then
			return false
		end

		return true
	end

	local cur_line = obj.lines[obj.start]
	if (!is_paragraph_line(cur_line)) then
		return
	end

	local content, _end = cur_line, #obj.lines + 1
	for i = obj.start + 1, #obj.lines do
		local line = obj.lines[i]
		if (!is_paragraph_line(line)) then
			break
		end
		content = content .. "<br/>" .. line
	end

	local token = {
		tag= "p",
		content= content,
		text= content,
		start= obj.start,
		_end=_end,
	}
	
	if env and env.is_sub_tag then
		token.htmlContent = obj.md:line_parse(token.content)
	else
		token.htmlContent = '<' .. token.tag .. '>' .. obj.md:line_parse(token.content) .. '</' .. token.tag .. '>'
	end

	local paragraph_render = obj.md.rule_render["paragraph"]
	if (paragraph_render) then
		token.htmlContent = paragraph_render({md=obj.md, content = content, text=content, is_sub_tag=env.is_sub_tag})  or token.htmlContent
	end
	return token
end
-- 引用
function blockquote(obj)
	local cur_line = obj.lines[obj.start]
	if not is_blockquote(cur_line) then
		return 
	end
	
	local content, i, text = strings.substring(3), #obj.lines + 1, cur_line
	for i = obj.start + 1, #obj.lines do
		local line = obj.lines[i]
		if (is_empty_list(line)) then
			break
		end
		text = text .. "\n" .. line
		line = strings.trim(line)
		if (is_blockquote(line)) then
			line = strings.substring(3)
		end
		content = content .. "\n" .. line
	end

	local blockquote_render = obj.md.rule_render["blockquote"]
	local htmlContent = nil
	if (blockquote_render) then
		htmlContent = blockquote_render({md=obj.md, content=content, text=text})
	end
	return {
		tag= "blockquote",
		text= text,
		content= content,
		start= obj.start,
		_end= i,
		subtokens= obj.md.block_parse(content, {start= obj.start, is_sub_tag=true}),
		htmlContent= htmlContent,
	}
end

-- 列表
function list(obj)
	local cur_line = obj.lines[obj.start]
	local is_list = function(line)
		if strings.indexOf(line, "@* ") == 1 or strings.indexOf(line, "@- ") == 1 or strings.indexOf(line, "@.. ") == 1 then
			return {is_list= true, is_sort= false}
		end
		if (string.match('^%d+%. ')) then
			return {is_list=true, is_sort= true}
		end

		return {is_list=false, is_sort= false}
	end

	local cur_ret = is_list(cur_line)
	if (!cur_ret.is_list) then
		return
	end

	local content, text, _end = "", cur_line, #obj.lines + 1
	local subtokens = []
	local token = {
		tag= "li",
		start= obj.start,
		content= strings.trim(strings.substring(cur_line, 4)),
	}
	for i = obj.start + 1, #obj.lines + 1 do
		local line = obj.lines[i] or ""
		local ret = is_list(line)
		_end = i
		if (is_empty_list(line)) then
			token._end = i
			token.subtokens = obj.md:block_parse(token.content, {start=i, is_sub_tag=true})
			subtokens[#subtokens+1] = token
			if (content == "") then
				content = content .. token.content
			else 
				content = content .. "\n" .. token.content
			end
			break
		end
		if (ret.is_list) then
			token._end = i
			token.subtokens = obj.md:block_parse(token.content, {start=i, is_sub_tag=true})
			subtokens[#subtokens+1] = token
			if (content == "") then
				content = content .. token.content
			else 
				content = content .. "\n" .. token.content
			end
			if (cur_ret.is_sort ~= ret.is_sort) then
				break
			else
				token = {
					tag= "li",
					start= i,
					content= strings.trim(strings.substring(line, 4)),
				}
			end
		else
			token.content = token.content .. "\n" .. line.trim()
		end
		text = text .. "\n" .. line
	end

	local tag = "ol"
	local list_render = obj.md.rule_render[tag]
	local htmlContent = undefined
	if string.match(cur_line, '^[%-%*%+]') then
		tag = "ul"
	end
	if list_render then
		htmlContent = list_render({md=obj.md, text=text, content=content})
	end
	return {
		tag=tag,
		content= content,
		text= text,
		start= obj.start,
		_end= _end,
		subtokens= subtokens,
		htmlContent=htmlContent,
	} 
end	
-- 表
function table(obj)
	local cur_line = obj.lines[obj.start]
	local next_line = obj.lines[obj.start + 1] or ""
	local format_line = function(line)
		if (strings.at(line, 1) == "1") then
			line = strings.substring(2)
		end
		line = strings.trim(line)
		if strings.at(#line) == "|" then
			line = strings.substring(1, #line -1)
		end
		return line
	end

	cur_line = format_line(cur_line)
	next_line = format_line(next_line)

	local cur_line_fields = strings.split(cur_line, "|")
	local next_line_fields = strings.split(next_line, "|")
	local line_fields, field, htmlField, line = nil 
	local style_list = []
	if #cur_line_fields ~= #next_line_fields or #cur_line_fields == 1 then
		return
	end
	for _, field in ipairs(next_line_fields) do
		field = strings.trim(field)
		if not (md_special_char_unescape(field).match('^:?%-+:?$/')) then
			return
		end
		if (strings.at(1) == ":" and strings.at(field, #field) ~= ":") then
			style_list[#style_list+1] = 'style="text-align=left"'
		elseif (strings.at(1) ~= ":" and strings.at(field, #field) == ":") then
			style_list[#style_list+1] = 'style="text-align=right"'
		elseif (strings.at(1) == ":" and strings.at(field, #field) == ":") then
			style_list[#style_list+1] = 'style="text-align=center"'
		else 
			style_list[#style_list+1] = 'style="text-align=left"'
		end
	end

	local text = obj.lines[obj.start] .. '\n' .. obj.lines[obj.start + 1]
	local content = cur_line .. '\n' .. next_line
	local htmlContent = "<table><thead><tr>"
	for _, field in ipairs(cur_line_fields) do
		field = strings.trim(field)
		htmlField = obj.md.line_parse(field)
		htmlContent = htmlContent .. "<th>" .. htmlField .. "</th>"
	end
	htmlContent = htmlContent .. "</tr></thead><tbody>"

	for i = obj.start + 2, #obj.lines do
		line = obj.lines[i]
		line = format_line(line)
		line_fields = strings.split(line, "|")
		if #line_fields ~= #cur_line_fields then
			break
		end

		htmlContent = htmlContent ..  "<tr>"
		for j, field in ipairs(line_fields) do
			field = strings.trim(field)
			htmlField = obj.md.line_parse(field)
			htmlContent = htmlContent .. "<td ".. style_list[j] ..">" .. htmlField .. "</td>"
		end
		htmlContent = htmlContent .. "</tr>"
		content = content .. "\n" .. line
		text = text .. "\n" .. obj.lines[i]
	end

	htmlContent = htmlContent .. "</tbody></table>"

	local table_render = obj.md.rule_render["table"]
	if table_render then
		htmlContent = table_render({md=obj.md, content=content, text=text}) or htmlContent
	end

	return {
		tag="table",
		content= content,
		text= text,
		htmlContent= htmlContent,
		start= obj.start,
		_end= i,
	}
end
--obj = {
	--start=1,
	--lines={"@# test", "@#@# dfsfds"},
	--md = {
		--rule_render={},
		--line_parse= function(text) return text  end,
	--}
--}
--header(obj)

function md:render(text)
	local lines = strings.split(text)
	local params, tokens, start = {}, {}, 1

	while (start < #lines) do
		params.start = start
		params.lines = lines
		params.md = self

		for i = 0, #self.block_rule_list, 1 do
			local block_rule = self.block_rule_list[i]
			local token = block_rule(params)
			if token then
				tokens[#tokens+1] = token
				start = token._end -1
				break
			end
			start = start + 1
		end
	end

	return tokens
end


return md
