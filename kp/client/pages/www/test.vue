<template>
	<div>
	   	hello world
		<component :is="component"></component>
	</div>
</template>

<script>


export default {
	data: function() {
		return {
			path: "../../components/views/test.vue",
			component:{
				template:"<div></div>"
			},
		}
	},

	mounted() {
		//const test = () => import("../../components/views/test.vue");
		//this.component = test;
	}
}
</script>

