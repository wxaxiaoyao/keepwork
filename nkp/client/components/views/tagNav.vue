<template>
	<el-tree
		ref="tree"
	   	:data="[rootTag]" 
		draggable
		:allow-drag="allowDrag"
		:allow-drop="allowDrop"
		:props="treeProps" 
		:expand-on-click-node="false" 
		:highlight-current="true" 
		node-key="tagId" 
		@node-click="clickSelectTag" 
		:default-expand-all="true">
		<span :style="customTreeNodeStyle" slot-scope="{ node, data }">
			<span @click="clickSelectTag(data, node)">{{data.aliasname || data.name || data.key || data.tagName}}</span>
			<span v-show="!isRootNode(data)" class="node-btn-container">
				<span @click.stop="clickAddTag(data)"><i class="fa fa-plus" data-toggle="tooltip" title="添加"></i></span>
				<span @click.stop="clickDeleteTag(data)"><i class="fa fa-minus" data-toggle="tooltip" title="删除"></i></span>
			</span>
		</span>
	</el-tree>
</template>

<script>
import {
	Tree,
} from "element-ui";
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import tags from "@/lib/tags";

export default {
	components: {
		[Tree.name]: Tree,
	},

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
			tagId: 'editor/getTagId',
			getMode: "editor/getMode",
			hoverTagId:"editor/getHoverTagId",
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
			setTagId:'editor/setTagId',
			setHoverTagId:'editor/setHoverTagId',
			setTagPath:"editor/setTagPath",
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
		isRootNode(tag) {
			if (!this.rootTag || this.rootTag.tagId == tag.tagId) {
				return true;
			}

			return false;
		},
		clickAddTag(tag) {
			const cloneTag = tags.getTagByTag(tag);
			const parentTag = tag.parentTag;
			const index = parentTag.children.findIndex(t => t.tagId === tag.tagId);			
			parentTag.children.splice(index,0, cloneTag);
		},
		clickDeleteTag(tag) {
			var parentTag = tag.parentTag;
			var index = parentTag.children.findIndex(t => t.tagId === tag.tagId);			
			parentTag.children.splice(index,1);

			if (index == parentTag.children.length) {
				this.setTagId(parentTag.tagId);
			} else {
				this.setTagId(parentTag.children[index].tagId);
			}
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

<style scoped>
.node-btn-container>span {
	margin-right: 5px;
}
</style>
