<template>
	<el-tree :data="modTree" :props="modTreeProps" :default-expand-all="true">
		<span class="custom-tree-node" slot-scope="{ node, data }">
			<span>{{ node.label }}</span>
			<span >
				<el-button v-if="data.type == 'style'"
					type="text"
					size="mini"
					@click.stop="edit(data)">
					Edit
				</el-button>
				<el-button 
					type="text"
					size="mini"
					@click.stop="remove( data)">
					Delete
				</el-button>
			</span>
		</span>
	</el-tree>
</template>

<script>
import {
	Tree,
	Button,
} from "element-ui";
import {mapActions, mapGetters} from "vuex";

export default {
	components: {
		[Tree.name]: Tree,
		[Button.name]: Button,
	},

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
		edit(data) {
			this.$emit("editModStyle", data.style);
		},
		remove(data) {
			if (data.type == "style") {
				var style = data.style;
				style.tag = undefined;
				this.setTagModStyle(style);
			} else {
				this.deleteTagMod(data.modName);
			}
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
