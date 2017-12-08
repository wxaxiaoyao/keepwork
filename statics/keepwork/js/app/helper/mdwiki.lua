
local mdconf = require("mdconf")
local md = require("md")

local wiki_mod_path = ""

md:register_rule_render("pre", function(obj)
	local text = obj.md.md_special_char_unescape(obj.text)
	local content = obj.md.md_special_char_unescape(obj.content)
	local line = text.split("\n")[1]
	local cmdName = line.match('^```@([%w_/]+)')
	if not cmdName then
		return
	end

	local modName = cmdName.split('/')[1]
	local modParams = mdconf.mdToJson(content)
	local mod = { modName=modName, cmdName=cmdName, modParams=modParams }

	local mod_obj = require(wiki_mod_path .. modName .. "/index")

	if type(mod_obj) == "table" and type(mod_obj.render) == "function" then
		return mod_obj:render(mod)
	end
	print(mod_obj)
	console.log(mod_obj)
	return
end)

local html = md:render([[
[百度](http://www.baidu.com)
```@test/js/test
helloworld 
```
]])

print(html)
