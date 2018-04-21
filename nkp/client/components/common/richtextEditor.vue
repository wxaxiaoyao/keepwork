<template>
	<div>
		<vue-editor v-model="text"></vue-editor>
	</div>
</template>


<script>
import vue from "vue";
import {VueEditor} from "vue2-editor"; 

export default {
	name:"richtextEditor",
	data:function() {
		return {
		}
	},
	computed: {
	},
	props:{
		text: {
			type:String,
			default:"",
		}
	},
	watch:{
	},
	methods: {
	},
	mounted() {
	},
	components: {
		VueEditor,
	}
}
</script>

<style scoped>
</style>
