<template>
	<div>
		<container ref="container">
			hello world
		</container>
		<richtext></richtext>
		<el-container>
			<el-header>Header</el-header>
			<el-main>Main</el-main>
		</el-container>
	</div>
</template>

<script>
import vue from "vue";
import tag from "../common/tag.js";
import container from "../bases/container.vue";
import tags from "../modeditor/tags.js";

export default {
	name:'test',
	data:function(){
		console.log("----------");
		return {
			count:2,
		}
	},
	mixins: [tag],

	components:{
		container,
	},

	mounted(){
		console.log(this.$store.state);
		this.count--;
		console.log(this);
		if (this.count < 1) {
			return;
		}
		//var tag = tags.getTag("div");
		//tag.setTagName("richtext");
		//this.$refs.container.kp_tag.addTag(tag);
	}
}
</script>

<style>
</style>
