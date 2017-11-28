
define([
    'app',
    'helper/mdconf',
    'markdown-it',
], function (app, mdconf, markdownit) {
    var instCount = 0;
    var mds = {};
    // 获取md
    function getMd(mdName) {
        mds[mdName] = mds[mdName] || {};
        return mds[mdName];
    }

    // 加载mod
    function loadMod(block, cb, errcb) {
        var defaultModPath = "js/mod/wiki/js/";
        var requireUrl = block.cmdName;

        if (block.cmdName == block.modName) {
            requireUrl = defaultModPath + block.modName;
        }

        require([requireUrl], function (mod) {
            cb && cb(mod);
        }, function () {
            errcb && errcb();
        });
    }

    function extendBlock(md, block, $scope) {
        block.$scope = $scope;
        if (md.editable && block.isTemplate) {
            $scope.$kp_block = md.template;
        } else {
            $scope.$kp_block = block;
        }

        if (!md.editable || !md.editor) {
            return;
        }

        block.applyModParams = function(modParams) {
            var pos = block.textPosition;
            modParams = modParams || {};
            //console.log(modParams);
            if (typeof(modParams) == "object") {
                //modParams = angular.toJson(modParams, 4);
                modParams = mdconf.jsonToMd(modParams);
            }
            editor.replaceRange(modParams + '\n', {line: pos.from + 1, ch: 0}, {
                line: pos.to - 1,
                ch: 0
            });
        }
    }

    // 定义扩展指令
    app.registerDirective("wikiBlock", ['$compile', function ($compile) {
        return {
            restrict:'E',
            controller: ['$scope', '$attrs', function ($scope, $attrs) {
                console.log($scope);
                console.log($attrs);
                var block = undefined;
                try {
                    block = $attrs.params && angular.fromJson(decodeURI($attrs.params));
                } catch(e) {
                    block = $scope.$eval($attrs.params);
                }
                if(!block) {
                    return;
                }

                var md = getMd(block.mdName);
                extendBlock(md, block, $scope);

                console.log($scope);
                // 不是wiki block 直接渲染
                if (block.htmlContent) {
                    $scope.$kp_wiki_block_content = block.htmlContent;
                    return;
                }
                // wiki render
                if (block.isWikiBlock) {
                    loadMod(block, function (mod) {
                        $scope.$kp_wiki_block_content = mod.render(block);
                        $scope.$apply();
                    }, function () {
                        console.log("加载模块" + wikiBlock.modName + "失败");
                    });
                }
            }],
            link: function ($scope, $element) {
                $scope.$watch('$kp_wiki_block_content', function (newVal) {
                    $element.html(newVal);
                    $compile($element.contents())($scope);
                });
            }
        };
    }]);

    // md 构造函数
    function markdonw(options) {
        var mdName = "md" + instCount++;
        var md = getMd(mdName);

        options = options || {};
        // Enable HTML tags in source
        options.html = options.html == null ? true : options.html;
        // Autoconvert URL-like text to links
        options.linkify = options.linkify == null ? true : options.linkify;
        // Enable some language-neutral replacement + quotes beautification
        options.typographer = options.typographer == null ? true : options.typographer;
        // Convert '\n' in paragraphs into <br>
        options.breaks = options.breaks == null ? true : options.breaks;

        md.mdName = mdName;
        md.md = markdownit(options);
        md.editable = options.editable;
        md.containerId = options.containerId;
        md.editor = options.editor;
        md.$scope = options.$scope;

        md.setEditor = function(editor) {
            md.editor = editor;
        }

        // 获取默认模板
        md.getDefaultTemplate = function () {
            return {
                isTemplate: true,
                isWikiBlock: true,
                htmlContent:'<div><div ng-repeat="wikiBlock in $kp_block.blockList track by $index"><wiki-block data-params="wikiBlock"></wiki-block></div></div>'
            };
        }

        // 渲染
        md.render = function (text, theme) {
            var blockList = md.parse(text, theme);
            var template = md.getDefaultTemplate();
            var list = [];
            var old_template = md.template;
            for (var i = 0; i < blockList.length; i++) {
                if (blockList[i].isWikiBlock && blockList[i].isTemplate) {
                    template = blockList[i];
                } else {
                    list.push(blockList[i]);
                }
            }

            template.templateContent = '<div ng-repeat="wikiBlock in $kp_block.blockList track by $index"><wiki-block data-params="wikiBlock"></wiki-block></div>';
            // template.htmlContent = '<div>' + template.templateContent + '</div>';
            template.blockList = list;
            template.mdName = md.mdName;

            md.template = template;

            if (!md.containerId) {
                return '<wiki-block data-params="' + encodeURI(angular.toJson(template)) + '"></wiki-block>';
            }

            loadMod(template, function (mod) {
                var templateHtmlContent = mod(template);
                // 切换模板需要重新编辑
                if (!old_template || old_template.htmlContent != templateHtmlContent) {
                    var $compile = app.ng_objects.$compile;
                    var $scope = md.$scope || app.ng_objects.$rootScope;
                    $('#' + md.containerId).html($compile(templateHtmlContent)($scope));
                    setTimeout(function () {
                        $scope.$apply();
                    });
                }
            })
        }

        // md.bind
        md.parseBlock = function (block, token) {
            var content = block.content;
            var isWikiBlock = token.type == "fence" && token.tag == "code" && /^\s*([\/@][\w_\/]+)/.test(token.info);

            block.isWikiBlock = isWikiBlock;
            if (!isWikiBlock) {
                block.htmlContent = md.md.render(content);
            } else {
                var wikiCmdRE = /^\s*([\/@][\w_\/]+)/;
                var wikiModNameRE = /^[\/@]+([\w_]+)/;
                var cmdName = token.info.match(wikiCmdRE)[1];
                var modName = cmdName.match(wikiModNameRE)[1];
                var modParams = undefined;
                try {
                    modParams = angular.fromJson(token.content)
                }
                catch (e) {
                    modParams = mdconf.mdToJson(token.content) || token.content;
                }

                block.modName = modName;
                block.cmdName = cmdName.substring(1);
                block.modParams = modParams;
                block.isTemplate = modName == "template";
            }
        }

        md.parse = function (text, theme) {
            theme = theme || "";
            text = theme + '\n' + text;
            var offsetLineCount = theme.split('\n').length;
            var textLineList = text.split('\n');
            var tokenList = md.md.parse(text, {});
            var blockList = [];
            var stack = 0;
            var maxValue = 99999999;
            var block = {
                textPosition: {from: maxValue, to: 0},
                content: '',
            }
            for (var i = 0; i < tokenList.length; i++) {
                var token = tokenList[i];
                if (token.type.indexOf('_open') >= 0) {
                    stack++;
                }
                if (token.type.indexOf('_close') >= 0) {
                    stack--;
                }
                block.tag = token.tag || block.tag;
                // 获取文本位置
                block.textPosition.from = block.textPosition.from == maxValue && token.map ? token.map[0] : block.textPosition.from;
                block.textPosition.to = token.map ? token.map[1] : block.textPosition.to;
                block.mdName - md.mdName;

                if (stack == 0) {
                    for (var j = block.textPosition.from; j < block.textPosition.to; j++) {
                        block.content += textLineList[j] + '\n';
                    }
                    block.textPosition.from -= offsetLineCount;
                    block.textPosition.to -= offsetLineCount;
                    md.parseBlock(block, token);
                    blockList.push(block);
                    // 重置初始状态
                    block = {
                        textPosition: {from: maxValue, to: 0},
                        content: '',
                    }
                }
            }
            return blockList;
        }

        return md;
    }

    return markdonw;
});