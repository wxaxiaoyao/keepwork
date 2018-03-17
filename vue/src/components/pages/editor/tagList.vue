
<template>
	<div>
		<div v-for="node in tagTree" :key="node.id">
			<div @click="clickExpandTag(node)" style="cursor:pointer">
				<span><i :class='node.isExpand ? "fa fa-chevron-down" : "fa fa-chevron-right"'></i></span>
				<span>{{node.classify}}</span>
			</div>
			<div v-show="node.isExpand" style="margin-left:20px">
				<div v-for="x in node.nodes" :key="x.id">
					<span style="width:100px">{{x.name || x.type}}</span>
					<span @click="clickSelectTag(x)" style="cursor:pointer">+</span>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import vue from "vue";
import tags from "../../modeditor/tags.js";

export default {
	data: function() {
		return {
			tagTree: tags.tagTree(),
		}
	},
	methods: {
		clickExpandTag(node){
			vue.set(node, "isExpand", !node.isExpand);
		},
		clickSelectTag(tag) {
			this.$emit("selectTag", tag);
		},
	}
}
</script>
