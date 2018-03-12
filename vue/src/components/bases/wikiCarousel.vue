<template>
	<div class="wikiCarousel">
		<el-carousel>
			<el-carousel-item v-for="item in params.items" :key="item.id">
				<img v:if="item.src" :src="item.src"/> 
			</el-carousel-item>
		</el-carousel>
	</div>
</template>


<script>
export default {
	name:"wikiCarousel",
	props:{
		params:{
			type:Object,
			default: function(){
				return {
					items:[
					{
						//src:"http://www.runoob.com/try/bootstrap/layoutit/v3/default3.jpg"
					},
					{
						//src:"http://www.runoob.com/try/bootstrap/layoutit/v3/default3.jpg"
					},
					],
				}
			},
		},
	},
}
</script>

<style>
</style>
