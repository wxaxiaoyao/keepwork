
<template>
	<div v-loading="isLoading">
		<div v-if="isPageExist">
			<page :text="text"></page>
		</div>
		<div v-else>
			用户页不存在
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import gitlab from "@/api/gitlab.js";
import {dataSource} from "@/api/keepwork.js";

import page from "../../bases/page.vue";
export default {
	name:"userpage",
	components: {
		page,
	},
	data: function() {
		return {
			text:"",
			isLoading:false,
			isPageExist:true,
		}
	},

	watch: {
	},

	computed: {
		...mapGetters({
			getDataSource:"dataSource/getDataSource",
		}),
	},

	methods: {
		...mapActions({
			loadTagMods: "mods/loadTagMods",
		}),
	},

	created() {
	},

	async mounted() {
		console.log("userpage");
		const self = this;
		const username = this.$route.params.username;
		const path = this.$route.path;
		const pagepath = decodeURIComponent(path) + g_app.config.pageSuffix;

		self.isLoading = true;

		const tasks = [];
		self.getDataSource(username) || tasks.push(dataSource.getDefaultDataSource({username:username}).then(ds => gitlab.initConfig(ds)));
		Promise.all(tasks).then(async function() {
			const content = await gitlab.getContent(pagepath).catch(function(e){
				self.isPageExist = false;
			});

			self.isLoading = false;
			self.text = content || "";
		});
	}
}
</script>
