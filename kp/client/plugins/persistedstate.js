import createPersistedState from "vuex-persistedstate";

export default ({store}) => {
	createPersistedState({
		paths: ["user"],
	})(store);
	createPersistedState({
		storage: window.sessionStorage,
		paths: ["dataSource", "mods"],
	})(store);
}
