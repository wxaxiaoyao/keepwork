<template>
	<el-tree :data="fileTree" :props="fileTreeProps" @node-click="clickSelectFile">
		<span class="custom-tree-node" slot-scope="{node, data}">
			<span v-if="data.type == 'tree'" class="custom-tree-node">
				<span>
					<span>{{node.label}}</span>
				</span>
			</span>
			<span v-if="data.type == 'blob'" class="custom-tree-node">
				<span class="tree-node-text">
					<i v-show="data.isConflict" @click="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
					<i v-show="!data.isConflict" :class='isRefresh(data) ? "fa fa-refresh fa-spin" : data.isModify ? "fa fa-pencil-square-o" : "fa fa-file-o"'></i>
					<span>{{node.label}}</span>
				</span>
				<span class="tree-node-btn-group">
					<i class="fa fa-external-link"></i>
					<i @click="clickDeleteBtn(data)" class="el-icon-delete"></i>
				</span>
			</span>
		</span>
	</el-tree>
</template>


<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

export default {
	components:{
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
		}
	},

	computed: {
		...mapGetters({
			tagId: 'getTagId',
			getPageByPath: 'getPageByPath',
			pages: 'getPages',
		}),
		tree() {
		},
	},

	watch: {
		pages: function(val) {
			this.fileTree = this.getFileTree();
		}
	},
	
	methods: {
		...mapActions({
			setPagePath: "setPagePath",
			setPageContent: "setPageContent",
			setPage: "setPage",
			loadPage: "loadPage",
			deletePage: "deletePage",

			loadTree: "loadTree",
		}),
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
		clickSelectFile(data, node, tree) {
			if (data.type == "tree") {
				return;
			}

			var page = this.getPageByPath(data.path);
			if (page.content == undefined) {
				this.loadPage({path:data.path});
			} else {
				this.setPageContent(page.content);
			}

			this.setPagePath(data.path);
		},
		clickDeleteBtn(data) {
			this.deletePage({path:data.path});
		},
	},

	mounted() {
		this.loadTree();
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
