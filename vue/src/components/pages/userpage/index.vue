
<template>
	<div v-loading="isLoading">
		<div v-if="isPageExist">
			<markdown :text="text"></markdown>
		</div>
		<div v-else>
			用户页不存在
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import gitlab from "@/api/gitlab.js";

import markdown from "../../bases/markdown.vue";
export default {
	name:"userpage",
	components: {
		markdown,
	},
	data: function() {
		return {
			text:"",
			isLoading:false,
			isPageExist:true,
		}
	},

	methods: {
		...mapActions({
			loadUserDefaultDataSource: "user/loadUserDefaultDataSource",
			loadTagMods: "mods/loadTagMods",
		}),
	},

	async created() {
		await this.loadTagMods();
	},

	async mounted() {
		console.log(this.$route);
		const self = this;
		const username = this.$route.params.username;
		const path = this.$route.fullPath;
		const pagepath = decodeURIComponent(path) + g_app.config.pageSuffix;

		const content = await gitlab.getContent(pagepath).catch(function(e){
			self.isPageExist = false;
		});

		self.text = content || "";
		//const dataSources = await this.loadUserDefaultDataSource(username); 

	}
}
</script>
