
<template>
	<div>
		<div @click="click">
			<slot></slot>
		</div>
	</div>
</template>


<script>
import tagContainer from "../common/tagContainer.js";

export default {
	name:"wrap",
	props:{
		mode:{
			type:String,
			default:"normal",
		},
	},

	methods: {
		click() {

		},
	}

	mixins: [tagContainer],
}
</script>
