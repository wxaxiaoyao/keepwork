<template>
	<div>
		<el-tree
		  :data="data6"
		  node-key="id"
		  default-expand-all
		  @node-drag-start="handleDragStart"
		  @node-drag-enter="handleDragEnter"
		  @node-drag-leave="handleDragLeave"
		  @node-drag-over="handleDragOver"
		  @node-drag-end="handleDragEnd"
		  @node-drop="handleDrop"
		  draggable
		  :allow-drop="allowDrop"
		  :allow-drag="allowDrag">
		</el-tree>
	</div>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

import {tags} from "@/lib/tags";
import modTest from "../mods/modTest.js";

import mods from "../adi/mod/index.js";
import tagLogin from "../bases/tagLogin.vue";
import {user} from "../../api/keepwork.js";

import toc from "../bases/toc.vue";
export default {
	name:'test',
	data:function(){
		   return {
        data6: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2',
            children: [{
             id: 11,
              label: '三级 3-2-1'
            }, {
              id: 12,
              label: '三级 3-2-2'
            }, {
              id: 13,
              label: '三级 3-2-3'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
	},
	props:{
	},
	computed: {
		...mapGetters({
		}),
	},

	watch: {
	},

	methods: {
		...mapActions({
		}),
		 handleDragStart(node, ev) {
			console.log('drag start', node);
		  },
		  handleDragEnter(draggingNode, dropNode, ev) {
			console.log('tree drag enter: ', dropNode.label);
		  },
		  handleDragLeave(draggingNode, dropNode, ev) {
			console.log('tree drag leave: ', dropNode.label);
		  },
		  handleDragOver(draggingNode, dropNode, ev) {
			console.log('tree drag over: ', dropNode.label);
		  },
		  handleDragEnd(draggingNode, dropNode, dropType, ev) {
			console.log('tree drag end: ', dropNode && dropNode.label, dropType);
		  },
		  handleDrop(draggingNode, dropNode, dropType, ev) {
			console.log('tree drop: ', dropNode.label, dropType);
		  },
		  allowDrop(draggingNode, dropNode) {
			return true;
		  },
		  allowDrag(draggingNode) {
			return true;
		  }
	},

	components:{
		tagLogin,
		toc,
	},

	async mounted(){
	}
}
</script>

