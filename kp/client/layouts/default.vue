<template>
	<!--<div style="display:flex; height:100%; flex-direction:column;">-->
		<!--<div style="height:60px;">-->
			<!--<Header></Header>-->
		<!--</div>-->
		<!--<div style="flex:1">-->
			<!--<nuxt></nuxt>-->
		<!--</div>-->
	<!--</div>-->
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
  components: {
	  Header,
  }
}
</script>

<style>
.el-container, .el-main {
	height:100%;
}
.el-container>.el-header,.el-main,.el-footer{
	padding:0px;
}
</style>
