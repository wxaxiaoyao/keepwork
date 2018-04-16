import vue from "vue";
import {createRenderer, createBundleRenderer } from "vue-server-renderer";

const renderer = createRenderer();

//const _renderer = createBundleRenderer(serverBundle, {
	//runInNewContext: false,
	////template,
	////clientManifest,
//})
const createApp = (context) => {
	return new vue({
		data: {
			url: context.url
		},
		template:"<div>你访问的URL: {{url}}</div>",
	});
}

export const views = (ctx, next) => {
	const app = createApp({url:ctx.request.url});
	renderer.renderToString(app, (err, html) => {
		if (err) {
			ctx.status = 500;
			return;
		}

		ctx.body = `
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `;
		
	});
}


export default views;
