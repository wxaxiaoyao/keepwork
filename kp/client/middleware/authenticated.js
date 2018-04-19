
export default function({store, redirect, req}) {
	if (process.server && !req) return;

	const isAuthenticated = process.server ? req.ctx.state.user : store.getters["user/isAuthenticated"];
	
	if (!isAuthenticated) {
		return redirect("/www/login");
	}
}
