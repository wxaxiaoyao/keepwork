
import vue from "vue";
import _ from "lodash";

import baseComponent from "../common/baseComponent.js";
import containerComponent from "../common/containerComponent.vue";

import tag from "./tag.js";

import tags from "../modeditor/tags.js";
import tagEditor from "../common/tagEditor.vue";

import richtext from "./richtext.vue";
import wikiText from "./wikiText.vue";
import wikiRichtext from "./wikiRichtext.vue";
import wikiMarkdown from "./wikiMarkdown.vue";
import wikiCarousel from "./wikiCarousel.vue";

import adiComponents from "./adi.js";

var components =  {
	tag,
	richtext,
	wikiText,
	wikiRichtext,
	wikiCarousel,
	wikiMarkdown,
}

for (var key in components) {
	vue.component(key, components[key]);
}

//function tagComp(value, key) {
	//var name = key || value.name;
	//var compName = "base-" + key;
	//var containerCompName = key + "";
	//vue.component(compName, {
		//mixins:[baseComponent, value],
	//});

	//// 组件上容器
	//vue.component(containerCompName, {
		//props:{
			//componentName: {
				//type:String,
				//default:compName,
			//},
		//},

		//mixins:[containerComponent],

		//components: {
			//tagEditor,
		//},
		//inheritAttrs:false,
	//});

//}

//for (var key in components) {
	//var value = components[key];
	//tagComp(value, key);
//}

//for (var key in adiComponents) {
	//var value = adiComponents[key];
	//tagComp(value, key);
//}


