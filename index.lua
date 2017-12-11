
--local mdwiki = require("md/mdwiki")

-- 业务代码开始
--nws.router("/", function(ctx)
	--ctx.response:render("index.html", {});
	----ctx.response:send(mdwiki:render("# test this  \n`@wiki`"))
--end)

nws.router.default_handler = function(ctx) 
	ctx.response:render("index.html", {});
end


