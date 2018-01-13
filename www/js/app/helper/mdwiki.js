
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
		var encodeMdName = encodeURI(mdName);
		var templateContent = '<div ng-repeat="$kp_block in $kp_block.blockList track by $index" ng-if="!wikiBlock.isTemplate"><wiki-block-container data-params="' + encodeMdName +'"></wiki-block-container></div>';
		var blankTemplateContent = '<div class="container">' + templateContent + '</div>';
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
				$("#" + md.containerId).html($compile('<wiki-block-container data-template="true" data-params="' + encodeMdName + '"></wiki-block-container>')($scope));
				md.isBindContainer = true;
			}
		}

		md.renderMod = function(){
			for (var i = 0; i < md.template.blockList.length; i++) {
				var block = md.template.blockList[i];

				if (block.renderMod) {
					block.renderMod();
				}
			}
		}
        // 渲染
        md.render = function (text, theme) {
            md.parse(text, theme);

			if (md.template.renderMod) {
				md.template.renderMod();
			} else {
				md.template.$apply && md.template.$apply();
			}

			md.bindContainer();
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

				block.render = function(htmlContent) {
					var self = this;
					self.isRender = true;
					if (self.isTemplate) {
						md.template.htmlContent = htmlContent;
						md.template.$scope && md.template.$scope.$apply();
					} else {
						self.htmlContent = htmlContent;
						self.$scope && self.$scope.$apply();
					}
				}

				block.renderMod = function(success, error) {
					var self = this;
					self.isRender = false;
					loadMod(self, function (mod) {
						if (!self.$scope) {
							error && error();
							return;
						}
						self.wikimod = mod;
						var htmlContent = undefined;
						if (typeof(mod) == "function") {
							htmlContent = mod(self);	
						} else if(typeof(mod) == "object") {
							htmlContent = mod.render(self);
						} else {
							htmlContent = mod;
						}
						if (!self.isRender) {
							self.render(htmlContent);	
						}

						success && success();
					}, function () {
						console.log("加载模块" + block.modName + "失败");
						error && error();
					});
				}

				block.renderMod();
            }
        }

        md.parse = function (text, theme) {
			theme = theme || "";
			text = theme + '\n' + text;
			themeLineCount = theme.split("\n").length;

            var tokenList = md.md.parse(text);
            var blockList = md.template.blockList;
			var template = undefined;
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
				if (block.isTemplate) {
					template = block;
				}
            }

			var size = blockList.length;
			for (var i = tokenList.length; i < size; i++) {
				blockList.pop();
			}

			if (template) {
				md.template.modName = template.modName;
				md.template.cmdName = template.cmdName;
				md.template.modParams = template.modParams;
				md.template.render = template.render;
				md.template.renderMod = template.renderMod;
			} else {
				md.template.modName = undefined;
				md.template.cmdName = undefined;
				md.template.modParams = undefined;
				md.template.render = undefined;
				md.template.renderMod = undefined;
				md.template.htmlContent = blankTemplateContent;
			}
			//console.log(blockList);
            return blockList;
        }

        return md;
    }

    return mdwiki;
})
