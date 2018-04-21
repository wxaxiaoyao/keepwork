<template>
	<div>
		<mavon-editor v-model="value" :value="text"></mavon-editor>
	</div>
</template>


<script>
import vue from "vue";
import mavonEditor from "mavon-editor"; 
import 'mavon-editor/dist/css/index.css';


export default {
	name:"markdownEditor",
	data:function() {
		return {
			value:this.text,
		}
	},
	computed: {
	},
	props:{
		text: {
			type:String,
			default:function() {
				return "";
			},
		}
	},
	watch:{
	},
	methods: {
	},
	mounted() {
	},
	beforeDestroy() {
		// 销毁前将结果返回
		console.log("--------------");
		this.$emit("result", this.value);
	},
	components: {
		mavonEditor: mavonEditor.mavonEditor,
	},
}
</script>

<style scoped>
</style>
