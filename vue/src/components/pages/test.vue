<template>
	<div>
		<tag tagName="modTest"></tag>
	</div>
</template>

<script>
import vue from "vue";
import { createNamespacedHelpers  } from 'vuex'

import gitlab from "../../api/gitlab.js";
import tags from "../modeditor/tags.js";

import modTest from "../mods/modTest.js";

const {mapActions, mapGetters} = createNamespacedHelpers("gitlab");

const projectId = 4980659;

export default {
	name:'test',
	data:function(){
		return {
			test:"test",
		}
	},
	props:{
	},
	computed: {
		...mapGetters({
			trees:"trees",
		}),
		tree: function() {
			var tree = this.trees[projectId];
			return tree;
		}
	},

	watch: {
		tree: function(val) {
			console.log(val);
		}
	},

	methods: {
		...mapActions({
			setTree:"setTree",
		}),
	},

	components:{
		modTest,
	},

	mounted(){
		this.setTree({projectId:4980659, path:"xiaoyao"});
	}
}
</script>

