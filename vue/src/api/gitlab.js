
import gitlabApi from "node-gitlab-api";

const defaultConfig = {
	host:"https://gitlab.com",
	token:"Ed9S7hSfiruewMR-jitR",
};


export const gitlabFactory = (config) => gitlabApi({
	...defaultConfig,
	...(config || {}),
});


export default gitlabFactory();
