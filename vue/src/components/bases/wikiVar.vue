<template>
	<component :is="htmlFunc" :params="params"></component>
</template>


<script>
import vue from "vue";
import text from "../common/text.js";

export default {
	name:"wikiVar",
	data:function() {
		return {
			lastTag:"div",
		};
	},
	computed: {
		htmlFunc(){
			var tagList = ["h1", "h2", "h3", "h4", "h5", "h6", "div", "p", "span"];
			var index = tagList.length;
			var tag = this.params.tag.text;
			for (var i = 0; i < tagList.length; i++) {
				if (tag == tagList[i]) {
					index = i;
					break;
				}
			}
			
			if (index == tagList.length) {
				tag = this.lastTag;
			}
			this.lastTag = tag;

			var html = '<' + tag + ' @blur="blur" @focus="focus" @keyup="keyup" @keyup.enter="enter" v-html="params.text.text" :style="_style"></' + tag + '>';
			var res = vue.compile(html);
			return {
				props:["params"],
				mixins:[text],
				render:res.render,
				staticRenderFns:res.staticRenderFns,
			}
		}
	},
	//props:["params"],
	props:{
		params:{
			type:Object,
			default: function() {
				return {
					text: {
						text:"文本组件",
					},
					tag: {
						text:"div",
					},
				};
			},
		},
	},
	watch:{
	},
	methods: {
	},
	mounted() {
	}
}
</script>

<style scoped>
</style>
