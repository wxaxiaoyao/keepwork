import axios from "axios";

const httpProto = window.location.origin.replace(/:.*$/, "");

//const host = window.location.host;
const host = "http://localhost:8888";

export const keepworkEndpoint = axios.create({
	baseURL:host + "/api/v1/",
});

export const post = (...args) => keepworkEndpoint.post(...args).then(res => res.data.data);

export const user = {
	login: (...args) => post("user/login", ...args),
}


export const keepwork = {
	user,
}

export default keepwork;
