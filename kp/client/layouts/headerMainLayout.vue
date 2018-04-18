<template>
	<el-container>
		<el-header>
			<slot name="header"></slot>
		</el-header>
		<el-main>
			<nuxt/>
		</el-main>
	</el-container>
</template>

<script>
export default {
	name:"headerMainLayout"
}
</script>

<style scoped>
.el-container>.el-header,.el-main,.el-footer{
	padding:0px;
}
</style>
