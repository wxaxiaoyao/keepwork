<template>
	<div :style="style" :class="class_"
	   	@click.stop="click" 
		@mouseenter="mouseenter" 
		@mouseleave="mouseleave"> 
		<tagEditor v-if='isShowEditor' v-on:result='handleResult' :tag='tag'></tagEditor>
		<component :is="componentName" v-show="isShowComponent" 
			:style="compStyle" :class="compClass" 
			:tag="tag" :vars="tag.vars || vars" 
			v-bind="$attrs" v-on="$listeners">
			<slot></slot>
		</component>
	</div>
</template>

<script>
import tagEditor from "../common/tagEditor.vue";
import {mapActions, mapGetters} from "vuex";
import tags from "../modeditor/tags.js";
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
		tag: {
			type:Object,
			default: function() {
				return tags.getTag(this.componentName || "div");
			}
		},
		vars: {
			type:Object,
		},
		styles:{
			type: Object,
			default: function() {
				return {
					//"background-color":"gray",
				};
			}
		},
		classes: {
			type: null,
			default: function(){
				return {};
			},
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
		}),
	},
	watch:{
		isActive: function(val, oldVal) {
			this.class_.actived = val;
		},
		classes: function(val, oldVal) {
			oldVal = oldVal || {};
			for (var key in oldVal) {
				delete this.tag.classes[key];
			}
			this.tag.classes = Object.assign(this.tag.classes, this.classes);
		},
		styles: function(val, oldVal) {
			this.tag.styles = Object.assign(this.tag.styles, this.styles);
		},
		vars: function(val, oldVal) {
			if (this.vars) {
				this.tag.vars = Object.assign(this.tag.vars || {}, this.vars);
			}
		},
	},
	methods: {
		...mapActions({
			setTagId:'setTagId',
		}),
		handleResult(payload) {
			console.log(payload, this);	
			this.tag.vars.text.text = payload;
		},
		mouseenter(){
			this.class_.hover = true;
		},
		mouseleave(){
			this.class_.hover = false;
		},
		click() {
			this.setTagId(this.tag.tagId);
		},
	},
	created() {
		//console.log("--------------create---------------",this.tag.tagName);
		//console.log(this, this.componentName);
		//if (!this.tag) {
		//	this.tag = tags.getTag(this.componentName);
		//}
		// 传入值具有较高优先级
		if (this.vars) {
			this.tag.vars = Object.assign(this.tag.vars || {}, this.vars);
		}
		this.tag.styles = Object.assign(this.tag.styles, this.styles);
		this.tag.classes = Object.assign(this.tag.classes, this.classes);
	},

	mounted() {
		var self = this;
		var $parent = self.$parent;
		while($parent && !($parent.tag && $parent.tag.__flag__)) {
			$parent = $parent.$parent;
		}

		if (!$parent) {
			return;
		}

		if ($parent.tag.tagId == self.tag.tagId) {
			return;
		}

		$parent.tag.addTag(self.tag);
	},

	beforeDestroy() {
		
	},

	destroyed() {
		if (!this.tag || !this.tag.parentTag) {
			return;
		}
		//console.log("--------------destroy---------------",this.tag.tagName);
		this.tag.parentTag.deleteTag(this.tag.tagId);
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
