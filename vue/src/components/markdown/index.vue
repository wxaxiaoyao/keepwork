<template>
	<div>
		<div v-for="block in blocklist" :key="block.id">
			<block :block="block"></block>
		</div>
	</div>
</template>

<script>
import block from "./block.vue";

export default {
	name: "markdown",
	props: ["mode", "text", "blocklist", "theme"],
	data: function() {
		return {
		};
	},
	computed: {
	},
	method: {
	},
	watch: {
		text: function(val, oldVal) {
			console.log(this, val, oldVal);
		}
	},
	created(){
		//console.log(this) ;
	},
	components:{
		block,
	},
}
</script>

<style>
</style>
