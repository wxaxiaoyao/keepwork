<template>
  <div id="app" @click="click">
	<router-view></router-view>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'app',

  methods: {
	  ...mapActions({
		  setCurrentTag:"setCurrentTag",
	  }),
	  click() {
		  //this.setCurrentTag(undefined);
	  },
  },
  components: {
  },
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	 -webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	height:100%;
}
</style>
