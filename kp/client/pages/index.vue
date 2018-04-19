<template>
  <section class="container">
    <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Universal Vue.js Application Framework
    </h1>
    <nuxt-link class="button" to="/about">
	  About page
    </nuxt-link>
	<div>{{counter}}</div>
  </section>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import yaml from "js-yaml";

export default {
	computed: {
		...mapGetters({
			counter: "counter",
		}),
	},

	mounted() {
		const str = yaml.safeDump({key:"test", data:{key:1}});
		console.log(str);
		console.log(yaml.safeLoad(str));
	}
}
</script>
<style scoped>
.title
{
  margin: 50px 0;
}
</style>
