import vue from "vue";
import {createRenderer, createBundleRenderer } from "vue-server-renderer";
import serverBundle from "../dist/vue-ssr-server-bundle.json";

//const renderer = createRenderer();

const renderer = createBundleRenderer(serverBundle, {
	runInNewContext: false,
	//template,
	//clientManifest,
})

export const views = (ctx, next) => {
	const context = {url: ctx.request.url};

	renderer.renderToString(context, (err, html) => {
		if (err) {
			ctx.status = 500;
			console.log(err);
			return;
		}

		ctx.body = html;
	});
}


export default views;
