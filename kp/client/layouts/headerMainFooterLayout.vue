<template>
	<el-container>
		<el-header>
			<Header></Header>
		</el-header>
		<el-main>
			<router-view></router-view>
		</el-main>
		<el-footer>
			<slot name="footer"></slot>
		</el-footer>
	</el-container>
</template>

<script>
import Header from "@/components/views/header.vue";

export default {
	name:"headerMainFooterLayout",

	components: {
		Header,
	},
}
</script>

<style scoped>
.el-container>.el-header,.el-main,.el-footer{
	padding:0px;
}
</style>
