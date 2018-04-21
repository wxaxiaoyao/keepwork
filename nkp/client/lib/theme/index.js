import _ from "lodash";

import themeData from "./theme.data.js";


const theme = {};

for (var key in themeData) {
	var data = themeData[key];
	var colors = data.colors;
	var fonts = data.fonts;

	theme[key] = {
		name:data.name,
		colors:[],
		fonts:[],
	};

	for (var i = 0; i < colors.length; i++) {
		var color = colors[i];
		var themeColor = {};

		for (var j = 0; j < color.length; j++) {
			themeColor["color_" + j] = {"color" : color[j]};
		}
	
		theme[key].colors.push(themeColor);
	}

	for (var i = 0; i < fonts.length; i++) {
		var font = fonts[i];
		var themeFont = {};

		for (var j = 0; j < font.length; j++) {
			themeFont["font_" + j] = {"font-size" : font[j] + "px"};
		}

		theme[key].fonts.push(themeFont);
	}
}

export const themeFactory = (conf) => {
	conf = conf || {
		name: "classic",
		colorID:0,
		fontID:0,
	};

	var color = theme[conf.name].colors[conf.colorID];
	var font = theme[conf.name].fonts[conf.fontID];
	return _.assign(color, font);
}

export default theme;
