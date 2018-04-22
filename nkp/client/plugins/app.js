import vue from "vue";
import _ from "lodash";
import config from "@/config.js";
import consts from "@/lib/consts.js";
import storage from "@/lib/storage.js";
import indexedDB from "@/lib/indexedDB.js";
import {keepworkEndpoint} from "@@/common/api/keepwork.js";

config.baseURL = window.location.origin + config.apiUrlPrefix;

keepworkEndpoint.defaults.baseURL = config.baseURL;

const app = {
	vue: new vue(),
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

window._ = _;
window.g_app = app;
