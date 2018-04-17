import vue from "vue";
import {createRenderer, createBundleRenderer } from "vue-server-renderer";
import serverBundle from "./vue-ssr-server-bundle.json";
import clientManifest from "./vue-ssr-client-manifest.json";

//console.log(clientManifest);
//clientManifest.publicPath = "/static/";
const renderer = createBundleRenderer(serverBundle, {
	runInNewContext: false,
	template:require("fs").readFileSync("./server/views/index.html", "utf-8"),
	clientManifest,
})

export const views = async (ctx, next) => {
	const context = {url: ctx.request.url};
	
	await new Promise((resolve, reject) => {
		renderer.renderToString(context, (err, html) => {
			if (err) {
				ctx.status = 500;
				console.log(err);
				return resolve("FAIL");
			}
			console.log(html);
			ctx.body = html;
			resolve("OK");
		});
	});
}

export default views;
