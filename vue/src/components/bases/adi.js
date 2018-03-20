
import mods from "../adi//mod/index.js";
import CompWrapper from "../adi/mod/base/CompWrapper.vue";

var components = {};

components["CompWrapper"] = CompWrapper;

// 注册模块组件
for (var key in mods){
	var mod = mods[key];
	components[key] = function(mod){
		return {
			name: mod.name,
			data: function(){
				return {
				}
			},
			props: {
				mod:{
					type:Object,
					default: function(){
						return {
							modType: mod.name,
							data:{},
						}
					}
				},
				theme:{
					type:Object,
				},
				conf:{
					type:Object,
					default: function() {
						return mod;
					}
				},
			},
			mixins: [mod.mod],
		}
	}(mod);
}


export default components;
