<template>
	<div class="headerContainer">
		<div class="container full-height flex-col">
			<div class="flex-row">
				<div v-if="isLogin">
					<el-dropdown @command="handleCommand">
						<span class="el-dropdown-link" style="cursor:pointer">
							逍遥<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>我的主页</el-dropdown-item>
							<el-dropdown-item>设置</el-dropdown-item>
							<el-dropdown-item command="editor">编辑器</el-dropdown-item>
							<el-dropdown-item command="tagModEditor">TagModEditor</el-dropdown-item>
							<el-dropdown-item command="adiModEditor">AdiModEditor</el-dropdown-item>
							<el-dropdown-item divided command="logout">退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<div v-else>
					<el-button type="text" @click="clickLoginBtn">登陆</el-button>
					<el-button type="text" @click="clickRegisterBtn">注册</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
export default {
	name:"kpHeader",

	data: function() {
		return {
		}
	},

	computed: {
		...mapGetters({
			isLogin: "user/isAuth",
		}),
	},

	methods: {
		...mapActions({
			setAuth: "user/setAuth",
			setToken: "user/setToken",
		}),
		handleCommand(cmd){
			if (cmd == "logout") {
				this.setAuth(false);
				this.setToken(undefined);
				this.$router.push({name:"login"});
			} else if (cmd == "editor") {
				this.$router.push({name:"editor"});
			} else if (cmd == "tagModEditor" || cmd == "adiModEditor") {
				this.$router.push({name:cmd});
			}
		},
		clickLoginBtn() {
			this.$router.push({name:"login"});
		},
		clickRegisterBtn() {
			this.$router.push({name:"register"});
		},
	}
}
</script>

<style>
.headerContainer {
	background-color: rgb(248,248,248);
	height:100%;
}
.flex-col {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.flex-row {
	display: flex;
	justify-content: flex-end
}
</style>
