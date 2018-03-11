<template>
	<div>
		<div v-if=block.isWikiBlock>
			<component :is="blockComponent" v-if="block.isWikiBlock"></component>
		</div>
		<div v-else>
			<div v-html="block.htmlContent"></div>
		</div>
	</div>
</template>


<script>
import mods from "../mods";

export default {
	name:"block",
	props:["block"],

	data: function() {
		return {
		}
	},
	computed: {
		blockComponent(){
			var self = this;
			var mod = mods[this.block.modName];
			//console.log(self);
			return {
				name:'blockComponent',
				render: function(h){
					return mod.render(self.block, h);
				},
			}
		},	
	},
	created(){
		//console.log(this);
	},
}
</script>

<style scoped>
.test {
	height: 100px;
}
</style>
