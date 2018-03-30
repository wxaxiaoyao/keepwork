<template>
  <div id="app">
	<router-view></router-view>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'app',

  methods: {
	  ...mapActions({
		  loadTagMods: "mods/loadTagMods",
	  }),
  },

  mounted() {
	  this.loadTagMods();
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

.kp_forbit_copy {
	-moz-user-select: none;  
	-webkit-user-select: none;  
	-ms-user-select: none;
	user-select: none;
}
</style>
