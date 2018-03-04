
define([
	"app",
	"text!wikimod/example/vue.html",
], function(app, htmlContent) {
	var vue = app.vue;

	function render(wikiblock) {
		console.log("0000000000");

		var vm = wikiblock.vm || {};

		vm.message = wikiblock.modParams;
		return htmlContent;
	}

	function renderAfter(wikiblock) {
		console.log(wikiblock);
		var vm = new vue({
			el: wikiblock.$element[0],
			data: {
				message:wikiblock.modParams || "hello world",
			}
		});

		wikiblock.vm = vm;
		console.log(vm);

	}
	return {
		render: render,
		renderAfter: renderAfter,
	}
})
