<template>
	<div class="kp_forbit_copy">
		<el-dialog :visible.sync="isShowNewFile" title="新增文件" width="500px">
			<el-form :model="newFileForm" label-width="80px" label-position="right" style="width:300px;">
				<el-form-item label="类型">
					<el-select v-model="newFileForm.type" placeholder="请选择类型">
						<el-option label="文件" value="blob"></el-option>
						<el-option label="目录" value="tree"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="文件名">
					<el-input v-model="newFileForm.filename" placeholder="请输入文件名"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" v-loading="newFileForm.isLoading">
		        <el-button @click="isShowNewFile = false">取 消</el-button>
				<el-button type="primary" @click="clickSubmitNewFileBtn()">确 定</el-button>
			</div>
		</el-dialog>
		<el-tree ref="openedTreeComp" :data="openedPageTree" :props="fileTreeProps" node-key="path" :default-expand-all="true" :highlight-current="true" @node-click="clickSelectPage">
			<span class="custom-tree-node" slot-scope="{node, data}">
				<span v-if="data.type == 'tree'" class="custom-tree-node">
					<span>
						<span>{{data.aliasname || data.name}}</span>
					</span>
				</span>
				<span v-if="data.type == 'blob'" class="custom-tree-node">
					<span class="tree-node-text">
						<i v-show="data.isConflict" @click.stop="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
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
						<i v-show="data.isConflict" @click.stop="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
						<i v-show="!data.isConflict" :class='isRefresh(data) ? "fa fa-refresh fa-spin" : isModify(data) ? "fa fa-pencil-square-o" : "fa fa-file-o"'></i>
						<span>{{data.aliasname || data.name}}</span>
					</span>
					<span>
						<el-button type="text" @click.native.stop="clickNewFileBtn(data)">+</el-button>
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
						<i @click.stop="clickDeleteBtn(data, node)" class="fa fa-trash-o" aria-hidden="true" data-toggle="tooltip" title="删除"></i>
					</span>
				</span>
			</span>
		</el-tree>
	</div>
</template>


<script>
import {
	Form,
	FormItem,
	Button,
	Dialog,
	Select,
	Option,
	Tree,
	Loading,
	Message,
} from "element-ui";
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import gitlab from "@@/common/api/gitlab.js";
import config from "@/config.js";

vue.use(Loading.directive);

export default {
	components:{
		[Button.name]: Button,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Dialog.name]: Dialog,
		[Select.name]: Select,
		[Option.name]: Option,
		[Tree.name]: Tree,
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
			isShowNewFile:false,
			newFileForm:{ type:"blob", isLoading:false },
		};
	},

	computed: {
		...mapGetters({
			user: "user/user",
			tagId: 'editor/getTagId',
			pagePath: 'editor/getPagePath',
			getPageByPath: 'editor/getPageByPath',
			pages: 'editor/getPages',
			switchPage: 'editor/switchPage',
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
		},
		pagePath: function(val) {
		},
	},
	
	methods: {
		...mapActions({
			setPagePath: "editor/setPagePath",
			setPage: "editor/setPage",
			savePage: "editor/savePage",
			loadPage: "editor/loadPage",
			deletePage: "editor/deletePage",
			setSwitchPage: "editor/setSwitchPage",
			loadTree: "editor/loadTree",
		}),
		getFileTree() {
			var pages = this.pages;
			var roottree = [], i, j, k, name;
			this.filetreeMap = {};

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
				this.filetreeMap[tree.path] = tree;
			}

			return roottree;
		},
		isRefresh(data) {
			return (this.getPageByPath(data.path) || {}).isRefresh;
		},
		isModify(data) {
			return this.getPageByPath(data.path).isModify;
		},
		clickSelectPage(data) {
			var self = this;
			self.setCurrentItem(data.path);
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

			const path = data.path;
			window.location.hash = "#" + path.substring(0, path.length - config.pageSuffix.length);
			this.setPagePath(data.path);
		},
		clickCloseBtn(data) {
			this.$set(this.openedPages, data.path, undefined);
			if (data.path == this.pagePath) {
				this.setPagePath(undefined);
				this.setSwitchPage(true);
				let curKey = data.path.replace(/\/[^\/]*$/, "");
				this.setCurrentItem(curKey);
		   } else {
				this.setCurrentItem(this.pagePath);
		   }
		},
		setCurrentItem(path) {
			var self = this;
			setTimeout(function(){
				//console.log(path);
				self.$refs.treeComp.setCurrentKey(path);
				self.$refs.openedTreeComp.setCurrentKey(path);
			}, 10);	
		},
		clickOpenBtn(data) {
			
		},
		clickGitBtn(data) {
			window.open(gitlab.getFileGitUrl(data.path));
		},
		clickNewFileBtn(data) {
			this.isShowNewFile = true;
			this.newFileForm.data = data;
		},
		async clickSubmitNewFileBtn() {
			const form = this.newFileForm;
			if (!form.filename) {
				this.$message("文件名不能为空");
				return;
			}
			const node = this.newFileForm.data;
			let path = node.path + '/' + form.filename + (form.type == "tree" ? "/.gitkeep" : ".md");
			const page = this.getPageByPath(path);
			if (page && page.path) {
				this.$message("文件已存在");
				return;
			}
			let newNode = {
				path:path,
			    name:form.filename,
			    type:form.type,
			    content:"",
			    url:path.replace(/\.md$/, ""),
			    username:node.username,
			}
			form.isLoading = true;
			await this.savePage(newNode);
			node.nodes.push(_.clone(newNode));
			this.isShowNewFile = false;
			form.isLoading = false;
		},
		async clickDeleteBtn(data, node) {
			await this.deletePage({path:data.path});
			const parentNode = node.parent.data;
			const index = parentNode.nodes.findIndex(d => d.path == data.path);
			parentNode.nodes.splice(index, 1);
		},
	},

	async mounted() {
		await this.loadTree({path:this.user.username});
		const username = this.user.username;
		this.fileTree = this.getFileTree();
		const rootnode = this.fileTree[0] || {username:username, path:username, aliasname:"我的页面", url:username, name:username, type:"tree"};
		this.fileTree[0] = rootnode;
		rootnode.aliasname = "我的页面";

		const hash = this.$route.hash;
		const path =  hash.substring(1) + config.pageSuffix;
		const data = this.filetreeMap[path];
		data && this.clickSelectPage(data);

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
