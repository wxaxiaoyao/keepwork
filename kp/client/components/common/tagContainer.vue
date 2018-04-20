<template>
	<div :style="style" :class="class_"
		@mouseover.stop="mouseover" 
		@mouseout.stop="mouseout"> 
		<tagEditor v-if='isShowEditor' v-on:result='handleResult' :tag='tag'></tagEditor>
		<slot v-show="isShowComponent" @click.native="click"></slot>
	</div>
</template>

<script>
import tagEditor from "../common/tagEditor.vue";
import {mapActions, mapGetters} from "vuex";
import {tags} from "../../lib/tags";
import _const from "../../lib/const.js";

export default {
	data:function(){
		return {
			isShowEditor:false,
			isShowComponent:true,
			style:{

			},
			class_:{
				componentContainerClass: true,
				actived:false,
				hover:false,
			},
		}
	},
	props: {
		tag:{
			type:null,
		},
	},
	computed: {
		compStyle() {
			return this.tag.styles;	
		},
		compClass(){
			return this.tag.classes;
		},
		isEditorMode() {
			if (this.getMode != _const.EDITOR_MODE_EDITOR) {
				return false;
			}
			return true;
		},
		isActive() {
			if (this.getMode != _const.EDITOR_MODE_EDITOR) {
				return false;
			}
			if (this.tag && this.tagId && this.tag.tagId == this.tagId) {
				return true;
			}

			return false;
		},
		...mapGetters({
			tagId: 'getTagId',
			getMode: "getMode",
			hoverTagId:"getHoverTagId",
		}),
	},
	watch:{
		isActive: function(val, oldVal) {
			this.class_.actived = val;
		},
		hoverTagId: function(tagId, oldTagId) {
			if (this.tag.tagId == tagId) {
				this.class_.hover = true;
			} else {
				this.class_.hover = false;
			}
			this.oldHoverTagId = oldTagId;
		},
	},
	methods: {
		...mapActions({
			setTagId:'setTagId',
			setHoverTagId: "setHoverTagId",
		}),
		handleResult(payload) {
			this.tag.vars.text.text = payload;
		},
		mouseover(){
			if (!this.tag) {
				return;
			}
			this.setHoverTagId(this.tag.tagId);
		},
		mouseout(){
		},
		click() {
			this.setTagId(this.tag.tagId);
		},
	},
	created() {
	},

	mounted() {
	},

	beforeDestroy() {
	},

	destroyed() {
	},

	components: {
		tagEditor,
	},

	inheritAttrs:false,
}
</script>

<style scoped>
.componentContainerClass {

}
.componentContainerClass:hover {
	cursor: pointer;
}
.hover {
	border: 1px dashed red;
}
.actived {
	border: 1px solid green;
}
</style>
