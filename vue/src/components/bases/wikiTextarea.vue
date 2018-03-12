
<template>
	<div ref="el" style="-webkit-user-modify:read-write-plaintext-only">{{params.text.text}}</div>
</template>


<script>
import vue from "vue";

export default {
	name:"wikiTextarea",
	data:function() {
		return {};
	},
	computed: {
		rows:function(){
			this.params.text.text = this.params.text.text.trim();
			return (this.params.text.text || "").split("\n").length;
		},
		cols: function(){
			return (this.params.text.text || "").length + 1;
		},
	},
	props:{
		params:{
			type:Object,
			default: function() {
				return {
					text: {
						text:"文本组件",
					},
				};
			},
		},
	},
	methods: {
		blur(){
			console.log("--------");
			console.log(event);
		},
		enter(){
			this.params.text.text = this.params.text.text.trim().split("\n").join("");
			console.log("-----------", this.params.text.text);
		},
		_delete(){
			console.log(this.params.text.text);
		},
	},
	mounted() {
		this.$nextTick(function(){
			var el = document.getElementById(this.$el.id);
			el.onblur = function(){
				console.log("---------");
			}
			console.log([el]);
		});
	}
}
</script>

<style scoped>
textarea {
	border:none;
	font-size: 16px;
	overflow:hidden;
	resize:unset;
}

textarea:focus {
	outline:none;
}
</style>
