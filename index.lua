
local mdwiki = require("md/mdwiki")

-- 业务代码开始
nws.router("/", function(ctx)
	--ctx.response:render("index.html", {message="Hello world"})
	ctx.response:send(mdwiki:render("# test this  \n`@wiki`"))
end)


