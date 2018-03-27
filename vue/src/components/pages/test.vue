<template>
	<div>
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
		...mapGetters({
			key:"test/key",
		}),
	},

	watch: {
	},

	methods: {
		...mapActions({
			setKey:"test/setKey",
		}),
	},

	components:{
		modTest,
	},

	mounted(){
		if (this.key) {
			console.log(this.key);
			this.setKey("test");
		} else {
			console.log("set key");
			this.setKey("hello world");
		}
	}
}
</script>

