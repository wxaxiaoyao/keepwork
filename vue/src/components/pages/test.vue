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

import mods from "../adi/mod/index.js";

import {user} from "../../api/keepwork.js";
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
			setSystemMods: "mods/setSystemMods",
			submitSystemMods: "mods/submitSystemMods",
		}),
	},

	components:{
		modTest,
	},

	async mounted(){
		const data = await user.login({username:"xiaoyao", password:"wuxiangan"});
		console.log(data);
	}
}
</script>

