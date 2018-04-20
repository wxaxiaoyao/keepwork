<template>
	<div class="container" style="margin-top:40px">
		<el-row>
			<el-col :span="8" :offset="8">
				<el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-width="80px">
					<el-form-item label="用户名:" prop="username">
						<el-input v-model="registerForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码:" prop="password">
						<el-input type="password" v-model="registerForm.password" @keyup.native.enter="submitRegisterForm"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click.prevent="submitRegisterForm">注册</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import Cookies from 'js-cookie';
import {mapActions, mapGetters} from "vuex";

//import gitlab from "common/api/gitlab.js";
//import {user, dataSource, keepworkEndpoint} from "common/api/keepwork.js";
import gitlab from "../../../common/api/gitlab.js";
import {user, dataSource, keepworkEndpoint} from "../../../common/api/keepwork.js";
export default {
	name:"register",
	data:function(){
		return {
			registerForm:{
				username:"",
				password:"",
			},
			registerRules: {
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
			setUser: "user/setUser",
		}),
		async registerSuccess(token, userinfo) {
			const self = this;
			keepworkEndpoint.defaults.headers.common['Authorization'] = token;
			Cookies.set("token", token);
			self.setToken(token);
			self.setAuth(true);
			self.setUser(userinfo);

			const ds = await dataSource.getDefaultDataSource();
			ds && gitlab.initConfig(ds);
			self.$router.push({name:"home"});
		},
		submitRegisterForm() {
			const self = this;
			this.$refs.registerForm.validate(function(valid){
				if (!valid) {
					return;
				}
				
				user.register({
					username:self.registerForm.username,
					password:self.registerForm.password,
				}).then(function(data){
					if (data.code != 0) {
						self.$message(data.message);
						return;
					}
					data = data.data;
					self.registerSuccess(data.token, data.userinfo);
				})
			});
		}
	},
}
</script>
