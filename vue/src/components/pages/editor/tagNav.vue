<template>
	<el-tabs type="border-card">
		<el-tab-pane label="Tag导航">
			<div>
				<div style="cursor:pointer">
					<span v-for="x in navTagList" :key="x.id" @click="clickSelectTag(x)">
						<i class="fa fa-chevron-right"></i>{{x.name || x.type}}
					</span>
				</div>
				<div v-if="tag && tag.children">
					<div v-for="(x, $index) in tag.children" :key="x.tagId" class="navTagSubItemContainer">
						<span @click="clickSelectTag(x)">
							{{x.name || x.type}}
						</span>
						<span @click.stop="clickDeleteTag($index)"><i class="fa fa-trash-o"></i></span>
						<span v-show="$index != 0" @click.stop="clickSwapTag($index - 1, $index)"><i class="fa fa-arrow-up"></i></span>
						<span v-show="$index != tag.children.length - 1" @click.stop="clickSwapTag($index, $index + 1)"><i class="fa fa-arrow-down"></i></span>
					</div>
				</div>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

export default {
	data: function() {
		return {
		}
	},
	props: {
		tag: {
			type:Object,
		}
	},
	computed: {
		navTagList() {
			if (!this.tag) {
				return;
			}
			var navTagList = [];
			var tmpTag = this.tag;
			while(tmpTag) {
				navTagList.push(tmpTag);
				tmpTag = tmpTag.parentTag;
			}
			navTagList.reverse();
			return navTagList;
		},
	},
	watch:{
		tag: function(tag){
		}
	},
	methods: {
		...mapActions({
			setCurrentTag:'setCurrentTag',
		}),
		clickSelectTag(x) {
			this.$emit("selectTag", x);
		},
		clickDeleteTag(index) {
			this.tag.children.splice(index,1);
		},
		clickSwapTag(index1, index2) {
			var tag = this.tag;
			if (index1 < 0 || index2 >= tag.children.length) {
				return;
			}
			var tmp = tag.children[index1];
			vue.set(tag.children, index1, tag.children[index2]);
			vue.set(tag.children, index2, tmp);
		},
  	}
}
</script>

<style scoped>
.navTagSubItemContainer {
	paddiv-left:20px;
}
.navTagSubItemContainer:hover{
	cursor:pointer;
}
</style>
