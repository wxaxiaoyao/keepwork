<template>
	<el-container>
		<el-header>
			header
		</el-header>
		<el-main>
			main	
		</el-main>
	</el-container>
</template>

<script>
import {
	Button,
	Container,
	Header,
	Aside,
	Main,
	Footer,
} from "element-ui";

export default {
	components: {
		[Button.name]: Button,
		[Container.name]:Container,
		[Header.name]:Header,
		[Aside.name]:Aside,
		[Main.name]:Main,
		[Footer.name]:Footer,
	}
}
</script>
<style scoped>
</style>
