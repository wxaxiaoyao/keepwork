import axios from "axios";
import { Message  } from 'element-ui';

export const keepworkEndpoint = axios.create({
	//baseURL:"",
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
	isLogin: (...args) => get("user/isLogin", ...args).then(res => res.data),
}

export const dataSource = {
	getDefaultDataSource: (...args) => get("dataSource/getDefaultDataSource", ...args).then(res => res.data),
}

export const mod = {
}

export const keepwork = {
	user,
	dataSource,
	mod,
}

export default keepwork;
