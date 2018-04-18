<template>
	<el-container>
		<el-header>
			<slot name="header"></slot>
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
export default {
	name:"headerMainFooterLayout"
}
</script>

<style scoped>
.el-container>.el-header,.el-main,.el-footer{
	padding:0px;
}
</style>
