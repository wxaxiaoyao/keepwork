import vue from "vue";

import config from "@/config.js";
import consts from "@/lib/const.js";
const storage = null;

export const app = {
	vue: new vue(),
	consts: consts,
	config: config,
	storage: () => {
		if (storage) return storage;
		if (process.BROWSER_BUILD) return require("@/lib/storage.js");
		return undefined;
	},
}


export default app;
