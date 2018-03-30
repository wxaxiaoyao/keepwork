import gitlabApi from "node-gitlab-api";

const defaultConfig = {
	host:"https://gitlab.com",
	token:"Ed9S7hSfiruewMR-jitR",
	ref:"master",
};

function A() {
	return {
		print() {
			console.log("hello world", this.a);
		},
	}
}

function B() {
	var obj = {a:3};
	obj.__proto__ = A();

	return obj;
}

B().print();

export const gitlabFactory = (config) => {
	let cfg = {
		...defaultConfig,
		...(config || {}),
	};
	
	let api  = gitlabApi(cfg);

	let git = {api, cfg};

	return git;
}

export default gitlabFactory();
