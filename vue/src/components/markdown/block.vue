<template>
	<div>
		<component :is="blockComponent"></component>
	</div>
</template>


<script>
import mods from "../mods";

var styles = [
{
	render: h => (<div id="1" style="background-color:red" class="test">hell owrld</div>)
}
]
export default {
	name:"block",
	props:["block"],

	data: function() {
		return {
			render(h) {
				//var h = function(arg1, arg2, arg3) {return _h(arg1, arg2, arg2); };
				return  (<div>hello world</div>);
			},
		}
	},
	computed: {
		blockComponent(){
			var self = this;
			return {
				name:'blockComponent',
				render: function(h){
					return styles[0].render(h);
				},
			}
		},	
	},
	created(){
		console.log(this);
	},
}
</script>

<style scoped>
.test {
	height: 100px;
}
</style>
