<template>
	<el-tabs type="border-card">
		<!--<el-tab-pane label="Tag导航">-->
			<!--<div>-->
				<!--<div style="cursor:pointer">-->
					<!--<span v-for="x in navTagList" :key="x.id" @click="clickSelectTag(x)">-->
						<!--<i class="fa fa-chevron-right"></i>{{x.name || x.type}}-->
					<!--</span>-->
				<!--</div>-->
				<!--<div v-if="tag && tag.children">-->
					<!--<div v-for="(x, $index) in tag.children" :key="x.tagId" class="navTagSubItemContainer">-->
						<!--<span @click="clickSelectTag(x)">-->
							<!--{{x.name || x.type || x.tagName}}-->
						<!--</span>-->
						<!--<span @click.stop="clickDeleteTag(x)"><i class="fa fa-trash-o"></i></span>-->
						<!--<span v-show="$index != 0" @click.stop="clickSwapTag(x, -1)"><i class="fa fa-arrow-up"></i></span>-->
						<!--<span v-show="$index != tag.children.length - 1" @click.stop="clickSwapTag(x, 1)"><i class="fa fa-arrow-down"></i></span>-->
					<!--</div>-->
				<!--</div>-->
			<!--</div>-->
		<!--</el-tab-pane>-->
		<el-tab-pane label="TagTree">
			<el-tree :data="[rootTag]" :props="treeProps" :expand-on-click-node="false" :highlight-current="true" 
				node-key="tagId" ref="tree" @node-click="clickSelectTag">
				<span @mouseover="mouseover(data)" class="custom-tree-node" slot-scope="{ node, data }">
					<el-button size="mini" type="text" @click="clickSelectTag(data, node)">{{node.label}}</el-button>
					<el-button size="mini" type="text" @click.stop="clickDeleteTag(data)" v-show="isShowDeleteIcon(data)">DELETE</el-button>
					<el-button size="mini" type="text" @click.stop="clickSwapTag(data, -1)" v-show="isShowSortIcon(data, -1)">UP</el-button>
					<el-button size="mini" type="text" @click.stop="clickSwapTag(data, +1)" v-show="isShowSortIcon(data, +1)">DOWN</el-button>
					<!--<span @click.stop="clickDeleteTag(data)" v-show="isShowDeleteIcon(data)"><i class="el-icon-delete"></i></span>-->
					<!--<span @click.stop="clickSwapTag(data, -1)" v-show="isShowSortIcon(data, -1)"><i class="el-icon-sort-up"></i></span>-->
					<!--<span @click.stop="clickSwapTag(data, +1)" v-show="isShowSortIcon(data, +1)"><i class="el-icon-sort-down"></i></span>-->
			  	</span>
			</el-tree>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

export default {
	data: function() {
		return {
			treeProps: {
				label:function(data, node) {
					return data.name || data.tagName;
				},
				children:"children",
			},
		}
	},
	props: {
		rootTag: {
			type:Object,
		},
		tag: {
			type:Object,	
		}
	},
	computed: {
		...mapGetters({
			tagId: 'getTagId',
			getMode: "getMode",
			hoverTagId:"getHoverTagId",
		}),
		navTagList() {
			if (!this.tag) {
				return;
			}
			var navTagList = [];
			var tmpTag = this.tag;
			var count = 0;
			while(tmpTag) {
				navTagList.push(tmpTag);
				tmpTag = tmpTag.parentTag;
				count++;
				if (count == 2) {
					break;
				}
			}
			navTagList.reverse();
			return navTagList;
		},
	},
	watch:{
		tagId: function(tagId) {
			if (!tagId) {
				return;
			}
			var tree = this.$refs.tree;
			tree.setCurrentKey(tagId);
		},
	},
	methods: {
		...mapActions({
			setTagId:'setTagId',
			setHoverTagId:'setHoverTagId',
		}),
		mouseover(tag){
			if (!this.tag) {
				return;
			}
			this.setHoverTagId(tag.tagId);
		},
		clickSelectTag(tag, node) {
			this.setTagId(tag.tagId);
			this.$emit("selectTag", tag);
		},
		isShowDeleteIcon(tag) {
			if (!this.rootTag || this.rootTag.tagId == tag.tagId) {
				return false;
			}

			return true;
		},
		isShowSortIcon(tag, offset) {
			var parentTag = tag.parentTag;
			if (!parentTag || !parentTag.children) {
				return false;
			}

			var index = parentTag.children.findIndex(t => t.tagId === tag.tagId);			
			
			index += offset;

			//console.log(tag.tagId, offset, index);
			if (index < 0 || index >= parentTag.children.length) {
				return false;
			}

			return true;
		},
		clickDeleteTag(tag) {
			if (this.rootTag.tagId == tag.tagId) {
				return;
			}

			var parentTag = tag.parentTag;
			var index = parentTag.children.findIndex(t => t.tagId === tag.tagId);			
			parentTag.children.splice(index,1);
		},
		clickSwapTag(tag, offset) {
			var parentTag = tag.parentTag;
			var index1 = parentTag.children.findIndex(t => t.tagId === tag.tagId);			
			var index2 = index1 + offset;	

			var tmp = parentTag.children[index1];
			vue.set(parentTag.children, index1, parentTag.children[index2]);
			vue.set(parentTag.children, index2, tmp);
			
			var tree = this.$refs.tree;
			var tag1 = parentTag.children[index1];
			var tag2 = parentTag.children[index2];
			tree.remove(tree.getNode(tag1));
			if (index1 < index2) {
				tree.insertBefore(tag1, tree.getNode(tag2));
			} else {
				tree.insertAfter(tag1, tree.getNode(tag2));
			}
			//this.$forceUpdate();
		},
  	},
	created() {
	},
	mounted() {
		if (!this.rootTag) {
			return;
		}
		//this.$refs.tree.setCurrentKey(this.rootTag.tagId);
	},
}
</script>

<style>
.navTagSubItemContainer {
	paddiv-left:20px;
}
.navTagSubItemContainer:hover{
	cursor:pointer;
}
.custom-tree-node: {
	
}
.custom-tree-node span:hover {
}
</style>
