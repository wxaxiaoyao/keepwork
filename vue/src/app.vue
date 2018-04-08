<template>
	<div id="app" class="appContiner">
		<component :is="appLayout">
		<kpHeader slot="header"></kpHeader>
		</component>
	</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import gitlab from "@/api/gitlab.js";
import {mod, keepworkEndpoint} from "@/api/keepwork.js";

import kpHeader from "./components/pages/common/header.vue";
import appLayout from "./components/pages/common/appLayout.js";

export default {
	name: 'app',
	data: function() {
		return {
			layouts: appLayout,
		}
	},

	components: {
		...appLayout,
		kpHeader,
	},

	computed: {
		...mapGetters({
			layout:"app/layout",
			token:"user/token",
			dataSources: "dataSource/dataSources",
		}),

		appLayout() {
			return this.layouts[this.layout];
		},
	},

	watch: {
		token: function(val) {
			this.setAPIToken();
		},
	},

	methods: {
		...mapActions({
			loadTagMods: "mods/loadTagMods",
		}),
		setAPIToken() {
			keepworkEndpoint.defaults.headers.common['Authorization'] = this.token;
		},
	},

	created() {
		const self = this;
		self.setAPIToken();
		self.loadTagMods();
		_.map(self.dataSources, (val) => gitlab.initConfig(val));
	},

	mounted() {
	},

}
</script>

<style>
html, body {
	margin: 0px;
	padding: 0px;
}
.appContiner {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	 -webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	height:100%;
}
.appContiner>.el-container,.el-main {
	padding:0px;
	height: 100%;
}
.full-height {
	height: 100%;
}
.container {
	max-width:1200px;
	margin-right: auto;
	margin-left: auto;
}

.kp_forbit_copy {
	-moz-user-select: none;  
	-webkit-user-select: none;  
	-ms-user-select: none;
	user-select: none;
}

</style>
