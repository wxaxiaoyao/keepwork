
<template>
	<div @blur="blur"
		@focus="focus"

		v-html="params.text.text"
		style="-webkit-user-modify:read-write-plaintext-only"></div>
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
						text:"文本域组件",
					},
				};
			},
		},
	},
	watch:{
	},
	methods: {
		focus(){
			console.log("--------focus---------------");
		},
		blur(){
			console.log("--------blur----------------");
			this.params.text.text = this.$el.innerHTML;
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
