<template>
	<el-tree :data="modTree" :props="modTreeProps" @node-click="clickSelectMod"></el-tree>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

const getModTree = function(mods) {
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
		}
	},

	computed: {
		...mapGetters({
			systemMods:"mods/systemMods",
		}),

		modTree() {
			let mods = _.cloneDeep(this.systemMods);
			return getModTree(mods);
		},
	},

	methods: {
		...mapActions({
		}),
		clickSelectMod(data, node) {
			if (data.type != "style") {
				return ;
			}

			this.$emit("selectMod", data);
		}
	},
}
</script>
