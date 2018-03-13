
import vue from "vue";
import wikiText from "./wikiText.vue";
import wikiRichtext from "./wikiRichtext.vue";
import wikiMarkdown from "./wikiMarkdown.vue";
import wikiCarousel from "./wikiCarousel.vue";
import wikiVar from "./wikiVar.vue";

var components =  {
	wikiText,
	wikiRichtext,
	wikiCarousel,
	wikiMarkdown,
	wikiVar,
}


for (var key in components) {
	var value = components[key];
	vue.component(value.name, value);
}


