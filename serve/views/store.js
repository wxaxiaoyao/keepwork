import vue from "vue";
import vuex from "vuex";

vue.use(vuex);

const fetchItem = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({id:id});
		}, 1000)
	});
}
export function createStore() {
	return new vuex.Store({
		state: {
			items:{},
		},

		actions: {
			fetchItem({commit}, id) {
				return fetchItem(id).then(item => {
					commit("setItem", {id, item});
				})
			}
		},

		mutations: {
			setItem(state, {id, item}) {
				vue.set(state.items, id, item);
			}
		}
	})
}
