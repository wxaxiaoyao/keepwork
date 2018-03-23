<template>
	<div class="wikiCarousel">
		<el-carousel>
			<el-carousel-item v-for="(item, index) in vars.items" :key="index">
				<img v:if="item.src" :src="item.src"/> 
			</el-carousel-item>
		</el-carousel>
	</div>
</template>


<script>
export default {
	name:"wikiCarousel",
	data: function(){
		return {
			vars: {
				items: [
				{
					src:"http://img.bizhi.sogou.com/images/2012/02/11/25025.jpg",
				},
				{
					src:"http://attachments.gfan.com/forum/attachments2/day_120401/1204011624df11f94022720c66.jpg",
				},
				{
					src:"http://img6.3lian.com/c23/desk/7/02/011.jpg",
				},
				],
			},
		}
	},
	props:{
	},
}
</script>

<style scoped>
img {
	width:100%;
	height:100%;
}
</style>
