<template>
	<div class="headerContainer">
		<div class="container full-height flex-col">
			<div class="flex-row">
				<div v-show="isLogin">
					<el-dropdown @command="handleCommand">
						<span class="el-dropdown-link" style="cursor:pointer">
							{{user.aliasname || user.usernam || "逍遥"}}
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>我的主页</el-dropdown-item>
							<el-dropdown-item>设置</el-dropdown-item>
							<el-dropdown-item command="editor">编辑器</el-dropdown-item>
							<el-dropdown-item command="tagModEditor">Tag编辑器</el-dropdown-item>
							<el-dropdown-item command="adiModEditor">Adi编辑器</el-dropdown-item>
							<el-dropdown-item divided command="logout">退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<div v-show="!isLogin">
					<el-button type="text" @click="clickLoginBtn">登陆</el-button>
					<el-button type="text" @click="clickRegisterBtn">注册</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";

import {
	Button, 
	Dropdown, 
	DropdownMenu, 
	DropdownItem
} from "element-ui";

export default {
	components: {
		[Button.name]: Button,
		[Dropdown.name]: Dropdown,
		[DropdownMenu.name]: DropdownMenu,
		[DropdownItem.name]: DropdownItem,
	},

	data: function() {
		return {
		}
	},

	computed: {
		...mapGetters({
			isLogin: "user/isAuthenticated",
			user: "user/user",
		}),
	},

	methods: {
		...mapActions({
			setAuthenticated: "user/setAuthenticated",
			setToken: "user/setToken",
		}),
		handleCommand(cmd){
			if (cmd == "logout") {
				this.setAuthenticated(false);
				this.setToken(undefined);
				this.$router.push({name: g_app.getRouteName("login")});
			} else if (cmd == "editor") {
				this.$router.push({name: g_app.getRouteName("editor")});
			} else if (cmd == "tagModEditor" || cmd == "adiModEditor") {
				this.$router.push({name: g_app.getRouteName(cmd)});
			}
		},
		clickLoginBtn() {
			this.$router.push({name: g_app.getRouteName("login")});
		},
		clickRegisterBtn() {
			this.$router.push({name: g_app.getRouteName("register")});
		},
	}
}
</script>

<style scoped>
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
