
import vue from "vue";
import _ from "lodash";

import common from "./common.js";
import wikiMd from "./wikiMd.vue";
import wikiCarousel from "./wikiCarousel.vue";
import adiComponents from "./adi.js";

var components =  {
	wikiMd,
	wikiCarousel,
}

for (var key in components) {
	var component = components[key];
	vue.component(key, {
		mixins:[common, component],
	});
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


