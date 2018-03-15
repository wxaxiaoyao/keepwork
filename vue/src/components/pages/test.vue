<template>
	<div>
		<wikiParent attr1="attr1" attr2="attr2" ></wikiParent>
		<wikiTag test="dsd">hello world</wikiTag>
		<wikiText :vars="vars"></wikiText>
		<wikiContainer ref="container">
			<wikiText></wikiText>
		</wikiContainer>
		<richtext></richtext>
		<el-container>
			<el-header>Header</el-header>
			<el-main>Main</el-main>
		</el-container>
	</div>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

import tag from "../common/tag.js";
import container from "../bases/container.vue";
import tags from "../modeditor/tags.js";
import tagContainer from "../common/tagContainer.js";

vue.component("wikiParent", {
	template:"<div><wikiChild v-bind='$attrs'></wikiChild></div>",
	inheritAttrs:false,
});

vue.component("wikiChild", {
	template:"<p><span>{{$data.test}}</span>hello world</p>",
	props:["attr1"],
	data:function() {
		return {
			tagName:"wiki-child",
			$test:"test",
		}
	},

	mounted:function(){
		//console.log(this);
	},

	//mixins: [tag],
})

export default {
	name:'test',
	data:function(){
		return {
		}
	},
	props:{
		vars:{
			type:Object,
			default:undefined,
		},
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
	
	//mixins: [tag, tagContainer],

	components:{
		container,
	},

	mounted(){
		//console.log(this);
	}
}
</script>

<style>
</style>
