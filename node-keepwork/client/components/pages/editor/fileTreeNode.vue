<template>
	<div class="custom-tree-node">
		<span class="custom-tree-node">
			<span v-if="data.type == 'tree'" class="custom-tree-node">
				<span>
					<span>{{data.name}}</span>
				</span>
			</span>
			<span v-if="data.type == 'blob'" class="custom-tree-node">
				<span class="tree-node-text">
					<i v-show="data.isConflict" @click="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
					<i v-show="!data.isConflict" :class='isRefresh(data) ? "fa fa-refresh fa-spin" : isModify(data) ? "fa fa-pencil-square-o" : "fa fa-file-o"'></i>
					<span>{{data.name}}</span>
				</span>
				<span class="tree-node-btn-group">
					<i @click="clickOpenBtn(data)"class="fa fa-external-link" data-toggle="tooltip" title="打开"></i>
					<i @click="clickGitBtn(data)" class="fa fa-git" aria-hidden="true" data-toggle="tooltip" title="git"></i>
					<i @click="clickDeleteBtn(data)" class="fa fa-trash-o" data-toggle="tooltip" title="删除"></i>
				</span>
			</span>
		</span>
	</div>
</template>


<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

export default {
	name:"fileTreeNode",
	data: function() {
		return {
			style:{

			},
		}
	},
	props:{
		node: {
			type:Object,
		},
		data: {
			type:Object,
		},
	},

	computed: {
		...mapGetters({
			getPageByPath: 'getPageByPath',
			pages: 'getPages',
			switchPage: 'switchPage',
		}),
	},

	methods:{
		isRefresh(data) {
			return this.getPageByPath(data.path).isRefresh;
		},
		isModify(data) {
			return this.getPageByPath(data.path).isModify;
		},
	},

	created(){
	},
}
</script>


<style scoped>
.custom-tree-node {
	flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.custom-tree-node i {
	margin-right:2px;
}
.tree-node-text {
	flex:8;
	text-overflow:ellipsis;
	overflow-x: hidden;
}
.tree-node-btn-group {
	flex:2;
	display:none;
}
.custom-tree-node:hover .tree-node-btn-group {
	display:flex;
	justify-content:flex-end;
}
</style>
