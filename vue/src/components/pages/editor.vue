<template>
	<div>
		<markdown :blocklist="blocklist"></markdown>
	</div>
</template>

<script>
import markdown from '../markdown';

export default {
	name:"editor",
	data: function() {
		return {
			blocklist:[
			{
				//id:1,
				modName:"header",
				cmdName:"header",
				modParams:{
					title:"hello world",
				},
			},
			],
		}
	},
	computed: {
	},
	method: {
	},
	created(){
	},

	components: {
		markdown,
	},
}
</script>

<style>
</style>
