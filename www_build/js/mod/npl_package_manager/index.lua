
local wikimod_name = "npl_package_manager"
local wikimod_path = nws.config.wikimod_path .. wikimod_name .. "/"

local controller_path = nws.config.wikimod_path .. wikimod_name .. "/controller/"
local api_url_prefix = nws.config.api_url_prefix .. "wikimod/" .. wikimod_name .. "/"

local package = nws.import(controller_path .. "package")

nws.router(api_url_prefix .. "package", package)


nws.log("load npl_package_manager module")
