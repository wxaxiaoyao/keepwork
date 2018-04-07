import axios from "axios";

const httpProto = window.location.origin.replace(/:.*$/, "");

//const host = window.location.host;
const host = "http://localhost:8888";

export const keepworkEndpoint = axios.create({
	baseURL:host + "/api/v1/",
});

export const post = (...args) => keepworkEndpoint.post(...args).then(res => res.data.data);

export const get = (url, params, config) => keepworkEndpoint.get(url, {
   	params:params,
	...(config || {}),
}).then(res => res.data.data);

export const user = {
	login: (...args) => post("user/login", ...args),
	register: (...args) => post("user/register", ...args),
	isLogin: (...args) => get("user/is_login", ...args),
}

export const dataSource = {
	getDefaultDataSource: (...args) => get("data_source/get_default_data_source", ...args),
}

export const mod = {
}

export const keepwork = {
	user,
	dataSource,
	mod,
}

export default keepwork;
