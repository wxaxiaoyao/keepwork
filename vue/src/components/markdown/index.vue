<template>
	<div @blur="blur"
		@focus="focus"
		@keyup="keyup"
		style="-webkit-user-modify:read-write-plaintext-only;
			   -webkit-line-break: normal;
			   -webkit-tap-highlight-color:rgba(0,0,0,0);
			   outline:none;">
		<div v-for="block in blocklist" :key="block.id">
			<block :block="block"></block>
		</div>
	</div>
</template>

<script>
import block from "./block.vue";

export default {
	name: "markdown",
	props: ["params"],
	data: function() {
		return {
		};
	},
	computed: {
		blocklist(){
			var blocks = [];
			return this.params.blocks.list || blocks;
		},
	},
	methods: {
		focus(){
			console.log("--------focus---------------");
		},
		blur(){
			console.log("--------blur----------------");
		},
		keyup(){
			console.log("----------keyup-------------");
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
	},
	watch: {
	},
	created(){
	},
	components:{
		block,
	},
}
</script>

<style>
</style>
