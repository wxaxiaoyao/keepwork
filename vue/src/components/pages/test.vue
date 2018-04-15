<template>
	<div>
		<markdown></markdown>
	</div>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

import {tags} from "@/lib/tags";
import modTest from "../mods/modTest.js";

export default {
	name:'test',
	data:function(){
	   return {
	   }
	},

	watch: {
	},

	methods: {
		...mapActions({
		}),
	},

	components:{
	},

	async mounted(){
	}
}
</script>

