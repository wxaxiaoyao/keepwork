
<template>
	<div>{{item.id}}</div>
</template>

<script>
export default {
	name:"test",
	asyncData({store, route}) {
		return store.dispatch("fetchItem", route.params.id || 0);
	},

	computed:{
		item() {
			return this.$store.state.items[(this.$route.params || {}).id || 0] || {id:1};
		}
	}
}
</script>
