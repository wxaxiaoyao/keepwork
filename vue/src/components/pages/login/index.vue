<template>
	<div class="container">
		<el-row>
			<el-col :span="8" :offset="8">
				<el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
					<el-form-item label="用户名:" prop="username">
						<el-input v-model="loginForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码:" prop="password">
						<el-input type="password" v-model="loginForm.password" @keyup.native.enter="submitLoginForm"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click.prevent="submitLoginForm">登陆</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import Cookies from 'js-cookie';
import {mapActions, mapGetters} from "vuex";

import gitlab from "@/api/gitlab.js";
import {user, dataSource, keepworkEndpoint} from "@/api/keepwork.js";
export default {
	name:"tagLogin",
	data:function(){
		return {
			loginForm:{
				username:"",
				password:"",
			},
			loginRules: {
				username: [
				{required:true, message:"用户名不能为空", trigger:"blur"}
				],
				password: [
				{required:true, message:"密码不能为空", trigger:"blur"}
				]
			}
		}
	},
	props:{
	},
	methods: {
		...mapActions({
			setToken:"user/setToken",
			setAuth:"user/setAuth",
			setUserinfo: "user/setUserinfo",
		}),
		async loginSuccess(token, userinfo) {
			const self = this;
			keepworkEndpoint.defaults.headers.common['Authorization'] = token;
			Cookies.set("token", token);
			self.setToken(token);
			self.setAuth(true);
			self.setUserinfo(userinfo);

			const ds = await dataSource.getDefaultDataSource();
			ds && gitlab.initConfig(ds);
			self.$router.push({name:"home"});
		},
		submitLoginForm() {
			const self = this;
			this.$refs.loginForm.validate(function(valid){
				if (!valid) {
					return;
				}
				
				user.login({
					username:self.loginForm.username,
					password:self.loginForm.password,
				}).then(function(data){
					if (!data || !data.token) {
						self.$message("用户名或密码错误");
						return;
					}
					self.loginSuccess(data.token, data.userinfo);
				})
			});
		}
	},
}
</script>
