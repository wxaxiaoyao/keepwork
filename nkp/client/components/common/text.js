
export default {
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
		_style:{
			type:Object,
			default:function(){
				return {
					"-webkit-user-modify":"read-write-plaintext-only",
					"-webkit-line-break": "normal",
					"-webkit-tap-highlight-color":"rgba(0,0,0,0)",
					"outline":"none;",
				}
			}
		},
	},
	methods: {
		focus(){
		},
		blur(){
			this.params.text.text = this.$el.innerHTML;
		},
		keyup(){
		},
		enter(){
		},
	},
	created(){
	},
}
