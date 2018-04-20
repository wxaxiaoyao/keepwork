<template>
  <div class="container">
    <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Universal Vue.js Application Framework
    </h1>
    <nuxt-link class="button" to="/about">
	  About page
    </nuxt-link>
	<tag :tag="tag"></tag>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import tag from "@/components/common/tag.js";
import tags from "@/lib/tags";

export default {
	data: function() {
		return {
			tag: tags.getTag("p")
		}
	},

	computed: {
		...mapGetters({
			counter: "counter",
		}),
	},

	mounted() {
	},

	components: {
		tag,
	}
}
</script>
<style scoped>
.title
{
  margin: 50px 0;
}
</style>
