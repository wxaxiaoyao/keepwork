
import vue from "vue";
import _ from "lodash";

import base from "../common/base.js";
import tag from "../common/tag.js";
import tags from "../modeditor/tags.js";
import tagEditor from "../common/tagEditor.vue";

import container from "./container.vue";
import richtext from "./richtext.vue";
import wikiText from "./wikiText.vue";
import wikiRichtext from "./wikiRichtext.vue";
import wikiMarkdown from "./wikiMarkdown.vue";
import wikiCarousel from "./wikiCarousel.vue";
import wikiVar from "./wikiVar.vue";

var components =  {
	container,
	richtext,
	wikiText,
	wikiRichtext,
	wikiCarousel,
	wikiMarkdown,
	wikiVar,
}


for (var key in components) {
	var value = components[key];

	var compName = "base-" + value.name;
	var containerCompName = value.name + "";
	vue.component(compName, {
		mixins:[base, value],
	});

	var compEditContent = "<tagEditor v-if='isEditorMode' v-on:result='handleResult' :tag='tag'></tagEditor>";
	var compContent = '<' +	compName + ' v-show="!isEditorMode" :tag="tag" v-bind="$attrs" v-on="$listeners"><slot></slot></' + compName + '>';
	var containerTemplate = '<div :style="styles" :class="classes" @click.stop="click" @mouseenter="mouseenter" @mouseleave="mouseleave">'+ compEditContent + compContent + '</div>';
	// 组件上容器
	vue.component(containerCompName, {
		template:containerTemplate,
		mixins:[tag],

		components: {
			tagEditor,
		},
	});
}


