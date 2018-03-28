<template>
	<el-tree :data="modTree" :props="modTreeProps" @node-click="clickSelectMod"></el-tree>
</template>

<script>

import mods from "../../adi/mod/index.js";

const getModTree = function() {
	var trees = [];
	for (var key in mods) {
		var mod = mods[key];
		var tree = {type:"mod", label:key, children:[]};
		trees.push(tree);

		for (var i = 0; i < mod.styles.length; i++) {
			var style = mod.styles[i];
			tree.children.push({
				type:"style",
				modData: {
					styleID: i,
				},
				label: style.name || ("style" + i),
				mod: mod,
			});
		}
	}

	return trees;
}

export default {
	name:"modTree",
	data: function() {
		return {
			modTreeProps: {
				children:"children",
				label:"label",
			},
			modTree:getModTree(),
		}
	},

	methods: {
		clickSelectMod(data, node) {
			if (data.type != "style") {
				return ;
			}

			this.$emit("selectMod", data);
		}
	},
}
</script>
