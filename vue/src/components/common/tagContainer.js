
import {mapActions, mapGetters} from "vuex";

export default {
	data: function(){
		return {};
	},
	computed: {
		...mapGetters({
			getCurrentTag: 'getCurrentTag',
		}),
	},
	methods: {
		...mapActions({
			setCurrentTag:'setCurrentTag',
		}),
		mouseenter(){
			this.tag.styles["border"] = "1px solid gray";
		},
		mouseleave(){

		},
		click() {
			console.log("--------click---------");
			console.log(this);
			this.setCurrentTag(this.kp_tag);
		}
	}
}
