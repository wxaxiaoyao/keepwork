
define([
    'app',
	"helper/md/mdconf",
	"helper/md/md",
	'directive/wikiBlock',
	'directive/wikiBlockContainer',
], function(app, mdconf, markdown){
    app.objects.mds = {};
    var instCount = 0;
	var mds = app.objects.mds;
    // 获取md
    function getMd(mdName) {
		//return app.get('app.md.' + mdName);
		mds[mdName] = mds[mdName] || {};
		return mds[mdName];
    }

    // 加载mod
    function loadMod(block, cb, errcb) {
        var defaultModPath = "wikimod/";
        var requireUrl = block.cmdName;

        if (block.cmdName == block.modName) {
            requireUrl = defaultModPath + block.modName + "/index";
		} else {
			requireUrl = defaultModPath + block.cmdName;
		}

        require([requireUrl], function (mod) {
            cb && cb(mod);
        }, function () {
            errcb && errcb();
        });
    }

    // md 构造函数
    function mdwiki(options) {
		options = options || {};

        var mdName = "md" + instCount++;
		var templateContent = '<div ng-repeat="$kp_block in $kp_block.blockList track by $index" ng-if="!wikiBlock.isTemplate"><wiki-block-container data-params="$kp_block"></wiki-block-container></div>';
		var $compile = app.ng_objects.$compile;
		var $scope = options.$scope || app.ng_objects.$rootScope;
        var md = getMd(mdName);

        md.mdName = mdName;
        md.md = markdown(options);
        md.editable = options.editable;
        md.containerId = options.containerId;
        md.editor = options.editor;
        md.$scope = options.$scope;
		md.isBindContainer = false;

		md.template = {
			mdName: mdName,
			isTemplate: true,
			isWikiBlock: true,
			templateContent:templateContent,
			htmlContent: "<div>" + templateContent + "</div>",
			blockList:[],
		}

        md.setEditor = function(editor) {
            md.editor = editor;
        }

		md.bindContainer = function() {
			if (!md.isBindContainer && md.containerId && $('#' + md.containerId)) {
				$("#" + md.containerId).html($compile('<wiki-block-container data-template="true" data-params="' + encodeURI(md.mdName) + '"></wiki-block-container>')($scope));
				md.isBindContainer = true;
			}
		}

        // 渲染
        md.render = function (text, theme) {
            var blockList = md.parse(text, theme);
            var list = [];
			var template = undefined;
            for (var i = 0; i < blockList.length; i++) {
                if (blockList[i].isWikiBlock && blockList[i].isTemplate) {
                    template = blockList[i];
                } else {
                    list.push(blockList[i]);
                }
            }

            //md.template.blockList = list;
			if (template) {
				md.template.htmlContent = template.htmlContent;
				md.template.modName = template.modName;
				md.template.cmdName = template.cmdName;
				md.template.modParams = template.modParams;
			} else {
				md.template.htmlContent = '<div class="container">' + templateContent + '</div>';
			}

			md.bindContainer();

			md.template.$apply && md.template.$apply();
			return '<wiki-block-container data-template="true" data-params="' + encodeURI(md.mdName) + '"></wiki-block-container>';
        }

        // md.bind
        md.parseBlock = function (block, token) {
            var content = token.content;
			var text = token.text;
			var line = text.split("\n")[0];
            var isWikiBlock = token.tag == "pre"  && /^```@([\w_\/]+)/.test(line);

            block.isWikiBlock = isWikiBlock;
            if (!isWikiBlock) {
                block.htmlContent = token.htmlContent;
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

				block.htmlContent = '<div></div>';
                block.modName = modName;
                block.cmdName = cmdName;
                block.modParams = modParams;
                block.isTemplate = modName == "template";
				block.templateContent = block.isTemplate ? templateContent : undefined;

				if (typeof(block.modParams) == "string" && !block.modParams.trim()) {
					block.modParams = undefined;
				}

				block.isRender = false;
				block.render = function(htmlContent) {
					block.isRender = true;
					if (block.isTemplate) {
						md.template.htmlContent = htmlContent;
						md.template.$scope && md.template.$scope.$apply();
					} else {
						block.htmlContent = htmlContent;
						block.$scope && block.$scope.$apply();
					}
				}

				loadMod(block, function (mod) {
					var htmlContent = undefined;
					if (typeof(mod) == "function") {
						htmlContent = mod(block);	
					} else if(typeof(mod) == "object") {
						htmlContent = mod.render(block);
					} else {
						htmlContent = mod;
					}
					if (!block.isRender) {
						block.render(htmlContent);	
					}
				}, function () {
					console.log("加载模块" + block.modName + "失败");
				});
            }
        }

        md.parse = function (text, theme) {
			theme = theme || "";
			text = theme + '\n' + text;
			themeLineCount = theme.split("\n").length;

            var tokenList = md.md.parse(text);
            var blockList = md.template.blockList;
            for (var i = 0; i < tokenList.length; i++) {
                var token = tokenList[i];
				var block = blockList[i] || {};

				block.token = token;
				block.mdName = mdName;
				if (block.text != token.text) {
					block.text = token.text;
					md.parseBlock(block, token);
				}
				block.token.start = block.token.start - themeLineCount;
				block.token.end = block.token.end - themeLineCount;
				blockList[i] = block;
				//console.log(blcok);
            }

			var size = blockList.length;
			for (var i = tokenList.length; i < size; i++) {
				blockList.pop();
			}
			//console.log(blockList);
            return blockList;
        }

        return md;
    }

    return mdwiki;
})
