
const config = {
	urlPrefix: "wiki",
	apiUrlPrefix: "/api/v0",
	pageSuffix:".md",
	tagModsPath: "keepwork_data/tag_mods.json",

	host: "127.0.0.1",
	port: 3000,
}

config.baseURL = "http://" + config.host + ":" + config.port + config.apiUrlPrefix;

export default config;
