<template>
	<div>editor</div>
</template>

<script>
import dataSource from "../../api/dataSource.js";

export default {
	name:"editor",
	method: {

	},
	created(){
		dataSource.getContent({path:"/xiaoyao/xiaoyao/wxa.md"}, function(data){
			console.log(data);
		}, function(){
			console.log("---------");
		});
	},
}
</script>

<style>
</style>
