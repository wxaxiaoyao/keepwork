<template>
	<div>
		<div v-for="(node, index) in nodes" :key="index" :style="style" @click="clickItem(node)">
			<div class="kp_file_item_container">
				<span v-if="node.type == 'tree'">
					<span>
						<span>{{node.name}}</span>
					</span>
				</span>
				<span v-if="node.type == 'blob'">
					<span class="kp_file_item_text">
						<i v-show="node.isConflict" @click="clickFixedConflict(node)" class="fa fa-warning" aria-hidden="true" node-toggle="tooltip" title="冲突"></i>
						<i v-show="!node.isConflict" :class='isRefresh(node) ? "fa fa-refresh fa-spin" : isModify(node) ? "fa fa-pencil-square-o" : "fa fa-file-o"'></i>
						<span>{{node.name}}</span>
					</span>
					<span class="kp_file_item_btn_group">
						<i @click="clickOpenBtn(node)"class="fa fa-external-link" node-toggle="tooltip" title="打开"></i>
						<i @click="clickGitBtn(node)" class="fa fa-git" node-toggle="tooltip" title="git"></i>
						<i @click="clickDeleteBtn(node)" class="fa fa-trash-o" node-toggle="tooltip" title="删除"></i>
					</span>
				</span>
			</div>
			<fileTreeNode v-show="node.isShowSubNode" :nodes="node.nodes" :level="level + 1"></fileTreeNode>
		</div>
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
		nodes: {
			type:Array,
		},
		level: {
			type:Number,
			default: 0,
		},
	},

	computed: {
		...mapGetters({
			tagId: 'getTagId',
			getPageByPath: 'getPageByPath',
			pages: 'getPages',
			switchPage: 'switchPage',
		}),
	},

	methods:{
		isRefresh(data) {
			return (this.getPageByPath(data.path) || {}).isRefresh;
		},
		isModify(data) {
			return this.getPageByPath(data.path).isModify;
		},
		clickItem(node) {
			vue.set(node, "isShowSubNode", !node.isShowSubNode);
			console.log(node);
		},
	},

	created(){
		console.log("---------------------");
		this.style["padding-left"] = this.level * 20 + "px";
	},
}
</script>


<style scoped>
.kp_file_item_container {
	cursor: pointer;
	text-align: left;
	white-space: nowrap;
	position: relative;
	font-size: 14px;
}

.kp_file_item_text {
	width:100%;
	text-overflow:ellipsis;
	overflow-x: hidden;
}

.kp_file_item_btn_group {
	display:none;
}

.kp_file_item_container:hover{
	background-color:#E6E6E6;
}

.kp_file_item_container:hover .kp_file_item_btn_group {
	display:inline;
	margin-right:10px;
	position: absolute;
	top: 0px;
	right: 0px;
}

.kp_file_item_container:hover .kp_file_item_text {
	padding-right:60px;
}
.kp_input_text {
	width:100%;
	border:none;
	border-bottom: 1px solid #A7A7A7;
	font-size: 16px;
	margin-bottom:10px;
}

.kp_input_text:focus {
	outline:none;
	border-bottom-color: #3977AD;
}
</style>
