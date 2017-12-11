
local mdwiki = require("md/mdwiki")
local mdconf = require("md/mdconf")
--mdconf.test()

mdwiki.test();
print(mdwiki:render("# test \n ```@wiki\n```"))
