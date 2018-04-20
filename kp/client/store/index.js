
export const state = () => ({
	counter: 0,
})

export const getters = {
	counter: (state) => state.counter,
}

export const actions = {
	//nuxtServerInit({commit}, {req}) {
		//if (process.server && req && req.ctx.state.user) {
			//commit("user/SET_USER", req.ctx.state.user);
			//commit("user/SET_AUTHENTICATED", true);
		//}
	//},
	setCounter({commit}, counter) {
		commit("setCounter", counter);
	}
}

export const mutations = {
	setCounter (state, counter) {
		state.counter = counter;
	}
}

