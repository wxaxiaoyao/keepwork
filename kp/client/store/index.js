
export const state = () => ({
	counter: 0,
})

export const getters = {
	counter: (state) => state.counter,
}

export const actions = {
	setCounter({commit}, counter) {
		commit("setCounter", counter);
	}
}

export const mutations = {
	setCounter (state, counter) {
		state.counter = counter;
	}
}

