<template>
	<el-tree :data="modTree" :props="modTreeProps" @node-click="clickSelectModStyle">
		<span class="custom-tree-node" slot-scope="{ node, data }">
			<span>{{ node.label }}</span>
			<span >
			</span>
		</span>
	</el-tree>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
	name:'modTree',

	data: function() {
		return {
			modTreeProps: {
				label:"label",
				children:"children",
			},
		}
	},

	computed: {
		...mapGetters({
			tagMods: "mods/tagMods",
			getTagMod: "mods/tagMod",
		}),
		modTree() {
			let tree = [];
			for (var key in this.tagMods) {
				var mod = this.tagMods[key];
				var node = {
					label: mod.aliasName || mod.modName,
					modName: mod.modName,
					children:[],
					type:"mod",
				}

				_.map(mod.styles, (style) => {
					node.children.push({
						label: style.aliasName || style.styleName,
						styleName: style.styleName,
						type:'style',
						style: _.cloneDeep(style),
					});
				});

				tree.push(node);
			}
			//console.log(tree);

			return tree;
		},
	},

	methods: {
		...mapActions({
			setTagMod:"mods/setTagMod",
			deleteTagMod: "mods/deleteTagMod",
			setTagModStyle:"mods/setTagModStyle",
		}),
		clickSelectModStyle(data) {
			if (data.type != "style") {
				return;
			}
			g_app.events.$emit(g_app.consts.EVENT_ADD_MOD_TO_EDITOR, data.style);
		},
	}
}
</script>

<style>
.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
}
</style>
