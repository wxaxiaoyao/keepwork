<template>
	<div>
		<tag tagName="markdown"></tag>
		<tag tagName="modTest"></tag>
	</div>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

import tags from "../modeditor/tags.js";

import modTest from "../mods/modTest.js";

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
	},

	watch: {
	},

	methods: {
	},

	components:{
		modTest,
	},

	mounted(){
	}
}
</script>

