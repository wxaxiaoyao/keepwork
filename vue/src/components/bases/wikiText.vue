
<template>
	<span v-html="params.text.text"></span> 
</template>	

<script>
export default {
	name:"wikiText",
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
}

</script>
