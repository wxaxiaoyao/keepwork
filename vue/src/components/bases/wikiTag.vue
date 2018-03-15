<template>
	<component :is="component" :tag="tag"></component>
</template>

<script>
import vue from "vue";

export default {
	name:"wikiTag",
	data:function() {
		return {
		};
	},
	props:{
		tagName:{
			type:String,
			default:"div",
		},
		tag: {
			type:Object,
		},
	},
	computed: {
		component() {
			var html = '<' + this.tagName + '><slot></slot><component v-for="x in tag.children" v-if="!isExist(x)" :tag="x" :is="x.tagName"></component></' + this.tagName + '>';
			var res = vue.compile(html);
			return {
				props:["tag"],
				render:res.render,
				staticRenderFns:res.staticRenderFns,
			};
		}
	},
	watch:{
		
	},
	//props:["params"],
	methods: {
		isExist(x) {
			for (var i = 0; i < this.$children.length; i++) {
				var child = this.$children[i];
				if (child.tag && child.tag.tagId == x.tagId) {
					return true;
				}
			}

			return false;
		}
	},
	mounted() {
	},
	created(){
		//console.log(this.tagName);
	}
}
</script>
