

export default {
	data: function(){
		return {};
	},
	methods: {
		mouseenter(){
			this.tag.styles["border"] = "1px solid gray";
		},
		mouseleave(){

		},
		click() {
			console.log("--------click---------");
		}
	}
}
