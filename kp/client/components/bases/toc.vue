
<template>
	<div>
		<div v-for="(header, index) in headers" :key="index" v-if="isShow(header)" class="headerContainer" :class="classes(header, index)">
			<a @click="clickHeaderBtn(header, index)" :href='"#" + header.text'>{{header.text}}</a>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import {mapActions, mapGetters} from "vuex";

import md from "../../lib/markdown";

export default {
	name: "toc",

	data: function() {
		return {
			index:null,
			vars: {
				text:"",
				navlist:[
				{
					text:"标题",
					level:2,
				},
				{
					text:"子标题",
					level:3,
				},
				],
				startLevel:1,
				endLevel:6,
				useMainContent:false,
			}
		}
	},

	props: {
		options: {
			type:Object,
			default: () => {},
		},
	},

	computed: {
		...mapGetters({
			pageContent: 'getPageContent',
		}),
		headers() {
			const text = this.vars.useMainContent ? this.pageContent : this.vars.text;
			if (!text) {
				return this.vars.navlist;
			}

			const tokens = md.md.parse(text);
			const headers = tokens.filter(token => /^[hH][1-6]$/.test(token.tag));
			const navlist = [];
			_.each(headers, header => {
				navlist.push({
					level: _.toNumber(header.tag.substring(1)),
					text: header.content,
				});
			})
			return navlist;
		}
	},

	methods: {
		isShow(header) {
			const level = header.level;
			if (this.vars.startLevel <= level && level <= this.vars.endLevel) {
				return true;
			}
			return false;
		},
		classes(header, index) {
			return "h" + header.level + (this.index == index ? " active" : "");
		},
		clickHeaderBtn(header, index) {
			this.index = index
		},
	},

	created() {
		_.merge(this.vars, this.options);
	},
}

</script>

<style scoped>
.headerContainer {
	font-size:14px;
}
.headerContainer a {
	text-decoration:none;
}
.headerContainer.active {
	background-color:gray;
}
.h1 {
	padding-left:4px;
	font-size:20px;
}
.h2 {
	padding-left:24px;
	font-size:18px;
}
.h3 {
	padding-left:44px;
	font-size:16px;
}
.h4 {
	padding-left:64px;
}
.h5 {
	padding-left:84px;
}
.h6 {
	padding-left:104px;
}
</style>
