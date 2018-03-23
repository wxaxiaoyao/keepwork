<template>
	<el-container>
		<el-aside width="20%">
			<left :rootTag="rootTag" v-on:addTag="addTag"></left>
			<!--<tagTree v-on:addTag="addTag"></tagTree>-->
		</el-aside>
		<el-container>
			<div class="split-strip"></div>
			<el-aside width="50%">
				<codemirror ref="codemirror" :value="code" :options="cmOptions" @input="onCmCodeChange"></codemirror>
			</el-aside>
			<div class="split-strip"></div>
			<el-main>
				<tag :tag="rootTag"></tag>
			</el-main>
		</el-container>
				<!--<tagNav :rootTag="rootTag" :tag="tag" v-on:selectTag="selectTag"></tagNav>-->
				<!--<tagEdit :tag="tag"></tagEdit>-->
	</el-container>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import {codemirror} from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/mode/markdown/markdown.js";
import markdownit from "markdown-it";

import left from "./left.vue";
import tagNav from "./tagNav.vue";
import tagEdit from "./tagEdit.vue";
import tagTree from "./tagTree.vue";

import tags from "../../modeditor/tags.js";
import adi from "../../bases/adi.js";

export default {
	name:"editor",
	data: function() {
		var tag = tags.getTag("div");
		//var tag = adi.setMod("ModTitle").getTag();
		return {
			code:`
An h1 header
============
Paragraphs are separated by a blank line.
2nd paragraph. *Italic*, **bold**, and \`monospace\`. Itemized lists
look like:
  * this one
  * that one
  * the other one
Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.
> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.
Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺
An h2 header
------------
Here's a numbered list:
 1. first item
 2. second item
 3. third item
Note again how the actual text starts at 4 columns in (4 characters
from the left side). Here's a code sample:
    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }
As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:
~~~
define foobar() {
    print "Welcome to flavor country!";
}
~~~
(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:
~~~python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
~~~
### An h3 header ###
Now a nested list:
 1. First, get these ingredients:
      * carrots
      * celery
      * lentils
 2. Boil some water.
 3. Dump everything in the pot and follow
    this algorithm:
        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)
    Do not bump wooden spoon or it will fall.
Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).
Here's a link to [a website](http://foo.bar), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header). Here's a footnote [^1].
[^1]: Footnote text goes here.
Tables can look like this:
size  material      color
----  ------------  ------------
9     leather       brown
10    hemp canvas   natural
11    glass         transparent
Table: Shoes, their sizes, and what they're made of
(The above is the caption for the table.) Pandoc also supports
multi-line tables:
--------  -----------------------
keyword   text
--------  -----------------------
red       Sunsets, apples, and
          other red or reddish
          things.
green     Leaves, grass, frogs
          and other things it's
          not easy being.
--------  -----------------------
A horizontal rule follows.
***
Here's a definition list:
apples
  : Good for making applesauce.
oranges
  : Citrus!
tomatoes
  : There's no "e" in tomatoe.
Again, text is indented 4 spaces. (Put a blank line between each
term/definition pair to spread things out more.)
Here's a "line block":
| Line one
|   Line too
| Line tree
and images can be specified like so:
![example image](example-image.jpg "An exemplary image")
Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:
$$I = \int \rho R^{2} dV$$
And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.
`,
			cmOptions: {
				tabSize:4,
				lineWrapping: true,
				lineNumbers: true,
				mode: "text/x-markdown",
				//theme:"lesser-dark",
				theme:"default",
			},
			fullscreen:true,
			value:true,
			mode:"editor",
			text:"",
			theme:"",
			tag:tag,
			rootTag:tag,
		}
	},
	computed: {
		...mapGetters({
			tagId: 'getTagId',
		}),
		codemirror() {
			return this.$refs.codemirror.codemirror;
		},
		tagHtml: function() {
			var tagHtmlStr = this.rootTag.html();
			//console.log(tagHtmlStr);
			var res = vue.compile(tagHtmlStr);
			return {
				//template: tagHtmlStr,
				props:['params'],
				created(){
					//console.log(this);
				},
				render: res.render,
				staticRenderFns: res.staticRenderFns,
			}
		},
		tagParams() {
			return this.rootTag.getParams();
		},
	},
	watch:{
		tagId:function(tagId) {
			var tag = this.rootTag.findById(tagId);
			if (tag) {
				this.tag = tag;
			}
		},
	},
	methods: {
		...mapActions({
			setTagId:'setTagId',
		}),
		onCmCodeChange(val) {
			console.log(val);
		},
		addTag(tag, node, nodeComp) {
			this.mode = "test";
			if (!tag.type) {
				return;
			}
			this.tag.addTag(tags.getTag(tag.type));	
		},
		selectTag(tag) {
			this.tag = tag;
			tag && this.setTagId(tag.tagId);
		},
		blur() {
			this.tagRebuild();
		},
		keyup(){
		},
		_delete(){
		},
		enter(){
			var self = this;
			var rootTag = this.rootTag;
			var selobj = getSelection();
			var tag = rootTag.findById(selobj.focusNode.parentElement.id);
			console.log(selobj);
			if (!tag || !tag.parentTag) {
				return;
			}
			var parentTag = tag.parentTag;
			var childTag = tags.getTag(tag.tagName);
			parentTag.addTag(childTag);
		},
		mouseup(){
			//console.log(getSelection());
		},
		tagRebuild() {
			// 删除不存在的tag
			var rootTag = this.rootTag;
			var deleteNotExistTag = function(tag) {
				var list = [];
				for (var i = 0; i < tag.children.length; i++) {
					var _tag = tag.children[i];
					if (document.getElementById(_tag.tagId)) {
						list.push(_tag);
					}
				}
				tag.children = list;
				for (var i = 0; i < tag.children.length; i++){
					var _tag = tag.children[i];
					deleteNotExistTag(_tag);
				}
			}

			deleteNotExistTag(rootTag);

			// 更新tag内容
			rootTag.each(function(tag){
				tag.innerHtmlChange && tag.innerHtmlChange();
			});
		},
	},
	mounted() {
		//this.rootTag.styles["min-height"]="40px";
		//console.log(this.rootTag);
		this.selectTag(this.rootTag);
		this.codemirror.setSize("100%", "100%");
	},
	created(){
		console.log(markdownit);
		var md = markdownit();
		var tokens = md.parse(this.code, {});
		console.log(tokens);
	},

	components: {
		codemirror,
		left,
		tagNav,
		tagEdit,
		tagTree,
	},
}
</script>

<style>
html,body, .el-container, .el-aside, .el-row, .el-col {
	height:100%;
}
html, body {
	margin: 0px;
}
.vue-codemirror {
	height:100%;
}
.el-container, .el-aside {
	overflow-y: hidden;
}


#editorContainer {
	height:100%;
}

.split-strip {
	height:100%;
	width: 5px;
	background-color:rgb(168,168,168);
	cursor: col-resize;
}
.CodeMirrorFold {
	background-color: #F5F5F5;
}
.CodeMirror-vscrollbar {
	overflow-y: hidden;
}
</style>
