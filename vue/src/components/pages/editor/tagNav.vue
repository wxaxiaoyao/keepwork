<template>
	<el-tree :data="[rootTag]" 
		draggable
		:allow-drag="allowDrag"
		:allow-drop="allowDrop"
		:props="treeProps" 
		:expand-on-click-node="false" 
		:highlight-current="true" 
		node-key="tagId" ref="tree" @node-click="clickSelectTag" :default-expand-all="true">
		<span :style="customTreeNodeStyle" slot-scope="{ node, data }">
			<span @click="clickSelectTag(data, node)">{{data.aliasname || data.name || data.key || data.tagName}}</span>
			<span>
				<span @click.stop="clickSwapTag(data, -1)" v-show="isShowSortIcon(data, -1)"><i class="fa fa-arrow-up"></i></span>
				<span @click.stop="clickSwapTag(data, +1)" v-show="isShowSortIcon(data, +1)"><i class="fa fa-arrow-down"></i></span>
				<span @click.stop="clickDeleteTag(data)" v-show="isShowDeleteIcon(data)"><i class="fa fa-trash-o"></i></span>
			</span>
		</span>
	</el-tree>
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
			customTreeNodeStyle : {
				"flex": "1",
				"display": "flex",
				"align-items": "center",
				"justify-content": "space-between",
				"font-size": "14px",
				"padding-right": "8px",
			}
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
			setTimeout(function() {
				tree.setCurrentKey(tagId);
			}, 100);
		},
	},
	methods: {
		...mapActions({
			setTagId:'setTagId',
			setHoverTagId:'setHoverTagId',
			setTagPath:"setTagPath",
		}),
		allowDrag(draggingNode) {
			return true;
		},
		allowDrop(draggingNode, dropNode) {
			return dropNode.data.isContainerTag();
		},
		mouseover(tag){
			if (!this.tag) {
				return;
			}
			this.setHoverTagId(tag.tagId);
		},
		clickSelectTag(tag, node) {
			this.setTagId(tag.tagId);
			this.setTagPath(tag.getTagPath());
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

			if (index == parentTag.children.length) {
				this.setTagId(parentTag.tagId);
			} else {
				this.setTagId(parentTag.children[index].tagId);
			}
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
	},
}
</script>

