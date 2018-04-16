import vue from "vue";

import App from "./app.vue";
import {createRouter} from "./router.js";

export const createApp = (context) => {
	const router = createRouter();
	const app = new vue({
		router,
		render: h => h(App),
	});

	return {app, router};
}

export default createApp;
