import vue from "vue";
import {createRenderer, createBundleRenderer } from "vue-server-renderer";
import serverBundle from "../dist/vue-ssr-server-bundle.json";

const renderer = createBundleRenderer(serverBundle, {
	runInNewContext: false,
	template:require("fs").readFileSync("./views/index.html", "utf-8"),
	//clientManifest,
})

export const views = async (ctx, next) => {
	const context = {url: ctx.request.url};
	
	await new Promise((resolve, reject) => {
		renderer.renderToString(context, (err, html) => {
			if (err) {
				ctx.status = 500;
				console.log(err);
				return reject("FAIL");
			}

			console.log(html);
			ctx.body = html;
			resolve("OK");
		});
	});
}

export default views;
