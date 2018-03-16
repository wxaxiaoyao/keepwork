<template>
	<div :style="tag.styles">
		<!--<slot></slot>-->
		<component v-for="x in tag.children" :tag="x" :is="x.tagName"></component>
	</div>
</template>

<script>

export default {
	name: "wikiTag",
	props:["tag"],
	data: function() {
		return {
			tagName:"wikiTag",
		}
	},
	methods: {
		isExist(x) {
			for (var i = 0; i < this.$children.length; i++) {
				var child = this.$children[i];

				if (this.tag.tagId == x.tagId) {
					console.log("无法添加自己");
					return true;
				}

				if (child.tag && child.tag.tagId == x.tagId) {
					console.log("已存在", child._isBeingDestroyed, child._isDestroyed, child._isMounted);
					return true;
				}
			}

			return false;
		}
	},
	created(){
		console.log(this);
	}
}
</script>
