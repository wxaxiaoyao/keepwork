import vue from "vue";
import _ from "lodash";
import config from "@/config.js";
import consts from "@/lib/const.js";
import storage from "@/lib/storage.js";
import indexedDB from "@/lib/indexedDB.js";

config.baseURL = window.location.origin + config.apiUrlPrefix;

const app = {
	vue: new vue(),
	_: _,
	config: config,
	consts: consts,
	storage: storage,
	indexedDB: indexedDB,
	pageDB: null,
}

indexedDB.open().then(function(){
	app.pageDB = indexedDB.getStore("sitepage");
});

app.getRouteName = (name) => config.urlPrefix + "-" + name;

window.g_app = app;
