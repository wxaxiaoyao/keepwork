<template>
	<div>
		hello world
		<toc :text="text"></toc>
	</div>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

import {tags} from "@/lib/tags";
import modTest from "../mods/modTest.js";

import mods from "../adi/mod/index.js";
import tagLogin from "../bases/tagLogin.vue";
import {user} from "../../api/keepwork.js";

import toc from "../bases/toc.vue";
export default {
	name:'test',
	data:function(){
		return {
			text:`# test\n hellowrld \n## header2 \n this is test`,
		}
	},
	props:{
	},
	computed: {
		...mapGetters({
		}),
	},

	watch: {
	},

	methods: {
		...mapActions({
		}),
		submitLoginForm() {
			this.$refs.loginForm.validate(function(valid){
				console.log(valid);
				if (!valid) {
					console.log("invalid");
					return;
				}
			});
		}
	},

	components:{
		tagLogin,
		toc,
	},

	async mounted(){
		const data = await user.isLogin();
		console.log(data);
	}
}
</script>

