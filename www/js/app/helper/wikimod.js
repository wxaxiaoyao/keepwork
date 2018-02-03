
define([
	"app",
], function(app) {
	var wikimod = {};
	var wikimods = [];

	wikimods.push({
		showname: "模板",
		modName: "template",
		cmdName: "template",
		text:'```@template\n```',
	});

	wikimods.push({
		showname: "TOC",
		modName: "toc",
		cmdName: "toc",
		text:'```@toc\n```',
	});


	// 获取wikimod列表
	wikimod.getWikimods = function(){
		return wikimods;
	}
	
	wikimod.getWikimod = function(cmdName) {
		for (var i = 0; i < wikimods.length; i++) {
			var mod = wikimods[i];
			if (mod.cmdName == cmdName) {
				return mod;
			}
		}

		return undefined;
	}

	// 加载mod
	wikimod.loadWikiMod = function(params, success, error) {
		var self = this;
        var defaultModPath = "wikimod/";
        var requireUrl = params.cmdName;
		var cmdName = params.cmdName;

		if (!self.getWikimod(cmdName)) {
			error && error();
			return;
		}

        if (params.cmdName == params.modName) {
            requireUrl = defaultModPath + params.modName + "/index";
		} else {
			requireUrl = defaultModPath + params.cmdName;
		}

		//console.log("加载mod:", requireUrl);

		//block.blockUrl = requireUrl;  // 暂时以cmdName标识唯一模块
        require([requireUrl], function (mod) {
            success && success(mod);
        }, function () {
            error && error();
        });
	}

	return wikimod;
});
