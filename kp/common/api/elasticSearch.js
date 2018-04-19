
import elasticsearch from "elasticsearch";

const defaultConfig = {
	host: "http://10.28.18.7:9200",
}

const client = new elasticsearch.Client({
	...defaultConfig,
});

export const elasticsearchFactory = (config) => {
	return new elasticsearch.Client({
		...defaultConfig,
		...(config || {}),
	});
}

export default client;
