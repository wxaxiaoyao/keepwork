import { createApp} from "./app.js";

export default context => {
	return new Promise((resolve, reject) => {
		const {app, router, store} = createApp();
		router.push(context.url);
		router.onReady(() => {
			const matchedComponents = router.getMatchedComponents();

			if (!matchedComponents.length) {
				return reject({code:404, message:"没有匹配到路由信息"});
			}

			Promise.all(matchedComponents.map(Component => {
				if (Component.asyncData) {
					return Component.asyncData({store:store, route:router.currentRoute});
				}
			})).then(() => {
				context.state = store.state;
				resolve(app);
			}).catch(reject)
		}, reject);
	});
}
