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
import {mapActions, mapGetters} from "vuex";

export default {
	name:'test',
	data:function(){
		return {
		}
	},

	computed: {
	},

	watch: {
		getCurrentTag: function(val, oldVal) {
			console.log(val);
		},
	},

	methods: {
	},
	
	mixins: [tag],

	components:{
		container,
	},

	mounted(){
		console.log(this);
	}
}
</script>

<style>
</style>
