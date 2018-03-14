
import vue from "vue";
//import _ from "lodash";

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
	vue.component(value.name, value);
	//vue.component(_.kebabCase("wrap-" + value.name)， {
		//template:'<div></div>'
	//})
}


