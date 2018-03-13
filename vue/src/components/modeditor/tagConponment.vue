
<template>
	<div>
		<component :is="tagHtml" :params="tagParams">
		<tagConponment v-for="x in tag.children" :tag="x"></tagConponment>
		</component>
	</div>
</template>

<script>

import vue from "vue";

export default {
	name:"tagConponment",
	
	props:["tag"],

	computed:{
		tagHtml() {
			var tagHtmlStr = this.tag.html({
				innerHtml:"<slot></slot>",
			});
			console.log(tagHtmlStr);
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
			console.log(this.tag,this.tag.vars);
			return this.tag.getParams();
		},
	},
	components:{
		tagConponment:this,
	}
}
</script>
