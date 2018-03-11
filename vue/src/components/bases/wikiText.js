import vue from "vue";

vue.component("wiki-text", {
	template:"<div>{{params.text.text}}</div>",
	props:{
		params:{
			type:Object,
			default: function() {
				return {
					text: {
						text:"文本组件",
					},
				};
			},
		},
	}
});
