import commonConfig from "../common/config.js";

const defaultConfig = {
	...commonConfig,
	tagModsPath: "keepwork_data/tag_mods.json",
}

const productionConfig = {
	//baseURL: window.location.origin + "/api/v0/",
}

const developmentConfig = {
	//baseURL: "http://localhost:8888/api/v1/",
	baseURL: "http://localhost:8088/api/v0/",
}

//console.log(process.env.NODE_ENV)

const configs = {
	"production": Object.assign({}, defaultConfig, productionConfig),
	"development": Object.assign({}, defaultConfig, developmentConfig),
}

export default configs[process.env.NODE_ENV];
