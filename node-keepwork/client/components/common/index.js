import vue from "vue";

import tag from "./tag.js";

var components = {
	tag,
}


for (var key in components) {
	vue.component(key, components[key]);
}
