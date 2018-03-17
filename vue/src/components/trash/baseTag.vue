<template>
	<component :is="component" :tag="tag" v-bind="$attrs" v-on="$listeners">
		<slot></slot>
	</component>
</template>

<script>
import vue from "vue";

export default {
	name:"baseTag",
	data:function() {
		return {
			tagName:"baseTag",
		};
	},
	props:{
		realTagName:{
			type:String,
		},
		tag: {
			type:Object,
		},
	},
	inheritAttrs:false,
	computed: {
		component() {
			var realTagName = this.realTagName || this.tag.attrs["realTagName"] || "div";
			var html = '<' + realTagName + '><slot></slot><component v-for="x in tag.children" v-if="!isExist(x)" :tag="x" :is="x.tagName"></component></' + realTagName + '>';
			var res = vue.compile(html);
			console.log(html);
			return {
				props:["tag"],
				render:res.render,
				staticRenderFns:res.staticRenderFns,

				methods: {
					isExist(x) {
						for (var i = 0; i < this.$children.length; i++) {
							var child = this.$children[i];

							if (this.tag.tagId == x.tagId) {
								return true;
							}

							if (child.tag && child.tag.tagId == x.tagId) {
								return true;
							}
						}

						return false;
					}
				}
			};
		}
	},
	watch:{
		
	},
	methods: {
	},
	mounted() {
	},
	created(){
		//console.log(this.tagName);
	}
}
</script>
