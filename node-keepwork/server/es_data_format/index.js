
//import userinfo from "./userinfo.js";
//import siteinfo from "./siteinfo.js";
//import pageinfo from "./pageinfo.js";

const formats = {
	//userinfo,
	//siteinfo,
	//pageinfo,
}

export const esDataFormat = (ctx, next) => {
	const data = ctx.data || {gitlabWebhook:{}};
	const filelist = data.gitlabWebhook.filelist || [];

	console.log(data);
}

export default formats;
