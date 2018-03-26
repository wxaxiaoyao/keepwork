<template>
	<div class="custom-tree-node" slot-scope="{node, data}">
		<span v-if="data.type == 'tree'" class="custom-tree-node">
			<span>
				<span>{{node.label}}</span>
			</span>
		</span>
		<span v-if="data.type == 'blob'" class="custom-tree-node">
			<span style="text-overflow:ellipsis">
				<i class="el-icon-loading" v-if="data.type == 'blob'"></i>
				<span>{{node.label}}</span>
			</span>
			<span>
				<i class="fa fa-external-link"></i>
				<i class="el-icon-delete"></i>
			</span>
		</span>
	</div>
</template>


<script>
export default {
	props:{
		node: {
			type:Object,
		}
	},
}
</script>


<style scoped>
</style>
