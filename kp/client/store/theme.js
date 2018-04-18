import vue from "vue";
import _ from "lodash";
import {create} from "jss";
import preset from 'jss-preset-default'

import {themeFactory} from "@/lib/theme";

const jss = create({
	...preset(),
	createGenerateClassName: () => {
		return (rule, sheet) => {
			return rule.key;
		};
	},
});

const theme = {}
const setTheme = function(conf) {
	if (theme.sheet) {
		theme.sheet.detach();
	}

	theme.classStyle = themeFactory(conf);
	theme.data = {};
	theme.sheet = jss.createStyleSheet(theme.classStyle);
	theme.sheet.attach();

	_.forEach(theme.classStyle, (el, key) => {
		theme.data[key] = _.map(el, (val) => val)[0];
	});
}
setTheme();

const SET_THEME_CONF = 'SET_THEME_CONF';

export const state = () => ({
	themeConf:{
		name:"classic",
		colorID:0,
		fontID:0,
	},
})

export const getters = {
	theme: (state) => theme,
}

export const actions = {
	setTheme({commit}, conf) {
		commit(SET_THEME_CONF, conf);
	},
}

export const mutations = {
	[SET_THEME_CONF](state, conf) {
		setTheme(conf);
		vue.set(state, "themeConf", conf);
	},
}

//export default {
	//state,
	//getters,
	//actions,
	//mutations,
//}
