<template>
	<el-container>
		<el-header>
			<Header></Header>
		</el-header>
		<el-main>
			<nuxt/>
		</el-main>
	</el-container>
</template>

<script>
import Header from "../components/views/header.vue";
export default {
	name:"headerMainLayout",
	components: {
		Header,
	},
}
</script>

<style scoped>
.el-container, .el-main {
	height:100%;
}
.el-container>.el-header,.el-main,.el-footer{
	padding:0px;
}
</style>
