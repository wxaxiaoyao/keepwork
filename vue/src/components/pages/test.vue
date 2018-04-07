<template>
	<div>
		hello world
	</div>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

import tags from "../modeditor/tags.js";
import modTest from "../mods/modTest.js";

import mods from "../adi/mod/index.js";
import tagLogin from "../bases/tagLogin.vue";
import {user} from "../../api/keepwork.js";
export default {
	name:'test',
	data:function(){
		return {
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
	},

	async mounted(){
		const data = await user.isLogin();
		console.log(data);
	}
}
</script>

