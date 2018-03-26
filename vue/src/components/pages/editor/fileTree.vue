<template>
	<el-tree :data="tree" :props="fileTreeProps" @node-click="clickSelectFile">
		<span class="custom-tree-node" slot-scope="{node, data}">
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
		</span>
	</el-tree>
</template>


<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

export default {
	data: function(){
		return {
			projectId:4980659,
			rootPath: "xiaoyao",
			fileTreeProps: {
				children:"nodes",
				label:"text",
			}
		}
	},

	computed: {
		...mapGetters({
			tagId: 'getTagId',
			trees: 'gitlab/trees',
		}),
		tree() {
			var filter = function(node) {
				var path = node.path;
				if (node.type == "tree") {
					node.text = node.name;
					node.url = node.path;
					node.pagename = node.text;
					return true;
				}
				if (path.indexOf(".md") == path.length - 3) {
					node.text = node.name.substring(0, node.name.length-3);
					node.url = node.path.substring(0, node.path.length-3);
					node.pagename = node.text;
					return true;
				}
				return false;
			}
			var trees = this.trees[this.projectId] || [];
			var roottree = [], i, j, k, name;

			if (!trees || !trees[this.rootPath]) {
				return [];
			}
			var datas = trees[this.rootPath];
			for (i = 0; i < datas.length; i++) {
				var node = datas[i];
				var paths = node.path.split("/");
				var tree = roottree;
				var path = "";

				if (!filter(node)) {
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
							text:name, 
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
					node.nodes = [];
					tree.push(node);
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
	},

	watch: {
		tree: function(val) {
			console.log(val);
		}
	},
	
	methods: {
		...mapActions({
			setTree:"gitlab/setTree",
			setPagePath: "setPagePath",
		}),
		clickSelectFile(data, node, tree) {
			//console.log(data);
			if (data.type == "blob") {
				this.setPagePath(data.path);
			}
		},
	},

	mounted() {
		this.setTree({projectId: this.projectId, path: this.rootPath, recursive:true});
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
</style>
