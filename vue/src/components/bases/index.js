
import vue from "vue";
import wikiText from "./wikiText.vue";
import wikiTextarea from "./wikiTextarea.vue";
import wikiCarousel from "./wikiCarousel.vue";


var components =  {
	wikiText,
	wikiTextarea,
	wikiCarousel,
}


for (var key in components) {
	var value = components[key];
	vue.component(value.name, value);
}


