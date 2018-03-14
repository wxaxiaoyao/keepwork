
<template>
	<div @click="click"
		:style="kp_tag.styles">
		<component v-for="x in kp_tag.children" :kp_tag="x" :is="x.tagName"></component>
		<slot></slot>
	</div>
</template>

<script>
import tagContainer from "../common/tagContainer.js";

export default {
	name: "container",
	mixins:[tagContainer],
}
</script>
