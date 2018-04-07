<template>
	<el-row>
		<el-col :span="8" :offset="8">
			<el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
				<el-form-item label="用户名:" prop="username">
					<el-input v-model="loginForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码:" prop="password">
					<el-input type="password" v-model="loginForm.password"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click.prevent="submitLoginForm">登陆</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
</template>

<script>

import {user} from "@/api/keepwork.js";
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
					console.log(data);
				})
			});
		}
	},
}
</script>
