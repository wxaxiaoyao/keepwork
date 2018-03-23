<template>
	<codemirror ref="codemirror" :value="code" :options="cmOptions" @input="onCmCodeChange"></codemirror>
</template>


<script>
import {codemirror} from "vue-codemirror";

export default {
	components: {
		codemirror,
	},
}
</script>
