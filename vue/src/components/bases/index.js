
import vue from "vue";
import _ from "lodash";

import baseComponent from "../common/baseComponent.js";
import containerComponent from "../common/containerComponent.vue";

import tags from "../modeditor/tags.js";
import tagEditor from "../common/tagEditor.vue";

import baseTag from "./baseTag.vue";
import wikiTag from "./wikiTag.vue";

import richtext from "./richtext.vue";
import wikiText from "./wikiText.vue";
import wikiRichtext from "./wikiRichtext.vue";
import wikiMarkdown from "./wikiMarkdown.vue";
import wikiCarousel from "./wikiCarousel.vue";

var components =  {
	baseTag,
	wikiTag,
	richtext,
	wikiText,
	wikiRichtext,
	wikiCarousel,
	wikiMarkdown,
}


for (var key in components) {
	var value = components[key];

	var compName = "base-" + value.name;
	var containerCompName = value.name + "";
	vue.component(compName, {
		mixins:[value, baseComponent],
	});

	// 组件上容器
	vue.component(containerCompName, {
		props:{
			componentName: {
				type:String,
				default:compName,
			},
		},

		mixins:[containerComponent],

		components: {
			tagEditor,
		},
		inheritAttrs:false,
	});
}


