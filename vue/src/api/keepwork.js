import axios from "axios";
import { Message  } from 'element-ui';

const httpProto = window.location.origin.replace(/:.*$/, "");

//const host = window.location.host;
const host = "http://localhost:8888";

export const keepworkEndpoint = axios.create({
	baseURL:host + "/api/v1/",
});

const resultHandle = res => {
	const error = res.data.error;
	if (error.id) {
		Message.error(error.message);
	}

	return res.data.data;
}

export const post = (...args) => keepworkEndpoint.post(...args).then(res => res.data);

export const get = (url, params, config) => keepworkEndpoint.get(url, {
   	params:params,
	...(config || {}),
}).then(res => res.data);

export const user = {
	login: (...args) => post("user/login", ...args),
	register: (...args) => post("user/register", ...args),
	isLogin: (...args) => get("user/is_login", ...args).then(res => res.data),
}

export const dataSource = {
	getDefaultDataSource: (...args) => get("data_source/get_default_data_source", ...args).then(res => res.data),
}

export const mod = {
}

export const keepwork = {
	user,
	dataSource,
	mod,
}

export default keepwork;
