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
	props: ["text", "blocklist", "theme"],
	data: function() {
		return {
		};
	},
	computed: {
	},
	method: {
	},
	created(){
		console.log(this) ;
	},
	components:{
		block,
	},
}
</script>

<style>
</style>
