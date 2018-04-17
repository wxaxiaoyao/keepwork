import vue from "vue";

import base from "./base.js";

const styles = {
	"default":`
<div>
	<tag tagName='input' @change.native="change"></tag>
	<el-input v-model="message" @change="change"></el-input>
	<span>{{message}}</span>
	<tag tagName="span">{{message}}</tag>
</div>

		`,

}

export default {
	data: function() {
		return {
			message: "hello world",
			styles: styles,
		}
	},

	mixins:[base],
	methods: {
		change() {
			console.log("----------");
		}
	}
}
