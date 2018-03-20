<template>
	<div>
		<!--<wikiParent attr1="attr1" attr2="attr2" ></wikiParent>-->
		<ModTitle></ModTitle>
	</div>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

import tags from "../modeditor/tags.js";

vue.component("wikiParent", {
	template:"<div><wikiChild v-bind='$attrs'></wikiChild></div>",
	inheritAttrs:false,
});

vue.component("wikiChild", {
	template:"<p><span>{{$data.test}}</span>hello world</p>",
	props:["attr1"],
	data:function() {
		return {
			tagName:"wiki-child",
			$test:"test",
		}
	},

	mounted:function(){
		//console.log(this);
	},

	//mixins: [tag],
})

export default {
	name:'test',
	data:function(){
		return {
			tag:tags.getTag("colDiv"),
		}
	},
	props:{
		vars:{
			type:Object,
			default:undefined,
		},
	},
	computed: {
	},

	watch: {
		getCurrentTag: function(val, oldVal) {
			console.log(val);
		},
	},

	methods: {
	},
	
	//mixins: [tag, tagContainer],

	components:{
	},

	mounted(){
		//console.log(this);
	}
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
