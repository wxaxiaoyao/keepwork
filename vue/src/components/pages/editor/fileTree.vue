<template>
	<div class="kp_forbit_copy">
		<el-tree ref="openedTreeComp" :data="openedPageTree" :props="fileTreeProps" node-key="path" :default-expand-all="true" :highlight-current="true" @node-click="clickSelectPage">
			<span class="custom-tree-node" slot-scope="{node, data}">
				<span v-if="data.type == 'tree'" class="custom-tree-node">
					<span>
						<span>{{data.aliasname || data.name}}</span>
					</span>
				</span>
				<span v-if="data.type == 'blob'" class="custom-tree-node">
					<span class="tree-node-text">
						<i v-show="data.isConflict" @click="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
						<i v-show="!data.isConflict" :class='isRefresh(data) ? "fa fa-refresh fa-spin" : isModify(data) ? "fa fa-pencil-square-o" : "fa fa-file-o"'></i>
						<span>{{data.aliasname || data.name}}</span>
					</span>
					<span class="tree-node-btn-group">
						<i @click.stop="clickOpenBtn(data)"class="fa fa-external-link" aria-hidden="true" data-toggle="tooltip" title="访问"></i>
						<i @click.stop="clickGitBtn(data)" class="fa fa-git" aria-hidden="true" data-toggle="tooltip" title="git"></i>
						<i @click.stop="clickCloseBtn(data)" class="fa fa-times" aria-hidden="true" data-toggle="tooltip" title="关闭"></i>
					</span>
				</span>
			</span>
		</el-tree>
		<el-tree ref="treeComp" :data="fileTree" :props="fileTreeProps" 
			node-key="path" :highlight-current="true" @node-click="clickSelectPage">
			<span class="custom-tree-node" slot-scope="{node, data}">
				<span v-if="data.type == 'tree'" class="custom-tree-node">
					<span>
						<span>{{data.aliasname || data.name}}</span>
					</span>
				</span>
				<span v-if="data.type == 'blob'" class="custom-tree-node">
					<span class="tree-node-text">
						<i v-show="data.isConflict" @click="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
						<i v-show="!data.isConflict" :class='isRefresh(data) ? "fa fa-refresh fa-spin" : isModify(data) ? "fa fa-pencil-square-o" : "fa fa-file-o"'></i>
						<span>{{data.aliasname || data.name}}</span>
					</span>
					<span class="tree-node-btn-group">
						<i @click.stop="clickOpenBtn(data)"class="fa fa-external-link" aria-hidden="true" data-toggle="tooltip" title="访问"></i>
						<i @click.stop="clickGitBtn(data)" class="fa fa-git" aria-hidden="true" data-toggle="tooltip" title="git"></i>
						<i @click.stop="clickDeleteBtn(data)" class="fa fa-trash-o" aria-hidden="true" data-toggle="tooltip" title="删除"></i>
					</span>
				</span>
			</span>
		</el-tree>
		<!--<el-tree ref="treeComp" :data="fileTree" :props="fileTreeProps" -->
			<!--node-key="path" :highlight-current="true" -->
			<!--:render-content="renderContent"-->
			<!--@node-click="clickSelectPage">-->
		<!--</el-tree>-->
	</div>
</template>


<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import storage from "../../../lib/storage.js";
import FileTreeNode from "./fileTreeNode.vue";

let pageDB = undefined;

export default {
	components:{
		FileTreeNode,
	},
	data: function(){
		return {
			projectId:4980659,
			rootPath: "xiaoyao",
			fileTreeProps: {
				children:"nodes",
				label:"name",
			},
			fileTree:[],
			openedPages:{},
		}
	},

	computed: {
		...mapGetters({
			tagId: 'getTagId',
			pagePath: 'getPagePath',
			getPageByPath: 'getPageByPath',
			pages: 'getPages',
			switchPage: 'switchPage',
		}),
		openedPageTree() {
			let tree = {name:"已打开页面", type:"tree", path:"", nodes:[]};
			for (var key in this.openedPages) {
				if (!this.openedPages[key]) {
					continue;
				}
				tree.nodes.push(this.openedPages[key]);
			}
			return [tree];
		},
		treeComp() {
			return this.$refs.treeComp;
		},
	},

	watch: {
		pages: function(val) {
			this.fileTree = this.getFileTree();
			this.fileTree[0].aliasname = "我的页面";
		},
		pagePath: function(val) {
		},
	},
	
	methods: {
		...mapActions({
			setPagePath: "setPagePath",
			setPage: "setPage",
			loadPage: "loadPage",
			deletePage: "deletePage",
			setSwitchPage: "setSwitchPage",
			loadTree: "loadTree",
		}),
		renderContent(h, { node, data, store  }){
			return (<FileTreeNode node={node} data={data}></FileTreeNode>)
		},
		getFileTree() {
			var pages = this.pages;
			var roottree = [], i, j, k, name;

			for (var key in pages) {
				var node = pages[key];
				var paths = node.path.split("/");
				var tree = roottree;
				var path = "";

				if (node.type == "blob" && node.path.indexOf(".md") < 0) {
					continue;
				}

				for (j = 0; j < paths.length - 1; j++) {
					name = paths[j];
					for (k = 0; k < tree.length; k++) {
						if (tree[k].name == name && tree[k].type == "tree") {
							break;
						}
					}
					if (k == tree.length) {
						tree.push({
							path: paths.slice(0,j+1).join("/"), 
							name:name, 
							type:"tree", 
							nodes:[]
						});
						tree[k].url = tree[k].path;
					}
					tree = tree[k].nodes;
					
				}
				for (k = 0; k < tree.length; k++) {
					if (tree[k].name == node.name && tree[k].type == node.type){
						break;
					}
				}

				if (k == tree.length) {
					tree.push({nodes:[]});
				} 
				tree = tree[k];

				tree.type = node.type;
				tree.id = node.id;
				tree.path = node.path;
				tree.name = node.name;
				tree.username = paths[0];
				tree.sitename = paths[1];
			}

			return roottree;
		},
		isRefresh(data) {
			return (this.getPageByPath(data.path) || {}).isRefresh;
		},
		isModify(data) {
			return this.getPageByPath(data.path).isModify;
		},
		clickSelectPage(data, node, tree) {
			var self = this;
			setTimeout(function() {
				self.$refs.treeComp.setCurrentKey(self.pagePath);
				self.$refs.openedTreeComp.setCurrentKey(self.pagePath);
			},10);

			if (data.type == "tree") {
				return;
			}

			this.$set(this.openedPages, data.path, data);
			var page = this.getPageByPath(data.path);
			if (page.content == undefined) {
				this.loadPage({path:data.path});
			} else {
				this.setSwitchPage(true);
			}

			this.setPagePath(data.path);
		},
		clickCloseBtn(data) {
			this.$set(this.openedPages, data.path, undefined);
			if (data.path == this.pagePath) {
				this.setPagePath(undefined);
				this.setSwitchPage(true);
				this.$refs.treeComp.setCurrentKey(data.path.replace(/\/[\w\.]*$/, ""));
			}
		},
		clickOpenBtn(data) {
			
		},
		clickGitBtn(data) {
			//window.open()

		},
		clickDeleteBtn(data) {
			this.deletePage({path:data.path});
		},
	},

	mounted() {
		this.loadTree();
	},

	created() {
		var self = this;
		
	}
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
