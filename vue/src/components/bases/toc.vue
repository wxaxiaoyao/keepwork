
<template>
	<div>
		<div v-for="(header, index) in headers" :key="index" class="headerContainer" :class="classes(header, index)">
			<a @click="clickHeaderBtn(header, index)" :href='"#" + header.content'>{{header.content}}</a>
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import md from "@/lib/markdown";

export default {
	name: "toc",

	data: function() {
		return {
			index:null,
		}
	},

	props: {
		text: {
			type:String,
			default:"",
		},
	},

	computed: {
		...mapGetters({
			pageContent: 'getPageContent',
		}),
		headers() {
			const text = this.text || this.pageContent;
			const tokens = md.md.parse(text);
			const headers = tokens.filter(token => /^[hH][1-6]$/.test(token.tag));
			return headers;
		}
	},

	methods: {
		classes(header, index) {
			return header.tag + (this.index == index ? " active" : "");
		},
		clickHeaderBtn(header, index) {
			this.index = index
		},
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
