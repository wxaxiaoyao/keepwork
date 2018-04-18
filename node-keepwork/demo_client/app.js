import vue from "vue";
import {sync} from "vuex-router-sync";

import App from "./app.vue";
import {createRouter} from "./router.js";
import {createStore} from "./store.js";

export const createApp = (context) => {
	const router = createRouter();
	const store = createStore();

	sync(store, router);

	const app = new vue({
		router,
		store,
		render: h => h(App),
	});

	return {app, router, store};
}

export default createApp;
