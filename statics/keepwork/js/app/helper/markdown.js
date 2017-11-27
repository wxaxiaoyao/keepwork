
define([
    'helper/mdconf',
    'markdown-it',
], function (mdconf, markdownit) {


    function markdonw(options) {
        var md = {};

        options = options || {};
        // Enable HTML tags in source
        options.html = options.html == null ? true : options.html;
        // Autoconvert URL-like text to links
        options.linkify = options.linkify == null ? true : options.linkify;
        // Enable some language-neutral replacement + quotes beautification
        options.typographer = options.typographer == null ? true : options.typographer;
        // Convert '\n' in paragraphs into <br>
        options.breaks = options.breaks == null ? true : options.breaks;

        md.md = markdownit(options);
        md.editable = options.editable;
        md.setEditor = function(editor) {
            md.editor = editor;
        }
        
        md.render = function (text, theme) {
            
        }

        md.parseBlock = function (block, token) {
            var content = block.content;
            var isWikiBlock = token.type == "fence" && token.tag == "code" && /^\s*([\/@][\w_\/]+)/.test(token.info);

            block.isWikiBlock = isWikiBlock;
            if (!isWikiBlock) {
                block.htmlContent = '<div>' + md.md.render(content) + '</div>';
            } else {
                var wikiModNameRE = /^\s*@([\w]+)/;
                var modName = token.info.match(wikiModNameRE)[1];
                var modParams = undefined;
                try {
                    modParams = angular.fromJson(token.content)
                }
                catch (e) {
                    modParams = mdconf.mdToJson(token.content) || token.content;
                }
                // var tagName = modName[0].toLowerCase();
                // for (var i = 1; i < modName.length; i++) {
                //     if (modName[i] >= "A" && modName[i] <= "Z") {
                //         tagName += "-" + modName[i];
                //     } else {
                //         tagName += modName[i];
                //     }
                // }
                block.wikiBlock = {
                    // tagName:tagName,
                    modName: modName,
                    modParams: modParams,
                    isTemplate: modName == "template",
                };
            }

        }

        md.parse = function (text, theme) {
            theme = theme || "";
            text = theme + '\n' + text;

            var offsetLineCount = theme.split('\n').length;
            var textLineList = text.split('\n');
            var tokenList = md.parse(text, {});
            var blockList = [];
            var stack = 0;
            var maxValue = 99999999;
            var block = {
                textPosition: {from: maxValue, to: 0},
                htmlContent: '',
                content: '',
                info: '',
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

                if (stack == 0) {
                    for (var j = block.textPosition.from; j < block.textPosition.to; j++) {
                        block.content += textLineList[j] + '\n';
                    }
                    md.parseBlock(block.content, token);
                    blockList.push(block);
                    // 重置初始状态
                    block = {
                        textPosition: {from: maxValue, to: 0},
                        htmlContent: '',
                        content: '',
                    }
                }
            }
            md.blockList = blockList;
            return blockList;
        }
        return md;
    }



    return markdonw;
});