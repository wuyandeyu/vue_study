<template>
    <div>
        <el-form :rules="rules"
                 ref="loginForm"
                 :model="loginForm"
                 v-loading="loading"
                 element-loading-text="正在登录"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)"
                 class="loginContainer">
            <h3 class="loginTile">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="false" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="false" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" v-model="loginForm.code" auto-complete="false" placeholder="点击图片" style="width: 250px;margin-right: 5px"></el-input>
                <img :src="captchaUrl" @click="updateCaptcha"/>
            </el-form-item>
            <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    //手动导入自己封装请求的模块，可以使用插件方式引入，避免所有组件都要导入
    //import {postRequest} from "@/uitls/api";

    export default {
        name: "Login",
        data(){
            return{
                captchaUrl:"/captcha?time="+new Date(),
                loginForm:{
                    username:"admin",
                    password:"123",
                    code:""
                },
                loading:false,
                checked:true,
                rules:{
                    username:[{required:true,message:"请输入用户名",trigger:'blur'}],
                    password:[{required:true,message:"请输入密码",trigger:'blur'}],
                    code:[{required:true,message:"请输入验证码",trigger:'blur'}]
                }
            }
        },
        methods:{
            updateCaptcha(){
                this.captchaUrl="/captcha?time="+new Date()
            },
            submitLogin(){
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading=true
                        //使用自己封装的请求
                        this.postRequest('/login',this.loginForm).then(resp=>{
                            if(resp){
                                this.loading=false;
                                const tokenStr = resp.object.tokenHead+resp.object.token;
                                window.sessionStorage.setItem("tokenStr",tokenStr);
                                //push,可以回退，replace不能回退
                                let path = this.$route.query.redirect;
                                this.$router.replace((path=='/' || path==undefined) ?'/home':path);
                            }
                        })
                    } else {
                        this.loading=true;
                        this.$message.error('请输入所有字段');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    .loginContainer{
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background:#fff;
        border:1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .loginTile{
        margin: 0 auto 40px auto;
        text-align: center;
    }
    .loginRemember{
        text-align: left;
        margin: 0 0 15px 0;
    }
    .el-form-item__content{
        display: flex;
        align-items: center;
    }
</style>