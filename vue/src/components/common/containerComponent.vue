<template>
	<div :style="style" :class="class_"
	   	@click.stop="click" 
		@mouseenter="mouseenter" 
		@mouseleave="mouseleave"> 
		<tagEditor v-if='isShowEditor' v-on:result='handleResult' :tag='tag'></tagEditor>
		<component :is="componentName" v-show="isShowComponent" 
			:style="compStyle" :class="compClass" :tag="tag" :vars="tag.vars || vars" 
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
				
			},
		}
	},
	props: {
		tag: {
			type:Object,
			default: function(){
				return tags.getTag(this.tagName || "div");
			},
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
			type: Object,
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
			if (this.tag && this.currentTag && this.tag.tagId == this.currentTag.tagId) {
				return true;
			}

			return false;
		},
		...mapGetters({
			currentTag: 'getCurrentTag',
			getMode: "getMode",
		}),
	},
	methods: {
		...mapActions({
			setCurrentTag:'setCurrentTag',
		}),
		handleResult(payload) {
			console.log(payload, this);	
			this.tag.vars.text.text = payload;
		},
		mouseenter(){
			//console.log("----------");
		},
		mouseleave(){
		},
		click() {
			console.log("-------setCurrentTag---------", this.tag);
			this.setCurrentTag(this.tag);
		},
	},
	created() {
		//console.log(this.componentName);
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
		if (!this.tag || !this.tag.parentTag) {
			return;
		}

		this.tag.parentTag.deleteTag(this.tag.tagId);
	},

	components: {
		tagEditor,
	},
	inheritAttrs:false,
}
</script>
